# AnytimeLLM System Run Guide & Walkthrough

AnytimeLLM is a multi-tenant business customer service agent system. It parses client documents (PDFs, text, web scrapes), registers catalogs (menus, items), and runs a LangGraph RAG agent using Google Gemini. It interfaces with clients via a Web Chat widget or the Meta WhatsApp Cloud API.

This walkthrough outlines how to set up, configure, and run the backend API server, database container, and Next.js frontend application.

---

## 🏗️ System Architecture Overview

```
                        +----------------------------+
                        |     Next.js Web Client     |
                        +--------------+-------------+
                                       | HTTP / JSON
                                       v
+-----------------------+      +-------+-------------+      +-------------------+
|  Meta WhatsApp Cloud  +----->|  FastAPI Backend    |<---->|  Google Gemini    |
|  API Webhook / Chat   |      +---+-------------+---+      |  LangGraph Agent  |
+-----------------------+          |             |          +-------------------+
                                   | SQLAlchemy  | Pinecone / Mock
                                   v             v
                        +----------+---+     +---+----------+
                        |  PostgreSQL  |     |   Pinecone   |
                        |   Database   |     | Vector Store |
                        +--------------+     +--------------+
```

### Resilient Mock Fallbacks (Zero-Configuration Testing)
To enable local testing without immediately requiring API keys:
- **No Gemini API Key**: The agent falls back to a simulated mock LLM parser (`MockLLM` in `backend/app/services/agent/graph.py`) that handles simulated tool calls, and text embeddings fall back to a fake 768-dimension embedder.
- **No Pinecone API Key**: Vector indexing and querying automatically fall back to an in-memory database (`LocalMockVectorStore` in `backend/app/services/vector_db.py`) that scores matches by string word overlaps.

---

## 🛠️ Step-by-Step Execution Guide

Follow these steps to run AnytimeLLM locally on your Windows machine.

### 📋 Prerequisites
Make sure you have the following installed on your machine:
- **Docker Desktop** (to run PostgreSQL)
- **Node.js** (v18.0.0+ or v20.0.0+ recommended)
- **Python 3.10+**

---

### Step 1: Run the Database Container

The repository includes a `docker-compose.yml` file that provisions a pre-configured PostgreSQL database.

1. Open a terminal (PowerShell or Command Prompt).
2. Start the database service in detached (background) mode:
   ```powershell
   docker compose up -d
   ```
3. To verify that the database is running, execute:
   ```powershell
   docker ps
   ```
   You should see a running container named `anytimellm-postgres` mapped to port `5432`.

---

### Step 2: Configure Backend Environment Variables

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Copy the template `.env.example` file to `.env`:
   * **PowerShell**:
     ```powershell
     Copy-Item .env.example .env
     ```
   * **CMD / Command Prompt**:
     ```cmd
     copy .env.example .env
     ```
3. Open `backend/.env` in your editor and configure the parameters:
   * **Database Config**: The default connection string (`postgresql://postgres:postgrespassword@localhost:5432/anytimellm`) matches the PostgreSQL container started in Step 1.
   * **Google Gemini API Key**: Insert your API key as `GEMINI_API_KEY`. If left blank, mock chatbot responses will be used.
   * **Pinecone API Key**: Paste your `PINECONE_API_KEY` and define your index name as `PINECONE_INDEX_NAME`. Note that if using Gemini Embeddings, your Pinecone index must be created with **768 dimensions** (using cosine or dot product distance).

---

### Step 3: Run the FastAPI Backend Server

1. **Activate the Virtual Environment**:
   A virtual environment (`venv`) is already present in the workspace root. Run the appropriate command for your terminal:
   * **PowerShell**:
     ```powershell
     
     ```
   * **CMD / Command Prompt**:
     ```cmd
     ..\venv\Scripts\activate.bat
     ```
   * **Git Bash / Linux / macOS**:
     ```bash
     source ../venv/bin/activate
     ```
2. **Install Dependencies**:
   Ensure all Python packages are up-to-date:
   ```powershell
   pip install -r requirements.txt
   ```
3. **Start the FastAPI Application**:
   Run uvicorn to start the local development server:
   ```powershell..\venv\Scripts\Activate.ps1
   python -m app.main
   ```
   *Alternatively, you can run:*
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```
4. **Verify Startup**:
   * Watch the console output. You should see logs indicating database tables initialization:
     ```text
     [INFO] app.main: Initializing relational database tables...
     [INFO] app.main: Database tables initialized successfully.
     ```
   * Open `http://localhost:8000/` in your browser. You should receive:
     ```json
     {
       "status": "healthy",
       "service": "AnytimeLLM Backend",
       "version": "1.0.0"
     }
     ```
   * You can access the auto-generated Swagger UI interactive documentation at `http://localhost:8000/docs`.

---

### Step 4: Run the Next.js Frontend App

1. Open a new terminal window (keep the backend server running).
2. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
3. **Install Node Packages**:
   Install all dependencies listed in the frontend package configuration:
   ```powershell
   npm install
   ```
4. **Configure Frontend Environment Variable (Optional)**:
   By default, the frontend requests `http://localhost:8000` as the backend endpoint. If your backend is running on a different port or host, create a `.env.local` file inside the `frontend` folder and specify:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:<YOUR_PORT>
   ```
5. **Start Dev Server**:
   Launch the Next.js development server:
   ```powershell
   npm run dev
   ```
6. **Open the Application**:
   Navigate to `http://localhost:3000` in your web browser.

---

## 🧪 Verifying System Functionality

Once both servers are running:
1. **Tenant Registration**: In the web UI, register a new client business tenant.
2. **Catalog Management**: Add structural services or items (e.g. products, dental procedures, cleaning packages) with categories and pricing.
3. **Knowledge Ingestion**: Upload a text document/PDF or supply a website URL to crawl. The backend will parse the content, split it into chunks, and vector-index it (using Pinecone or mock local database).
4. **Agent Chat**: Initiate a chat in the UI chat pane. Test queries such as:
   * *"What are your cleaning services?"* (queries structural catalog database tool)
   * *"What is your return policy?"* (queries unstructured vector store tool)
   * *"Place an order for a deep cleaning package"* (uses order placement tool, creating a pending order database entry)
5. **Database verification**: You can inspect the SQLite or PostgreSQL database to confirm that tenant, document chunk metadata, catalog items, and orders are correctly persistent.

---

## 🛡️ WhatsApp Webhook Configuration

If deploying WhatsApp integration:
1. Meta Cloud API webhooks route incoming messages to the backend webhook router `/api/webhook/whatsapp`.
2. To test webhooks locally:
   * Set up a tunnel tool like [ngrok](https://ngrok.com/):
     ```bash
     ngrok http 8000
     ```
   * Set the webhook endpoint in the Meta App Dashboard to `https://<YOUR_NGROK_SUBDOMAIN>.ngrok-free.app/api/webhook/whatsapp`.
   * Provide the `META_WA_VERIFY_TOKEN` configured in your `.env` for WhatsApp authentication verify step.


nice