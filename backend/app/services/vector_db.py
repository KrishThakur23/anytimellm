import logging
import uuid
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document as LCDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
import os

# Set API keys in environment for langchain integrations
if settings.PINECONE_API_KEY:
    os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
if settings.GEMINI_API_KEY:
    os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY

logger = logging.getLogger(__name__)

# Global instances
_embeddings_client = None
_pinecone_index = None

# Local in-memory vector store for fallback when credentials are missing
class LocalMockVectorStore:
    def __init__(self):
        # schema: {namespace: [{id: str, text: str, metadata: dict}]}
        self.store: Dict[str, List[Dict[str, Any]]] = {}

    def upsert(self, texts: List[str], metadatas: List[dict], namespace: str):
        if namespace not in self.store:
            self.store[namespace] = []
        for text, meta in zip(texts, metadatas):
            doc_id = str(uuid.uuid4())
            self.store[namespace].append({
                "id": doc_id,
                "text": text,
                "metadata": meta
            })
        logger.info(f"Mock upserted {len(texts)} chunks into namespace '{namespace}'")

    def similarity_search(self, query: str, namespace: str, k: int = 4) -> List[LCDocument]:
        logger.info(f"Mock similarity search in namespace '{namespace}' for query: '{query}'")
        if namespace not in self.store:
            return []
        
        # Simple text matching scoring for mock fallback
        results = []
        query_words = set(query.lower().split())
        for doc in self.store[namespace]:
            doc_text = doc["text"].lower()
            # Score is word intersection count
            score = sum(1 for word in query_words if word in doc_text)
            results.append((doc, score))
        
        # Sort by score descending
        results.sort(key=lambda x: x[1], reverse=True)
        
        # Return top k as LangChain Documents
        return [
            LCDocument(page_content=item[0]["text"], metadata=item[0]["metadata"])
            for item in results[:k]
        ]

local_mock_store = LocalMockVectorStore()


def get_embeddings():
    global _embeddings_client
    if _embeddings_client is not None:
        return _embeddings_client
        
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not found. Vector search embeddings will use MockEmbeddings.")
        from langchain_community.embeddings import FakeEmbeddings
        _embeddings_client = FakeEmbeddings(size=768)
        return _embeddings_client

    try:
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        _embeddings_client = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=settings.GEMINI_API_KEY,
            output_dimensionality=768
        )
        return _embeddings_client
    except Exception as e:
        logger.error(f"Error initializing Gemini embeddings: {e}. Falling back to FakeEmbeddings.")
        from langchain_community.embeddings import FakeEmbeddings
        _embeddings_client = FakeEmbeddings(size=768)
        return _embeddings_client


def get_pinecone_index():
    global _pinecone_index
    if _pinecone_index is not None:
        return _pinecone_index

    if not settings.PINECONE_API_KEY:
        logger.warning("PINECONE_API_KEY not found. Pinecone integration will operate in MOCK fallback mode.")
        return None

    try:
        from pinecone import Pinecone
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Verify index exists or prompt user
        index_name = settings.PINECONE_INDEX_NAME
        existing_indexes = [idx.name for idx in pc.list_indexes()]
        
        if index_name not in existing_indexes:
            logger.warning(f"Pinecone index '{index_name}' does not exist. Please create a 768-dimension index in Pinecone.")
            
        _pinecone_index = pc.Index(index_name)
        return _pinecone_index
    except Exception as e:
        logger.error(f"Error initializing Pinecone: {e}. Using mock fallback.")
        return None


def index_document_text(text: str, business_id: str, document_id: str, file_name: str):
    """Splits text into chunks, generates embeddings, and upserts them to Pinecone (isolated by business_id namespace)."""
    if not text.strip():
        logger.warning(f"Empty text provided for ingestion in doc {document_id}")
        return

    # 1. Chunk document text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_text(text)
    
    # 2. Build metadata
    metadatas = [
        {
            "business_id": str(business_id),
            "document_id": str(document_id),
            "file_name": file_name,
            "chunk_index": i
        }
        for i, _ in enumerate(chunks)
    ]
    
    namespace = str(business_id)
    
    # 3. Check for credentials and choose Pinecone or Mock
    index = get_pinecone_index()
    if index is None:
        local_mock_store.upsert(chunks, metadatas, namespace)
        return

    try:
        from langchain_pinecone import Pinecone as LCPinecone
        embeddings = get_embeddings()
        
        LCPinecone.from_texts(
            texts=chunks,
            embedding=embeddings,
            index_name=settings.PINECONE_INDEX_NAME,
            namespace=namespace,
            metadatas=metadatas
        )
        logger.info(f"Successfully indexed {len(chunks)} chunks in Pinecone namespace: {namespace}")
    except Exception as e:
        logger.error(f"Failed to index documents to Pinecone: {e}. Upserting to Mock store instead.")
        local_mock_store.upsert(chunks, metadatas, namespace)


def search_vector_store(query: str, business_id: str, k: int = 4) -> List[LCDocument]:
    """Query semantic vector space within a business's namespace."""
    namespace = str(business_id)
    index = get_pinecone_index()
    
    if index is None:
        return local_mock_store.similarity_search(query, namespace, k)
        
    try:
        from langchain_pinecone import Pinecone as LCPinecone
        embeddings = get_embeddings()
        
        # Load from existing index
        vector_store = LCPinecone.from_existing_index(
            index_name=settings.PINECONE_INDEX_NAME,
            embedding=embeddings,
            namespace=namespace
        )
        return vector_store.similarity_search(query, k=k)
    except Exception as e:
        logger.error(f"Failed to query Pinecone: {e}. Searching Mock store instead.")
        return local_mock_store.similarity_search(query, namespace, k)


def delete_document_vectors(business_id: str, document_id: str):
    """Deletes vectors associated with a document_id within a business_id namespace."""
    namespace = str(business_id)
    index = get_pinecone_index()
    if index is not None:
        try:
            index.delete(filter={"document_id": str(document_id)}, namespace=namespace)
            logger.info(f"Deleted vectors for document {document_id} from Pinecone namespace {namespace}")
        except Exception as e:
            logger.error(f"Failed to delete vectors from Pinecone: {e}")
            
    if namespace in local_mock_store.store:
        original_len = len(local_mock_store.store[namespace])
        local_mock_store.store[namespace] = [
            doc for doc in local_mock_store.store[namespace]
            if str(doc["metadata"].get("document_id")) != str(document_id)
        ]
        new_len = len(local_mock_store.store[namespace])
        logger.info(f"Deleted {original_len - new_len} chunks for document {document_id} from Mock store namespace {namespace}")
