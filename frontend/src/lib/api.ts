const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface Business {
  id: string;
  name: string;
  api_settings: {
    system_prompt?: string;
    wa_verify_token?: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface CatalogItem {
  id?: string;
  category?: string;
  name: string;
  description?: string;
  price?: number;
  attributes?: Record<string, any>;
  is_available?: boolean;
  created_at?: string;
}

export interface DocumentInfo {
  id: string;
  file_name: string;
  file_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary?: string;
  created_at: string;
}

export interface ChatMessage {
  sender: 'customer' | 'agent';
  content: string;
  created_at: string;
}

export interface Order {
  id: string;
  business_id: string;
  customer_id: string;
  details: {
    items: {
      name: string;
      quantity: number;
      price?: number;
    }[];
  };
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'customer' | 'agent';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  customer_id: string;
  channel: string;
  status: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  last_message_content?: string;
  messages: Message[];
  is_ai_paused: boolean;
}

export const api = {
  async registerBusiness(name: string): Promise<Business> {
    const res = await fetch(`${BACKEND_URL}/api/businesses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to register business tenant.");
    return res.json();
  },

  async getBusiness(id: string): Promise<Business> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${id}`);
    if (!res.ok) throw new Error("Failed to fetch business details.");
    return res.json();
  },

  async uploadFile(businessId: string, file: File): Promise<DocumentInfo> {
    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("file", file);

    const res = await fetch(`${BACKEND_URL}/api/ingest/file`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to upload and parse file.");
    }
    return res.json();
  },

  async crawlUrl(businessId: string, url: string): Promise<DocumentInfo> {
    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("url", url);

    const res = await fetch(`${BACKEND_URL}/api/ingest/url`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed crawling URL.");
    }
    return res.json();
  },

  async getDocuments(businessId: string): Promise<DocumentInfo[]> {
    const res = await fetch(`${BACKEND_URL}/api/ingest/${businessId}`);
    if (!res.ok) throw new Error("Failed to list business documents.");
    return res.json();
  },

  async addCatalogItem(businessId: string, item: CatalogItem): Promise<CatalogItem> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/catalog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to register catalog item.");
    return res.json();
  },

  async getCatalog(businessId: string): Promise<CatalogItem[]> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/catalog`);
    if (!res.ok) throw new Error("Failed to fetch catalog list.");
    return res.json();
  },

  async chatWithAgent(businessId: string, content: string, customerPhone: string): Promise<ChatMessage> {
    const res = await fetch(`${BACKEND_URL}/api/chat/${businessId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, customer_phone: customerPhone }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed calling agent api.");
    }
    return res.json();
  },

  async getOrders(businessId: string): Promise<Order[]> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/orders`);
    if (!res.ok) throw new Error("Failed to fetch orders list.");
    return res.json();
  },

  async updateOrderStatus(businessId: string, orderId: string, status: string): Promise<Order> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status.");
    return res.json();
  },

  async getChats(businessId: string): Promise<Conversation[]> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/chats`);
    if (!res.ok) throw new Error("Failed to fetch WhatsApp chats.");
    return res.json();
  },

  async sendChatMessage(businessId: string, conversationId: string, content: string): Promise<Message> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/chats/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send chat reply message.");
    return res.json();
  },

  async updateChatSettings(businessId: string, conversationId: string, settings: { is_ai_paused?: boolean; status?: string; }): Promise<Conversation> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/chats/${conversationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update conversation settings.");
    return res.json();
  }
};
