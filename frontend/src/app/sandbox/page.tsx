"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ShoppingBag, IndianRupee, Bot, ArrowUpRight } from "lucide-react";

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState("all");

  const stats = [
    { label: "Today's Revenue", value: "₹18,400", change: "+12%", icon: <IndianRupee className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Orders Today", value: "17", change: "+4", icon: <ShoppingBag className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversations", value: "53", change: "+18%", icon: <MessageSquare className="w-5 h-5" />, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "AI Resolution", value: "98.2%", change: "+1.1%", icon: <Bot className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const recentChats = [
    { name: "Rahul S.", message: "I want to order the Truffle Risotto", status: "Resolved (AI)", time: "2m ago", order: "₹899" },
    { name: "Priya M.", message: "Do you have a table for 4 tonight?", status: "Resolved (AI)", time: "15m ago", order: "Booking" },
    { name: "Amit K.", message: "Where is my order? It's late.", status: "Needs Action", time: "22m ago", order: null },
    { name: "Sneha V.", message: "Are you open on Sundays?", status: "Resolved (AI)", time: "1h ago", order: null },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mission Control</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time overview of your AI workforce.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="bg-white p-5 border border-slate-200 shadow-sm"
            style={{ borderRadius: 16 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: 16 }}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Live Conversations</h2>
              <div className="flex gap-2">
                {['all', 'needs_action'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${activeTab === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {t === 'all' ? 'All Chats' : 'Needs Action'}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {recentChats.filter(c => activeTab === 'all' || c.status === 'Needs Action').map((chat, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-semibold text-sm text-slate-900 truncate">{chat.name}</span>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">{chat.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{chat.message}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      chat.status.includes('AI') ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {chat.status}
                    </span>
                    {chat.order && (
                      <span className="text-xs font-semibold text-emerald-600">{chat.order}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: System Status */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 shadow-xl relative overflow-hidden" style={{ borderRadius: 16 }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl" />
            
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bot className="text-violet-400" /> AI Agents Status
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Support Agent", status: "Active", load: "34%" },
                { name: "Sales Agent", status: "Active", load: "62%" },
                { name: "Order Routing", status: "Active", load: "12%" },
              ].map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-slate-300">{agent.name}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{agent.load}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-800">
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium rounded-lg">
                View System Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
