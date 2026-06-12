"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, BACKEND_URL } from "@/lib/api";
import type { Business, CatalogItem, DocumentInfo, ChatMessage, Order, Conversation, Message } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Modular UI Components
import DashboardShell from "@/components/layout/DashboardShell";
import TabTransition from "@/components/ui/TabTransition";
import OverviewTab from "@/components/overview/OverviewTab";
import IngestTab from "@/components/ingest/IngestTab";
import CatalogTab from "@/components/catalog/CatalogTab";
import PlaygroundTab from "@/components/playground/PlaygroundTab";
import IntegrationsTab from "@/components/integrations/IntegrationsTab";
import OrdersTab from "@/components/orders/OrdersTab";
import ChatsTab from "@/components/chats/ChatsTab";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats";

export default function Dashboard() {
  const router = useRouter();
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Theme Mode Settings
  const [theme, setTheme] = useState<"dark" | "light">("light");

  // Dashboard Stats & State
  const [tab, setTab] = useState<Tab>("overview");
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  const [chats, setChats] = useState<Conversation[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  
  // Form States
  const [urlInput, setUrlInput] = useState("");
  const [ingestingUrl, setIngestingUrl] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const [catalogName, setCatalogName] = useState("");
  const [catalogPrice, setCatalogPrice] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("");
  const [catalogDesc, setCatalogDesc] = useState("");
  const [savingCatalog, setSavingCatalog] = useState(false);

  // Chat/Playground States
  const [chatPhone, setChatPhone] = useState("15550199");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sendingChat, setSendingChat] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize client-side theme loading on mount and auto-load active business session
  useEffect(() => {
    localStorage.setItem("anytimellm-theme", "light");
    setTheme("light");
    document.documentElement.classList.remove("dark");

    const savedToken = localStorage.getItem("anytimellm-token");
    if (savedToken) {
      api.getMyBusiness()
        .then(biz => {
          setActiveBusiness(biz);
        })
        .catch(err => {
          console.error("Failed to load saved business session:", err);
          localStorage.removeItem("anytimellm-active-business-id");
          localStorage.removeItem("anytimellm-token");
          window.location.href = "/login";
        })
        .finally(() => {
          setLoadingBusiness(false);
        });
    } else {
      window.location.href = "/login";
    }
  }, [router]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("anytimellm-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  useEffect(() => {
    if (activeBusiness) {
      fetchBusinessData();
      // Initialize playground greeting
      setChatMessages([
        {
          sender: "agent",
          content: `Hello! I am ${activeBusiness.name}'s virtual assistant. How can I help you check the catalog, make an order, or read our docs today?`,
          created_at: new Date().toISOString()
        }
      ]);
      setAgentLogs([
        "System initialized.",
        `Business tenant loaded: ${activeBusiness.name}`,
        `Ready for memory or query lookups on namespace '${activeBusiness.id}'.`
      ]);
    }
  }, [activeBusiness]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Background polling for orders & Real-time Server-Sent Events (SSE) for chats
  useEffect(() => {
    if (!activeBusiness) return;
    
    let timer: any = null;
    let eventSource: EventSource | null = null;
    
    if (tab === "chats") {
      // Connect to Server-Sent Events for real-time reactive updates
      const token = localStorage.getItem("anytimellm-token") || "";
      const sseUrl = `${BACKEND_URL}/api/businesses/${activeBusiness.id}/chats/stream?token=${encodeURIComponent(token)}`;
      
      console.log("Establishing real-time SSE chat stream...");
      eventSource = new EventSource(sseUrl);
      
      eventSource.onmessage = (event) => {
        if (event.data === "refresh") {
          console.log("Real-time message received via SSE. Refreshing chats...");
          api.getChats(activeBusiness.id)
            .then(data => setChats(data))
            .catch(err => console.error("Real-time chats update failed:", err));
        }
      };
      
      eventSource.onerror = (err) => {
        console.error("SSE connection error, falling back to 5s polling:", err);
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // Fallback polling in case of connection drop
        timer = setInterval(() => {
          api.getChats(activeBusiness.id)
            .then(data => setChats(data))
            .catch(err => console.error("Fallback chats update failed:", err));
        }, 5000);
      };
    } else if (tab === "orders") {
      timer = setInterval(() => {
        api.getOrders(activeBusiness.id)
          .then(data => setOrders(data))
          .catch(err => console.error("Silent background orders refresh failed:", err));
      }, 5000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      if (eventSource) eventSource.close();
    };
  }, [tab, activeBusiness]);

  const fetchBusinessData = async () => {
    if (!activeBusiness) return;
    try {
      const [docsData, catalogData, ordersData, chatsData] = await Promise.all([
        api.getDocuments(activeBusiness.id),
        api.getCatalog(activeBusiness.id),
        api.getOrders(activeBusiness.id),
        api.getChats(activeBusiness.id)
      ]);
      setDocuments(docsData);
      setCatalog(catalogData);
      setOrders(ordersData);
      setChats(chatsData);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch business data. Check if backend server is running.");
    }
  };

  const handleRefreshOrders = async () => {
    if (!activeBusiness) return;
    setLoadingOrders(true);
    try {
      const ordersData = await api.getOrders(activeBusiness.id);
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to refresh orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    if (!activeBusiness) return;
    setUpdatingOrderId(orderId);
    try {
      await api.updateOrderStatus(activeBusiness.id, orderId, status);
      const ordersData = await api.getOrders(activeBusiness.id);
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRefreshChats = async () => {
    if (!activeBusiness) return;
    setLoadingChats(true);
    try {
      const chatsData = await api.getChats(activeBusiness.id);
      setChats(chatsData);
    } catch (err) {
      setError("Failed to refresh WhatsApp chats.");
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSendManualReply = async (conversationId: string, content: string) => {
    if (!activeBusiness) return;
    try {
      const newMsg = await api.sendChatMessage(activeBusiness.id, conversationId, content);
      setChats(prevChats => prevChats.map(c => {
        if (c.id === conversationId) {
          const exists = newMsg.id ? c.messages.some(m => m.id === newMsg.id) : false;
          return {
            ...c,
            last_message_content: content,
            messages: exists ? c.messages : [...c.messages, newMsg]
          };
        }
        return c;
      }));
    } catch (err) {
      setError("Failed to send manual WhatsApp reply.");
      throw err;
    }
  };

  const handleToggleChatPause = async (conversationId: string, isPaused: boolean) => {
    if (!activeBusiness) return;
    try {
      const updated = await api.updateChatSettings(activeBusiness.id, conversationId, { is_ai_paused: isPaused });
      setChats(prevChats => prevChats.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            is_ai_paused: updated.is_ai_paused
          };
        }
        return c;
      }));
    } catch (err) {
      setError("Failed to toggle AI Agent pause state.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeBusiness) return;
    
    setUploadingFile(true);
    setError(null);
    
    // Add placeholder document to list immediately
    const tempDoc: DocumentInfo = {
      id: "temp-id",
      file_name: file.name,
      file_type: file.name.split(".").pop() || "txt",
      status: "processing",
      created_at: new Date().toISOString()
    };
    setDocuments(prev => [tempDoc, ...prev]);

    try {
      const doc = await api.uploadFile(activeBusiness.id, file);
      setDocuments(prev => prev.map(d => d.id === "temp-id" ? doc : d));
    } catch (err: any) {
      setError(err.message || "Failed to upload file.");
      setDocuments(prev => prev.map(d => d.id === "temp-id" ? { ...d, status: "failed" } : d));
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCrawlUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !activeBusiness) return;
    
    setIngestingUrl(true);
    setError(null);
    
    const tempDoc: DocumentInfo = {
      id: "temp-url-id",
      file_name: urlInput,
      file_type: "html",
      status: "processing",
      created_at: new Date().toISOString()
    };
    setDocuments(prev => [tempDoc, ...prev]);
    const targetUrl = urlInput;
    setUrlInput("");

    try {
      const doc = await api.crawlUrl(activeBusiness.id, targetUrl);
      setDocuments(prev => prev.map(d => d.id === "temp-url-id" ? doc : d));
    } catch (err: any) {
      setError(err.message || "Failed crawling URL.");
      setDocuments(prev => prev.map(d => d.id === "temp-url-id" ? { ...d, status: "failed" } : d));
    } finally {
      setIngestingUrl(false);
    }
  };

  const handleAddCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogName.trim() || !activeBusiness) return;
    
    setSavingCatalog(true);
    setError(null);
    try {
      const item = await api.addCatalogItem(activeBusiness.id, {
        name: catalogName,
        price: catalogPrice ? parseFloat(catalogPrice) : 0,
        category: catalogCategory || "General",
        description: catalogDesc
      });
      setCatalog(prev => [item, ...prev]);
      
      // Reset form
      setCatalogName("");
      setCatalogPrice("");
      setCatalogCategory("");
      setCatalogDesc("");
    } catch (err: any) {
      setError("Failed to add catalog item.");
    } finally {
      setSavingCatalog(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeBusiness || sendingChat) return;

    const userMessage: ChatMessage = {
      sender: "customer",
      content: chatInput,
      created_at: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const promptText = chatInput;
    setChatInput("");
    setSendingChat(true);

    // Update Logs
    setAgentLogs(prev => [
      ...prev,
      `Incoming Web Chat Message: "${promptText}"`,
      `Invoking reasoning engine for business_id: '${activeBusiness.id}'`,
      `State node [agent] started.`
    ]);

    // Simulate trace logs during wait for premium feel
    const logIntervals = [
      "LLM generating thoughts...",
      "Query matches potential catalog/ knowledge lookup intent.",
      "Routing conditional edge: Running tool execution loop..."
    ];
    
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logIntervals.length) {
        const logText = logIntervals[logIndex];
        setAgentLogs(prev => [...prev, logText]);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const reply = await api.chatWithAgent(activeBusiness.id, promptText, chatPhone);
      
      clearInterval(interval);
      
      // Determine what tools the agent called based on output mock traces or response keywords
      const lowerReply = reply.content.toLowerCase();
      let detectedToolNode = "State node [tools] executed.";
      if (lowerReply.includes("catalog_sql") || lowerReply.includes("database") || lowerReply.includes("pricing")) {
        detectedToolNode += " Invoked query_catalog_sql_tool.";
      } else if (lowerReply.includes("place_order") || lowerReply.includes("order placed")) {
        detectedToolNode += " Invoked place_order_tool.";
      } else if (lowerReply.includes("vector_store") || lowerReply.includes("processed the")) {
        detectedToolNode += " Invoked query_vector_store_tool.";
      }
      
      setAgentLogs(prev => [
        ...prev,
        detectedToolNode,
        `State node [agent] finalized response.`,
        `Outbox delivery completed.`
      ]);

      setChatMessages(prev => [...prev, reply]);
      // Refresh documents & catalog in case tool writes changed something
      fetchBusinessData();
    } catch (err: any) {
      clearInterval(interval);
      setAgentLogs(prev => [...prev, `[ERROR] Execution failed: ${err.message}`]);
      setError("Failed to chat with AI agent.");
    } finally {
      setSendingChat(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If loading business or not logged in, show the premium loading sequence
  if (loadingBusiness || !activeBusiness) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-foreground">
        <div className="flex flex-col items-center gap-4">
          <span className="font-display-lg text-lg tracking-[0.4em] font-medium uppercase animate-pulse">ANYTIMELLM</span>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">VERIFYING SECURE CONSOLE SESSION...</span>
        </div>
      </div>
    );
  }

  // If onboarding is incomplete, render the setup wizard
  if (activeBusiness && activeBusiness.onboarding_status !== "completed") {
    return (
      <OnboardingWizard
        activeBusiness={activeBusiness}
        onComplete={(updatedBiz) => {
          setActiveBusiness(updatedBiz);
          fetchBusinessData();
        }}
      />
    );
  }

  // Once tenant is active, render modular shell & feature tabs
  return (
    <DashboardShell
      activeBusiness={activeBusiness}
      tab={tab}
      onTabChange={setTab}
      onLogout={() => {
        setActiveBusiness(null);
        localStorage.removeItem("anytimellm-active-business-id");
        localStorage.removeItem("anytimellm-token");
        router.push("/");
      }}
      error={error}
      onDismissError={() => setError(null)}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <TabTransition tabKey={tab}>
        {tab === "overview" && (
          <OverviewTab
            activeBusiness={activeBusiness}
            documents={documents}
            catalog={catalog}
            orders={orders}
            copied={copied}
            copyToClipboard={copyToClipboard}
            onTabChange={setTab}
            onUpdateBusiness={setActiveBusiness}
          />
        )}
        {tab === "ingest" && (
          <IngestTab
            documents={documents}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            ingestingUrl={ingestingUrl}
            uploadingFile={uploadingFile}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handleCrawlUrl={handleCrawlUrl}
          />
        )}
        {tab === "catalog" && (
          <CatalogTab
            catalog={catalog}
            catalogName={catalogName}
            setCatalogName={setCatalogName}
            catalogPrice={catalogPrice}
            setCatalogPrice={setCatalogPrice}
            catalogCategory={catalogCategory}
            setCatalogCategory={setCatalogCategory}
            catalogDesc={catalogDesc}
            setCatalogDesc={setCatalogDesc}
            savingCatalog={savingCatalog}
            handleAddCatalogItem={handleAddCatalogItem}
          />
        )}
        {tab === "playground" && (
          <PlaygroundTab
            chatPhone={chatPhone}
            setChatPhone={setChatPhone}
            chatInput={chatInput}
            setChatInput={setChatInput}
            chatMessages={chatMessages}
            sendingChat={sendingChat}
            agentLogs={agentLogs}
            chatEndRef={chatEndRef}
            handleSendMessage={handleSendMessage}
          />
        )}
        {tab === "integrations" && (
          <IntegrationsTab
            activeBusiness={activeBusiness}
            copyToClipboard={copyToClipboard}
          />
        )}
        {tab === "orders" && (
          <OrdersTab
            orders={orders}
            loading={loadingOrders}
            onRefresh={handleRefreshOrders}
            onUpdateStatus={handleUpdateOrderStatus}
            updatingOrderId={updatingOrderId}
          />
        )}
        {tab === "chats" && (
          <ChatsTab
            chats={chats}
            loading={loadingChats}
            onRefresh={handleRefreshChats}
            onSendReply={handleSendManualReply}
            onTogglePause={handleToggleChatPause}
          />
        )}
      </TabTransition>
    </DashboardShell>
  );
}
