"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import type { Business } from "@/lib/api";
import { 
  Utensils, 
  ShoppingBag, 
  Shirt, 
  Scissors, 
  Send, 
  Check, 
  Loader2, 
  Sparkles, 
  Clock, 
  Truck, 
  Layers, 
  UserCheck 
} from "lucide-react";

interface OnboardingWizardProps {
  activeBusiness: Business;
  onComplete: (updatedBiz: Business) => void;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function OnboardingWizard({ activeBusiness, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<"select" | "chat">("select");
  const [selectedType, setSelectedType] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [collected, setCollected] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll on new messages without scrolling the parent window
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  // If business onboarding is already chatting, resume the chat session
  useEffect(() => {
    if (activeBusiness.onboarding_status === "chatting" && activeBusiness.business_type) {
      setSelectedType(activeBusiness.business_type);
      setStep("chat");
      const history = activeBusiness.api_settings?.onboarding_chat_history || [];
      const coll = activeBusiness.api_settings?.onboarding_collected || {};
      setChatHistory(history);
      setCollected(coll);
    }
  }, [activeBusiness]);

  const handleStartOnboarding = async (type: string) => {
    setStarting(true);
    try {
      const data = await api.startOnboarding(type);
      setSelectedType(type);
      setChatHistory(data.chat_history);
      setCollected(data.collected || {});
      setStep("chat");
    } catch (err) {
      console.error("Failed to start onboarding:", err);
    } finally {
      setStarting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue.trim();
    setInputValue("");
    setLoading(true);

    // Optimistically add to state
    setChatHistory(prev => [...prev, { sender: "user", text: userText }]);

    try {
      const data = await api.sendOnboardingChatMessage(userText);
      setChatHistory(data.chat_history);
      setCollected(data.collected || {});
      
      // If completed, trigger onComplete with updated business settings after a brief delay
      if (data.status === "completed") {
        setTimeout(async () => {
          try {
            const freshBiz = await api.getMyBusiness();
            onComplete(freshBiz);
          } catch (err) {
            console.error("Failed to fetch fresh business details:", err);
          }
        }, 3000);
      }
    } catch (err) {
      console.error("Error sending onboarding message:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render Business Vertical Selector cards
  if (step === "select") {
    const cardData = [
      {
        id: "dining",
        title: "Dining & Food",
        desc: "Restaurants, Cafes, and bistros seeking to automate menus, table reservations, and delivery checkouts.",
        icon: Utensils,
        color: "from-amber-500/20 to-orange-500/10 border-orange-500/20 hover:border-orange-500/60 text-orange-400"
      },
      {
        id: "grocery",
        title: "Grocery & Marts",
        desc: "Supermarkets and local produce marts needing automated inventory ordering, stock checking, and slot delivery bookings.",
        icon: ShoppingBag,
        color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/60 text-emerald-400"
      },
      {
        id: "clothing",
        title: "Clothing & Retail",
        desc: "Fashion brands, shoe shops, and boutiques selling apparel with variant checkouts (color, size, price).",
        icon: Shirt,
        color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/20 hover:border-cyan-500/60 text-cyan-400"
      },
      {
        id: "salon",
        title: "Salon & Services",
        desc: "Beauty clinics, barber shops, and wellness spas automating booking appointments with specific staff and durations.",
        icon: Scissors,
        color: "from-purple-500/20 to-pink-500/10 border-purple-500/20 hover:border-purple-500/60 text-purple-400"
      }
    ];

    return (
      <div className="min-h-screen bg-[#02000f] text-white flex flex-col justify-center px-6 py-12 md:py-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/[0.02] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full z-10 text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-1.5 border border-purple-500/20 bg-purple-950/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-purple-300 uppercase font-bold">
              WORKSPACE INITIALIZATION
            </span>
          </div>
          <h1 className="font-display-lg text-3xl md:text-5xl uppercase tracking-wide text-white leading-tight">
            Select Your Business Type
          </h1>
          <p className="font-body-md text-sm text-text-secondary max-w-xl mx-auto mt-2 leading-relaxed italic">
            Welcome, {activeBusiness.name}. To train your AI assistant and structure your catalog database, choose the vertical that fits your operations:
          </p>
        </div>

        {starting ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">Bootstrapping Onboarding Assistant...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full z-10">
            {cardData.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => handleStartOnboarding(card.id)}
                  className={`flex flex-col items-start text-left p-6 border bg-[#070518]/30 backdrop-blur-md transition-all duration-350 transform hover:-translate-y-1 group relative overflow-hidden cursor-pointer`}
                  style={{ borderRadius: "var(--radius-xl)" }}
                >
                  <div className={`p-3 bg-white/5 border border-white/10 rounded-xl mb-4 group-hover:scale-110 transition-all duration-300 ${card.color.split(" ").pop()}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display-lg text-sm md:text-base uppercase tracking-wider text-white font-bold mb-2">
                    {card.title}
                  </h3>
                  <p className="font-body-sm text-xs text-text-secondary leading-relaxed">
                    {card.desc}
                  </p>
                  
                  {/* Subtle hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color.split(" ").slice(0, 2).join(" ")} opacity-0 group-hover:opacity-100 transition-opacity duration-350 -z-10`} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render collected checklist indicators
  const renderChecklist = () => {
    const items = [];
    if (selectedType === "dining") {
      items.push({ label: "Hours", key: "hours", icon: Clock });
      items.push({ label: "Delivery Option", key: "delivery_supported", icon: Truck });
      items.push({ 
        label: `Menu Items (${(collected.signature_items || []).length})`, 
        key: "signature_items", 
        icon: Utensils,
        check: (collected.signature_items || []).length > 0 
      });
    } else if (selectedType === "grocery") {
      items.push({ label: "Delivery Slots", key: "delivery_slots", icon: Clock });
      items.push({ label: "Categories", key: "categories", icon: Layers });
      items.push({ 
        label: `Inventory (${(collected.signature_items || []).length})`, 
        key: "signature_items", 
        icon: ShoppingBag,
        check: (collected.signature_items || []).length > 0 
      });
    } else if (selectedType === "clothing") {
      items.push({ label: "Categories", key: "categories", icon: Layers });
      items.push({ label: "Supported Sizes", key: "sizes", icon: Shirt });
      items.push({ 
        label: `Catalog (${(collected.signature_items || []).length})`, 
        key: "signature_items", 
        icon: ShoppingBag,
        check: (collected.signature_items || []).length > 0 
      });
    } else if (selectedType === "salon") {
      items.push({ 
        label: `Services Offered (${(collected.services || []).length})`, 
        key: "services", 
        icon: Scissors,
        check: (collected.services || []).length > 0 
      });
      items.push({ label: "Staff Members", key: "staff", icon: UserCheck });
    }

    return (
      <div className="space-y-4">
        <span className="font-mono text-[9px] text-muted tracking-widest uppercase">CONFIGURATION PROGRESS</span>
        <div className="space-y-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isCollected = item.check !== undefined ? item.check : (collected[item.key] !== undefined && collected[item.key] !== null);
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-300 bg-surface-2/40 ${isCollected ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/[0.02]" : "border-border-subtle text-text-secondary"}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-body-sm text-[11px] font-medium">{item.label}</span>
                </div>
                {isCollected ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-border-subtle shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isCompleted = activeBusiness.onboarding_status === "completed" || chatHistory.some(m => m.text.includes("completed! Your AI agent is now configured"));

  return (
    <div className="min-h-screen bg-[#02000f] text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[10%] left-[20%] w-[700px] h-[700px] bg-purple-600/[0.01] rounded-full blur-[150px] pointer-events-none" />

      {/* Checklist Sidebar */}
      <aside className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-border-subtle bg-[#050314]/70 p-6 flex flex-col gap-6 md:h-screen overflow-y-auto z-10">
        <div>
          <span className="font-mono text-[8px] text-purple-400 tracking-[0.25em] uppercase font-bold block mb-1">ANYTIMELLM WIZARD</span>
          <h2 className="font-display-lg text-lg uppercase text-white font-bold truncate">{activeBusiness.name}</h2>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 bg-purple-500/10 border border-purple-500/25 rounded-md text-[10px] text-purple-300 font-mono capitalize">
            Vertical: {selectedType}
          </div>
        </div>

        <hr className="border-border-subtle/50" />
        {renderChecklist()}
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen relative z-10">
        {/* Chat header */}
        <header className="border-b border-border-subtle bg-[#050314]/30 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-mono text-[10px] text-white uppercase tracking-widest font-semibold">AI SETUP ASSISTANT</span>
          </div>
          <span className="font-mono text-[8px] text-muted tracking-widest">SECURE SESSION ENCRYPTED</span>
        </header>

        {/* Messages list */}
        <div ref={messagesContainerRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-xl p-4 rounded-xl border leading-relaxed font-body-sm text-xs md:text-sm ${
                  msg.sender === "user" 
                    ? "bg-purple-600/10 border-purple-500/30 text-white rounded-tr-none" 
                    : "bg-surface-2/40 border-border-subtle text-text-secondary rounded-tl-none"
                }`}
                style={{
                  borderRadius: "var(--radius-lg)",
                  borderTopRightRadius: msg.sender === "user" ? "0" : undefined,
                  borderTopLeftRadius: msg.sender === "bot" ? "0" : undefined
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div 
                className="bg-surface-2/40 border border-border-subtle text-text-secondary p-4 rounded-xl rounded-tl-none flex items-center gap-2"
                style={{ borderRadius: "var(--radius-lg)", borderTopLeftRadius: "0" }}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Assistant is writing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-6 border-t border-border-subtle bg-[#050314]/50 shrink-0">
          {isCompleted ? (
            <div className="flex items-center justify-center py-2 text-center flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <Check className="w-5 h-5" />
              </div>
              <span className="font-display-lg text-sm text-white font-bold uppercase tracking-wider">Setup Complete! Redirecting...</span>
              <button 
                onClick={async () => {
                  try {
                    const freshBiz = await api.getMyBusiness();
                    onComplete(freshBiz);
                  } catch (err) {
                    console.error("Failed to load business:", err);
                  }
                }}
                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500/30 hover:border-white text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all duration-350 cursor-pointer"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                ENTER DASHBOARD
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your setup details here..."
                disabled={loading}
                className="flex-1 bg-surface-2 border border-border-subtle px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                style={{ borderRadius: "var(--radius-lg)" }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="px-5 bg-purple-600 hover:bg-purple-500 border border-purple-500/30 disabled:bg-purple-950/20 disabled:border-purple-900/10 text-white shrink-0 flex items-center justify-center transition-all cursor-pointer"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
