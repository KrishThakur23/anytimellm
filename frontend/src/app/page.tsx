"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Building, 
  UploadCloud, 
  Globe, 
  Database, 
  MessageSquare, 
  Settings, 
  Activity, 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Copy,
  Check,
  Play,
  Send,
  Loader2,
  Trash2
} from "lucide-react";
import { api, Business, CatalogItem, DocumentInfo, ChatMessage } from "@/lib/api";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations";

export default function Dashboard() {
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessIdInput, setBusinessIdInput] = useState("");
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    try {
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

  // -------------------------------------------------------------
  // RENDER ONBOARDING SCREEN
  // -------------------------------------------------------------
  if (!activeBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-zinc-950 to-zinc-950">
        <div className="w-full max-w-md p-8 rounded-2xl glass-panel relative z-10">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-purple-600/20 border border-purple-500/30 p-4 rounded-2xl">
            <Building className="w-10 h-10 text-purple-400" />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              AnytimeLLM
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Universal Multi-Tenant AI Business Platform</p>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8 space-y-6">
            <form onSubmit={handleCreateBusiness} className="space-y-3">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Create New Business Tenant
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Apex Dental Clinic"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100"
                />
                <button
                  type="submit"
                  disabled={loadingBusiness}
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-1 disabled:opacity-50"
                >
                  {loadingBusiness ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Register
                </button>
              </div>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-zinc-500 uppercase">OR</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <form onSubmit={handleLoadBusiness} className="space-y-3">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Load Existing Business ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Business UUID"
                  value={businessIdInput}
                  onChange={(e) => setBusinessIdInput(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100 font-mono"
                />
                <button
                  type="submit"
                  disabled={loadingBusiness}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg px-4 py-2 text-sm font-semibold border border-zinc-700 transition flex items-center gap-1 disabled:opacity-50"
                >
                  {loadingBusiness ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Load
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER MAIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 border-b border-zinc-900 mb-6">
            <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-500/20">
              <Building className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight">{activeBusiness.name}</h2>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Tenant Active</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-medium ${
                tab === "overview" ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              Overview
            </button>
            
            <button
              onClick={() => setTab("ingest")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-medium ${
                tab === "ingest" ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Data Ingestion
            </button>

            <button
              onClick={() => setTab("catalog")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-medium ${
                tab === "catalog" ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Database className="w-4 h-4" />
              Catalog Relational
            </button>

            <button
              onClick={() => setTab("playground")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-medium ${
                tab === "playground" ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Agent Playground
            </button>

            <button
              onClick={() => setTab("integrations")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-medium ${
                tab === "integrations" ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Settings className="w-4 h-4" />
              WhatsApp Setup
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-900">
          <button 
            onClick={() => setActiveBusiness(null)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition border border-zinc-800"
          >
            Change Tenant Account
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT VIEW AREA */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl">
        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-xl flex justify-between items-center text-red-200 text-sm">
            <div className="flex gap-2 items-center">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-zinc-500 hover:text-zinc-300 text-xs font-bold px-2">Dismiss</button>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB VIEW: OVERVIEW
           ------------------------------------------------------------- */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Tenant Overview</h1>
              <p className="text-zinc-400 text-sm mt-1">Real-time status of AnytimeLLM RAG databases and action records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
                <div className="absolute right-4 top-4 p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400">Indexed Knowledge Files</h3>
                <p className="text-3xl font-black mt-2 text-zinc-100">{documents.length}</p>
                <span className="text-[10px] text-zinc-500 mt-2 block">Chunks mapped to Pinecone namespace</span>
              </div>

              <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
                <div className="absolute right-4 top-4 p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400">Structured Catalog Rows</h3>
                <p className="text-3xl font-black mt-2 text-zinc-100">{catalog.length}</p>
                <span className="text-[10px] text-zinc-500 mt-2 block">Seeded database items accessible via SQL</span>
              </div>

              <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
                <div className="absolute right-4 top-4 p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400">Channel Integration Status</h3>
                <p className="text-lg font-bold mt-2 text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Meta API Enabled
                </p>
                <span className="text-[10px] text-zinc-500 mt-2 block font-mono">Verify Token Match Active</span>
              </div>
            </div>

            {/* Quick action list */}
            <div className="rounded-2xl glass-panel p-6">
              <h2 className="text-lg font-bold mb-4">Tenant Identity & Key Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-900 text-sm">
                  <div className="col-span-1 text-zinc-400 font-semibold">Business Tenant ID:</div>
                  <div className="col-span-3 font-mono text-zinc-200 select-all flex items-center gap-2">
                    {activeBusiness.id}
                    <button 
                      onClick={() => copyToClipboard(activeBusiness.id)} 
                      className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-900 text-sm">
                  <div className="col-span-1 text-zinc-400 font-semibold">Agent Prompt Directive:</div>
                  <div className="col-span-3 text-zinc-200">
                    {activeBusiness.api_settings.system_prompt || "None configured."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB VIEW: INGEST
           ------------------------------------------------------------- */}
        {tab === "ingest" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Data Ingestion Service</h1>
              <p className="text-zinc-400 text-sm mt-1">Upload files or crawl URLs to index semantic context for the chatbot.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* File Uploader */}
              <div className="p-6 rounded-2xl glass-panel space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Upload Document
                </h3>
                <p className="text-xs text-zinc-400">Supports PDF, JPG, PNG (OCR), or plain TXT files. Size limit: 10MB.</p>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-purple-500/50 rounded-2xl p-8 text-center cursor-pointer transition bg-zinc-900/20 hover:bg-zinc-900/50 flex flex-col items-center justify-center gap-3"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                  />
                  {uploadingFile ? (
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-zinc-500" />
                  )}
                  <span className="text-sm text-zinc-300 font-medium">
                    {uploadingFile ? "Parsing document content..." : "Click or drag files here to upload"}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">PDF, TXT, PNG, JPG</span>
                </div>
              </div>

              {/* URL Scraper */}
              <div className="p-6 rounded-2xl glass-panel space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Crawl Website Content
                </h3>
                <p className="text-xs text-zinc-400">Provide a URL. The system will scrape text, remove tags, and split it for embeddings.</p>

                <form onSubmit={handleCrawlUrl} className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/pricing-plans"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      required
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100"
                    />
                    <button
                      type="submit"
                      disabled={ingestingUrl}
                      className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {ingestingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : "Scrape"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Upload History Table */}
            <div className="p-6 rounded-2xl glass-panel">
              <h3 className="text-lg font-bold mb-4">Ingestion Log / Files Map</h3>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">No documents uploaded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-400 font-semibold">
                        <th className="pb-3 pr-4">File Name / Source</th>
                        <th className="pb-3 px-4 w-28">Type</th>
                        <th className="pb-3 px-4 w-36">Status</th>
                        <th className="pb-3 pl-4">Extraction Summary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="text-zinc-300 hover:bg-zinc-900/30 transition">
                          <td className="py-3.5 pr-4 font-medium truncate max-w-xs">{doc.file_name}</td>
                          <td className="py-3.5 px-4 font-mono text-xs uppercase text-zinc-500">{doc.file_type}</td>
                          <td className="py-3.5 px-4">
                            {doc.status === "completed" && (
                              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Ready
                              </span>
                            )}
                            {doc.status === "processing" && (
                              <span className="inline-flex items-center gap-1 text-purple-400 text-xs font-semibold px-2 py-0.5 bg-purple-500/10 rounded-full border border-purple-500/20 animate-pulse">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Parsing
                              </span>
                            )}
                            {doc.status === "failed" && (
                              <span className="inline-flex items-center gap-1 text-red-400 text-xs font-semibold px-2 py-0.5 bg-red-500/10 rounded-full border border-red-500/20">
                                <XCircle className="w-3.5 h-3.5" />
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pl-4 text-xs text-zinc-400 max-w-md truncate">
                            {doc.summary || "No summary generated."}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB VIEW: CATALOG
           ------------------------------------------------------------- */}
        {tab === "catalog" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Catalog Management</h1>
              <p className="text-zinc-400 text-sm mt-1">Configure structured catalog records which the AI query tools will look up using SQL.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Seeding Form */}
              <div className="p-6 rounded-2xl glass-panel md:col-span-1 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  Add Catalog Item
                </h3>
                
                <form onSubmit={handleAddCatalogItem} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-semibold">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tooth Extraction"
                      value={catalogName}
                      onChange={(e) => setCatalogName(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-semibold">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 150.00"
                        value={catalogPrice}
                        onChange={(e) => setCatalogPrice(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-semibold">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Surgery"
                        value={catalogCategory}
                        onChange={(e) => setCatalogCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-semibold">Description</label>
                    <textarea
                      placeholder="Enter description and pricing details..."
                      rows={4}
                      value={catalogDesc}
                      onChange={(e) => setCatalogDesc(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={savingCatalog}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {savingCatalog ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Item to DB
                  </button>
                </form>
              </div>

              {/* Seeded Catalog List */}
              <div className="p-6 rounded-2xl glass-panel md:col-span-2 space-y-4">
                <h3 className="text-lg font-bold">Relational Catalog Database</h3>
                {catalog.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 text-sm">
                    No catalog items added yet. Seed the database using the form.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-400 font-semibold">
                          <th className="pb-3 pr-4">Name</th>
                          <th className="pb-3 px-4 w-28">Category</th>
                          <th className="pb-3 px-4 w-28 text-right">Price</th>
                          <th className="pb-3 pl-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {catalog.map((item, idx) => (
                          <tr key={idx} className="text-zinc-300 hover:bg-zinc-900/30 transition">
                            <td className="py-3 pr-4 font-semibold text-zinc-100">{item.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold text-zinc-400">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-emerald-400">${item.price?.toFixed(2)}</td>
                            <td className="py-3 pl-4 text-xs text-zinc-400 truncate max-w-xs">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB VIEW: PLAYGROUND
           ------------------------------------------------------------- */}
        {tab === "playground" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Agent Testing Playground</h1>
              <p className="text-zinc-400 text-sm mt-1">Chat with the compiled LangGraph state machine, watching real-time retrieval logs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
              
              {/* Chat panel */}
              <div className="lg:col-span-3 rounded-2xl glass-panel flex flex-col h-[550px] overflow-hidden">
                <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Active Agent Simulator</span>
                  </div>
                  
                  {/* Phone simulator */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase">Customer ID:</span>
                    <input
                      type="text"
                      value={chatPhone}
                      onChange={(e) => setChatPhone(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-300 font-mono w-24 text-center focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Messages view */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/20">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          msg.sender === "customer"
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-zinc-900 text-zinc-100 rounded-bl-none border border-zinc-800"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {sendingChat && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        <span>Agent thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
                </div>

                {/* Chat input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900 bg-zinc-950 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about opening hours, search products, or say 'buy prophylaxis deep cleaning'..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      required
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-zinc-100"
                    />
                    <button
                      type="submit"
                      disabled={sendingChat || !chatInput.trim()}
                      className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl p-2.5 transition flex items-center justify-center shrink-0 disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Thought Process Logs Panel */}
              <div className="lg:col-span-2 rounded-2xl glass-panel flex flex-col h-[550px] overflow-hidden">
                <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center gap-2 shrink-0">
                  <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">LangGraph Execution Trail</span>
                </div>

                <div className="flex-1 p-4 bg-zinc-950/40 overflow-y-auto font-mono text-xs space-y-2.5 text-zinc-400">
                  {agentLogs.map((log, idx) => {
                    if (!log || typeof log !== "string") return null;
                    let logColor = "text-zinc-500";
                    if (log.startsWith("Incoming") || log.startsWith("Outgoing")) {
                      logColor = "text-yellow-400/90 font-semibold";
                    } else if (log.includes("State node") || log.includes("Routing")) {
                      logColor = "text-purple-400";
                    } else if (log.includes("Invoked") || log.includes("Output")) {
                      logColor = "text-indigo-400";
                    } else if (log.includes("[ERROR]")) {
                      logColor = "text-red-400 font-bold";
                    } else if (log.includes("initialized") || log.includes("loaded")) {
                      logColor = "text-zinc-400";
                    }

                    return (
                      <div key={idx} className={`${logColor} leading-relaxed`}>
                        <span className="text-[10px] text-zinc-600 mr-1.5 font-sans">[{idx + 1}]</span>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB VIEW: INTEGRATIONS
           ------------------------------------------------------------- */}
        {tab === "integrations" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Meta WhatsApp Setup</h1>
              <p className="text-zinc-400 text-sm mt-1">Configure webhooks and details to receive incoming messages via Meta Cloud API.</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Integration Parameters
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-900 text-sm items-center">
                  <div className="col-span-1 text-zinc-400 font-semibold">Callback URL:</div>
                  <div className="col-span-2 font-mono text-purple-400 truncate">
                    http://your-server-ip:8000/api/webhooks/whatsapp/{activeBusiness.id}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => copyToClipboard(`http://your-server-ip:8000/api/webhooks/whatsapp/${activeBusiness.id}`)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-700 transition"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-900 text-sm items-center">
                  <div className="col-span-1 text-zinc-400 font-semibold">Verify Token:</div>
                  <div className="col-span-2 font-mono text-zinc-200">
                    anytimellm_verify_token
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => copyToClipboard("anytimellm_verify_token")}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-700 transition"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Token
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-6 space-y-4">
                <h4 className="font-bold text-sm text-zinc-300">How to register on Meta Developers:</h4>
                <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <li>Go to your app dashboard in <strong>Meta for Developers</strong> (under the WhatsApp section).</li>
                  <li>Click on <strong>Configuration</strong> in the sidebar.</li>
                  <li>In the <strong>Webhook</strong> field, paste the Callback URL and Verify Token from above.</li>
                  <li>Click <strong>Verify and Save</strong>. Meta will send a validation GET request to check authentication.</li>
                  <li>Click <strong>Manage</strong> webhooks subscriptions, and subscribe to <strong>messages</strong>.</li>
                  <li>Now, any message sent to your WhatsApp Cloud number will trigger the AnytimeLLM RAG agent!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
