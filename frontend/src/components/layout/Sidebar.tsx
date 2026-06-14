"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Database, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  LogOut,
  CheckCircle,
  Zap,
  Menu,
  X,
  LineChart
} from "lucide-react";
import type { Business } from "@/lib/api";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats" | "analytics";

interface SidebarProps {
  activeBusiness: Business;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Mission Control", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: CheckCircle },
  { id: "chats", label: "Live Chats", icon: MessageSquare },
  { id: "catalog", label: "Product Catalog", icon: ShoppingBag },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "ingest", label: "AI Memory Center", icon: Database },
  { id: "playground", label: "Test Client", icon: Zap },
  { id: "integrations", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeBusiness,
  tab,
  onTabChange,
  onLogout,
}: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F8FAFC] border-r border-slate-200">
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-10">
        {/* Workspace Identity */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-display font-bold text-sm shadow-sm">
              {activeBusiness.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-display font-bold text-slate-900 truncate text-sm">
                AnytimeLLM
              </span>
              <span className="font-medium text-[10px] text-slate-500 uppercase tracking-wider">
                Operating System
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 pb-4 space-y-0.5 flex-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-4">Main Menu</div>
          {navItems.slice(0, 5).map((item) => {
            const isActive = tab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group
                  ${isActive ? "text-slate-900 bg-white shadow-sm border border-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-6">Intelligence</div>
          {navItems.slice(5).map((item) => {
            const isActive = tab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group
                  ${isActive ? "text-slate-900 bg-white shadow-sm border border-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] z-20 relative shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:text-red-600 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 fixed top-0 w-full z-40">
        <div className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs">A</div>
          AnytimeLLM
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex justify-end p-2 border-b border-slate-100">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
