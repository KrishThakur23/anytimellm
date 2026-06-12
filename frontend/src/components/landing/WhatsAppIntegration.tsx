"use client";

import React, { useState } from "react";

export default function WhatsAppIntegration() {
  const [waSimState, setWaSimState] = useState<"idle" | "message_sent" | "processing" | "delivered">("idle");
  const [waMessages, setWaMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    { sender: "bot", text: "Welcome to Trendify Boutique! 🛍️ Ask me about our catalog, return policies, or check order status.", time: "11:32 AM" }
  ]);
  const [orderStatus, setOrderStatus] = useState<"none" | "creating" | "created">("none");

  const startWhatsAppSimFlow = () => {
    if (waSimState !== "idle") return;
    
    // 1. Customer sends message
    setWaSimState("message_sent");
    setWaMessages(prev => [...prev, { sender: "user", text: "Do you have size L blue denim shirts in stock?", time: "11:35 AM" }]);
    
    // 2. Processing...
    setTimeout(() => {
      setWaSimState("processing");
      setOrderStatus("creating");
      
      // 3. Delivered & Dashboard updated
      setTimeout(() => {
        setWaSimState("delivered");
        setWaMessages(prev => [...prev, { sender: "bot", text: "Yes, we do! 👕 Our Classic Denim Shirt in Blue (Size L) is in stock at ₹1,899. I have just created order #ORD-2914 for you. Check your SMS for the payment link!", time: "11:36 AM" }]);
        setOrderStatus("created");
      }, 1500);
      
    }, 1000);
  };

  const resetWhatsAppSimFlow = () => {
    setWaSimState("idle");
    setWaMessages([
      { sender: "bot", text: "Welcome to Trendify Boutique! 🛍️ Ask me about our catalog, return policies, or check order status.", time: "11:32 AM" }
    ]);
    setOrderStatus("none");
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: UI Mockups (WhatsApp + Dashboard) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative">
            
            {/* 1. WhatsApp Client Phone Mock */}
            <div className="bg-[#0b141a] border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative z-10" style={{ borderRadius: 24, height: 440 }}>
              {/* Phone Status bar */}
              <div className="bg-[#202c33] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-white/45 text-sm font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base">T</div>
                  <span className="font-bold uppercase tracking-wider text-[11px] text-white">Trendify Bot</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Verified</span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-[12px] bg-[#0b141a]" style={{ opacity: 0.9 }}>
                {waMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 max-w-[85%] shadow-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#202c33] text-white/90 border border-slate-700 ml-0"
                        : "bg-[#005c4b] text-white ml-auto"
                    }`}
                    style={{ borderRadius: msg.sender === "user" ? "0px 10px 10px 10px" : "10px 0px 10px 10px" }}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[8px] text-white/50 block mt-1 text-right">{msg.time}</span>
                  </div>
                ))}
                
                {waSimState === "processing" && (
                  <div className="bg-[#005c4b] text-white p-2.5 max-w-[50%] ml-auto shadow-sm" style={{ borderRadius: "10px 0px 10px 10px" }}>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Trigger Demo Button */}
              <div className="p-3 bg-[#202c33] border-t border-slate-800 flex items-center justify-center relative z-20">
                {waSimState === "idle" ? (
                  <button
                    onClick={startWhatsAppSimFlow}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 transition-opacity text-white font-bold text-[11px] tracking-wider uppercase shadow-md cursor-pointer"
                    style={{ borderRadius: 8 }}
                  >
                    Send Message
                  </button>
                ) : (
                  <button
                    onClick={resetWhatsAppSimFlow}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
                    style={{ borderRadius: 8 }}
                  >
                    Reset Demo
                  </button>
                )}
              </div>
            </div>

            {/* 2. Dashboard Order Mock */}
            <div className="bg-slate-50 border border-slate-200 shadow-xl flex flex-col justify-between" style={{ height: 440, borderRadius: 20 }}>
              <div className="p-4 border-b border-slate-200 bg-white" style={{ borderRadius: "20px 20px 0 0" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F0F2F5]0" />
                  <span className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">Live Dashboard</span>
                </div>
              </div>

              <div className="flex-1 p-5 flex items-center justify-center bg-slate-50">
                {orderStatus === "none" ? (
                  <div className="text-center opacity-50">
                    <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-xl mx-auto flex items-center justify-center text-slate-400 mb-3">📦</div>
                    <p className="text-[11px] font-mono uppercase text-slate-400">Waiting for orders...</p>
                  </div>
                ) : orderStatus === "creating" ? (
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[11px] font-mono text-[#128C7E] font-semibold animate-pulse">Syncing Order Data...</p>
                  </div>
                ) : (
                  <div className="w-full bg-white border border-slate-200 shadow-sm p-5 animate-fade-in" style={{ borderRadius: 16 }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">New Order</span>
                        <h4 className="font-bold text-slate-900 mt-2 text-sm">#ORD-2914</h4>
                      </div>
                      <span className="text-sm text-slate-400 font-mono">11:36 AM</span>
                    </div>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                        <div className="text-base text-slate-700">1x Classic Denim Shirt</div>
                        <div className="text-base font-semibold text-slate-900">₹1,899</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">Customer</div>
                        <div className="text-sm font-medium text-slate-700">+91 98765 43210</div>
                      </div>
                    </div>

                    <div className="w-full bg-[#F0F2F5] text-[#075E54] text-center py-2 text-sm font-bold tracking-wider uppercase border border-violet-100" style={{ borderRadius: 8 }}>
                      Payment Link Sent via SMS
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Webhook explanation text */}
        <div className="lg:col-span-5 text-left">
          <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
            Seamless Integration
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Works where your customers already are.
          </h2>
          <p className="mt-4 text-base text-slate-500 leading-relaxed">
            No apps to download. No clunky portals. Your AI answers questions and creates orders directly inside WhatsApp. The moment a customer confirms, the order instantly appears in your AnytimeLLM Dashboard.
          </p>
        </div>

      </div>
    </section>
  );
}
