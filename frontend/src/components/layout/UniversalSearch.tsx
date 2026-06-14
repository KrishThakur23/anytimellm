"use client";

import React, { useState, useEffect } from "react";
import { Search, Command, X } from "lucide-react";

export default function UniversalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors duration-200 border border-slate-200 hover:border-slate-300 w-64 shadow-xs"
        style={{ borderRadius: 8 }}
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
        <span className="text-sm font-medium flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="relative w-full max-w-2xl bg-white shadow-premium rounded-xl overflow-hidden border border-slate-200 flex flex-col"
            style={{ maxHeight: "60vh" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search conversations, customers, orders..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-base text-slate-900 placeholder:text-slate-400"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {query.length > 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 font-medium">
                  No results found for "{query}".
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-slate-400">
                  Type to search your Business Operating System...
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 p-2 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
              <div className="flex gap-4">
                <span><kbd className="bg-white border border-slate-200 rounded px-1 font-sans">↑</kbd> <kbd className="bg-white border border-slate-200 rounded px-1 font-sans">↓</kbd> to navigate</span>
                <span><kbd className="bg-white border border-slate-200 rounded px-1 font-sans">Enter</kbd> to select</span>
              </div>
              <span><kbd className="bg-white border border-slate-200 rounded px-1 font-sans">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
