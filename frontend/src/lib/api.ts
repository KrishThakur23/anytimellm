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

// Utility function to inject JWT Authorization header
function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("anytimellm-token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  // Authentication methods
  async login(email: string, password: string): Promise<{ access_token: string, business_id: string }> {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Invalid email or password.");
    }
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("anytimellm-token", data.access_token);
      localStorage.setItem("anytimellm-active-business-id", data.business_id);
    }
    return data;
  },

  async register(businessName: string, email: string, password: string): Promise<{ access_token: string, business_id: string }> {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_name: businessName, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration failed.");
    }
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("anytimellm-token", data.access_token);
      localStorage.setItem("anytimellm-active-business-id", data.business_id);
    }
    return data;
  },

  async getMe(): Promise<any> {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },

  async getMyBusiness(): Promise<Business> {
    const res = await fetch(`${BACKEND_URL}/api/auth/business`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch business details.");
    return res.json();
  },

  // Legacy fallback method for initialization without token (registers empty business)
  async registerBusiness(name: string): Promise<Business> {
    const res = await fetch(`${BACKEND_URL}/api/businesses`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to register business tenant.");
    return res.json();
  },

  // Secured Operator API methods
  async getBusiness(id: string): Promise<Business> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${id}`, {
      headers: getHeaders(),
    });
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
      headers: getHeaders(),
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
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed crawling URL.");
    }
    return res.json();
  },

  async getDocuments(businessId: string): Promise<DocumentInfo[]> {
    const res = await fetch(`${BACKEND_URL}/api/ingest/${businessId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to list business documents.");
    return res.json();
  },

  async addCatalogItem(businessId: string, item: CatalogItem): Promise<CatalogItem> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/catalog`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to register catalog item.");
    return res.json();
  },

  async getCatalog(businessId: string): Promise<CatalogItem[]> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/catalog`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch catalog list.");
    return res.json();
  },

  // Public Agent endpoint (Anonymous Web widget) - doesn't need Bearer headers
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
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/orders`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch orders list.");
    return res.json();
  },

  async updateOrderStatus(businessId: string, orderId: string, status: string): Promise<Order> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/orders/${orderId}`, {
      method: "PATCH",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status.");
    return res.json();
  },

  async getChats(businessId: string): Promise<Conversation[]> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/chats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch WhatsApp chats.");
    return res.json();
  },

  async sendChatMessage(businessId: string, conversationId: string, content: string): Promise<Message> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/chats/${conversationId}/messages`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send chat reply message.");
    return res.json();
  },

  async updateChatSettings(businessId: string, conversationId: string, settings: { is_ai_paused?: boolean; status?: string; }): Promise<Conversation> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/chats/${conversationId}`, {
      method: "PATCH",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update conversation settings.");
    return res.json();
  },

  async updateBusinessSettings(businessId: string, settings: Record<string, any>): Promise<Business> {
    const res = await fetch(`${BACKEND_URL}/api/businesses/${businessId}/settings`, {
      method: "PATCH",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update business settings.");
    return res.json();
  }
};
