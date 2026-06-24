"use client";

import React, { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import type { CatalogItem } from "@/lib/api";

interface CatalogTabProps {
  catalog: CatalogItem[];
  catalogName: string;
  setCatalogName: (val: string) => void;
  catalogPrice: string;
  setCatalogPrice: (val: string) => void;
  catalogCategory: string;
  setCatalogCategory: (val: string) => void;
  catalogDesc: string;
  setCatalogDesc: (val: string) => void;
  savingCatalog: boolean;
  handleAddCatalogItem: (e: React.FormEvent) => void;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function CatalogTab({
  catalog,
  catalogName,
  setCatalogName,
  catalogPrice,
  setCatalogPrice,
  catalogCategory,
  setCatalogCategory,
  catalogDesc,
  setCatalogDesc,
  savingCatalog,
  handleAddCatalogItem,
  page,
  total,
  limit,
  onPageChange,
}: CatalogTabProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<HTMLDivElement>(null);
  const [agentAccessActive, setAgentAccessActive] = useState(true);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
    if (dbRef.current) {
      gsap.fromTo(
        dbRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  // Dynamically group catalog items by category
  const groupedCatalog = catalog.reduce((acc, item) => {
    const categoryName = item.category || "General Resources";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  return (
    <div className="space-y-8">
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Items & Prices List</h1>
          <p className="font-body text-sm text-slate-500 mt-1 max-w-2xl">
            Add all products, catalog items, services, and prices here. Your automated AI chatbot assistant will automatically search this list to answer customer questions correctly.
          </p>
        </div>
        
        {/* Agent Access Toggle control */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-none px-4 py-3 shrink-0 shadow-xs" style={{ borderRadius: 14 }}>
          <div className="flex flex-col text-left">
            <span className="font-mono text-[9px] text-slate-700 uppercase tracking-widest font-bold">Allow Chatbot to Read Items</span>
            <span className="font-mono text-[8px] text-slate-400 uppercase font-bold mt-0.5" id="agent-status-text">
              {agentAccessActive ? "Online & Enabled" : "Disabled"}
            </span>
          </div>
          <button
            onClick={() => setAgentAccessActive(!agentAccessActive)}
            className={`w-12 h-6 border transition-all duration-300 font-mono text-[9px] uppercase tracking-wider font-bold ml-4 rounded-none flex items-center justify-center cursor-pointer ${
              agentAccessActive 
                ? "bg-[#128C7E] text-white border-[#128C7E] shadow-xs" 
                : "bg-transparent text-slate-400 border-slate-200"
            }`}
            style={{ borderRadius: 6 }}
          >
            {agentAccessActive ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Seeding Form */}
        <div ref={formRef} className="lg:col-span-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white border border-slate-200 p-6 space-y-4 shadow-xs" style={{ borderRadius: 16 }}>
            <h3 className="font-mono text-[9px] tracking-wider uppercase text-[#128C7E] flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#128C7E]">add_shopping_cart</span>
              Add Product to Price List
            </h3>

            <form onSubmit={handleAddCatalogItem} className="space-y-4 pt-2 font-mono text-base">
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="ENTER ITEM NAME"
                  value={catalogName}
                  onChange={(e) => setCatalogName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                  style={{ borderRadius: 10 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="PRICE"
                    value={catalogPrice}
                    onChange={(e) => setCatalogPrice(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                    style={{ borderRadius: 10 }}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="CATEGORY"
                    value={catalogCategory}
                    onChange={(e) => setCatalogCategory(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                    style={{ borderRadius: 10 }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  Short Description
                </label>
                <textarea
                  placeholder="ENTER SHORT DESCRIPTION"
                  rows={4}
                  value={catalogDesc}
                  onChange={(e) => setCatalogDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] text-slate-800 placeholder:text-slate-400 resize-none transition-all duration-200 leading-relaxed font-body"
                  style={{ borderRadius: 10 }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={savingCatalog}
                className="w-full bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-mono tracking-[0.2em] uppercase text-base cursor-pointer shadow-xs"
                style={{ borderRadius: 10 }}
              >
                {savingCatalog ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                    SAVE TO PRICE LIST
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Seeded Catalog List */}
        <div ref={dbRef} className="lg:col-span-8 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white border border-slate-200 overflow-hidden shadow-xs" style={{ borderRadius: 16 }}>
            {catalog.length === 0 ? (
              <div className="text-center py-24 px-6 text-slate-500 font-body flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[32px] text-slate-400">storefront</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">No products added yet</h3>
                <p className="text-sm text-slate-500 max-w-md mb-8">
                  Upload your first product or price list to start answering customer questions. Your AI learns instantly.
                </p>
                <button 
                  onClick={() => document.querySelector('input[placeholder="ENTER ITEM NAME"]')?.closest('form')?.querySelector('input')?.focus()}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {Object.entries(groupedCatalog).map(([categoryName, items]) => (
                  <div key={categoryName} className="border-b border-slate-200 last:border-b-0">
                    {/* Category Title bar */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="font-mono text-base text-slate-800 uppercase tracking-wider font-bold">
                        {categoryName}
                      </h2>
                      <span className="font-mono text-[9px] text-slate-500 bg-white px-2 py-0.5 border border-slate-200 font-bold" style={{ borderRadius: 6 }}>
                        {items.length} Items
                      </span>
                    </div>

                    {/* Category list items */}
                    <ul className="flex flex-col font-mono">
                      {items.map((item, idx) => (
                        <li
                          key={idx}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="flex items-start sm:items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-200" style={{ borderRadius: 8 }}>
                              <span className="material-symbols-outlined text-[20px] text-[#128C7E]">
                                {categoryName.toLowerCase().includes("jewel") ? "diamond" : 
                                 categoryName.toLowerCase().includes("grocer") ? "local_grocery_store" : 
                                 categoryName.toLowerCase().includes("service") || categoryName.toLowerCase().includes("rent") ? "local_mall" : "storefront"}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-mono text-base text-slate-800 font-bold leading-none">{item.name}</h3>
                                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 border border-emerald-250/60" style={{ borderRadius: 6 }}>
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                  <span className="font-mono text-[9px] text-emerald-700 font-bold uppercase">Available</span>
                                </div>
                              </div>
                              <p className="font-body text-base text-slate-500 mt-1.5">
                                {item.description || "No description configured."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-8 mt-4 sm:mt-0">
                            <div className="flex flex-col sm:text-right font-mono">
                              <span className="text-sm font-bold text-slate-850">₹ {item.price?.toFixed(2)}</span>
                              <span className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5 font-bold">price</span>
                            </div>
                            <div className="w-8 flex justify-end" title={agentAccessActive ? "AI Assistant Enabled" : "AI Assistant Disabled"}>
                              {agentAccessActive ? (
                                <span className="material-symbols-outlined text-[#128C7E] text-[20px]">smart_toy</span>
                              ) : (
                                <span className="material-symbols-outlined text-slate-300 text-[20px]">block</span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination Controls */}
            {total > limit && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page * limit >= total}
                    className="relative ml-3 inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-mono">
                      Showing <span className="font-semibold text-slate-800">{(page - 1) * limit + 1}</span> to{" "}
                      <span className="font-semibold text-slate-800">{Math.min(page * limit, total)}</span> of{" "}
                      <span className="font-semibold text-slate-800">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                      <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 font-mono">
                        Page {page} of {Math.ceil(total / limit)}
                      </span>
                      <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page * limit >= total}
                        className="relative inline-flex items-center rounded-r-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
