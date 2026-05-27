"use client";

import React, { useState, useEffect, useRef } from "react";
import { api, Business, CatalogItem, DocumentInfo, ChatMessage } from "@/lib/api";

// Modular UI Components
import OnboardingHero from "@/components/onboarding/OnboardingHero";
import DashboardShell from "@/components/layout/DashboardShell";
import TabTransition from "@/components/ui/TabTransition";
import OverviewTab from "@/components/overview/OverviewTab";
import IngestTab from "@/components/ingest/IngestTab";
import CatalogTab from "@/components/catalog/CatalogTab";
import PlaygroundTab from "@/components/playground/PlaygroundTab";
import IntegrationsTab from "@/components/integrations/IntegrationsTab";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations";

export default function Dashboard() {
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessIdInput, setBusinessIdInput] = useState("");
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Theme Mode Settings
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Dashboard Stats & State
  const [tab, setTab] = useState<Tab>("overview");
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  
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

  // Synchronize client-side theme loading on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("anytimellm-theme") as "dark" | "light" || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

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
        `Ready for RAG or SQL queries on namespace '${activeBusiness.id}'.`
      ]);
    }
  }, [activeBusiness]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchBusinessData = async () => {
    if (!activeBusiness) return;
    try {
      const [docsData, catalogData] = await Promise.all([
        api.getDocuments(activeBusiness.id),
        api.getCatalog(activeBusiness.id)
      ]);
      setDocuments(docsData);
      setCatalog(catalogData);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch business data. Check if backend server is running.");
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setLoadingBusiness(true);
    setError(null);
    try {
      const biz = await api.registerBusiness(businessName);
      setActiveBusiness(biz);
    } catch (err: any) {
      setError(err.message || "Failed to register business.");
    } finally {
      setLoadingBusiness(false);
    }
  };

  const handleLoadBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdInput.trim()) return;
    setLoadingBusiness(true);
    setError(null);
    try {
      const biz = await api.getBusiness(businessIdInput.trim());
      setActiveBusiness(biz);
    } catch (err: any) {
      setError("Business ID not found or database error.");
    } finally {
      setLoadingBusiness(false);
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
      `Invoking LangGraph Orchestrator for business_id: '${activeBusiness.id}'`,
      `State node [agent] started.`
    ]);

    // Simulate trace logs during wait for premium feel
    const logIntervals = [
      "LLM generating thoughts...",
      "Query matches potential catalog/ RAG lookup intent.",
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
      setAgentLogs(prev => [...prev, `[ERROR] LangGraph execution failed: ${err.message}`]);
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

  // If no business tenant is active, render the premium full-screen onboarding hero
  if (!activeBusiness) {
    return (
      <OnboardingHero
        businessName={businessName}
        setBusinessName={setBusinessName}
        businessIdInput={businessIdInput}
        setBusinessIdInput={setBusinessIdInput}
        loadingBusiness={loadingBusiness}
        error={error}
        handleCreateBusiness={handleCreateBusiness}
        handleLoadBusiness={handleLoadBusiness}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Once tenant is active, render modular shell & feature tabs
  return (
    <DashboardShell
      activeBusiness={activeBusiness}
      tab={tab}
      onTabChange={setTab}
      onLogout={() => setActiveBusiness(null)}
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
            copied={copied}
            copyToClipboard={copyToClipboard}
            onTabChange={setTab}
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
      </TabTransition>
    </DashboardShell>
  );
}
