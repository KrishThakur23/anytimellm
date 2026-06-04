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
          <h1 className="font-display-lg text-4xl tracking-[0.08em] uppercase text-white">Items & Prices List</h1>
          <p className="font-body-md text-sm text-muted mt-1 italic max-w-2xl">
            Add all products, catalog items, services, and prices here. Your automated AI chatbot assistant will automatically search this list to answer customer questions correctly.
          </p>
        </div>
        
        {/* Agent Access Toggle control */}
        <div className="flex items-center gap-3 bg-surface-1 border border-border-subtle rounded-none px-4 py-3 shrink-0">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">Allow Chatbot to Read Items</span>
            <span className="font-mono text-[8px] text-muted uppercase font-bold mt-0.5" id="agent-status-text">
              {agentAccessActive ? "Online & Enabled" : "Disabled"}
            </span>
          </div>
          <button
            onClick={() => setAgentAccessActive(!agentAccessActive)}
            className={`w-12 h-6 border transition-all duration-300 font-mono text-[9px] uppercase tracking-wider font-bold ml-4 rounded-none flex items-center justify-center cursor-pointer ${
              agentAccessActive 
                ? "bg-white text-black border-white" 
                : "bg-transparent text-muted border-border-subtle"
            }`}
          >
            {agentAccessActive ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Seeding Form */}
        <div ref={formRef} className="lg:col-span-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-1 border border-border-subtle p-6 space-y-4 rounded-none">
            <h3 className="font-mono text-[10px] tracking-wider uppercase text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-muted-gold">add_shopping_cart</span>
              Add Product to Price List
            </h3>

            <form onSubmit={handleAddCatalogItem} className="space-y-4 pt-2 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="ENTER ITEM NAME"
                  value={catalogName}
                  onChange={(e) => setCatalogName(e.target.value)}
                  required
                  className="w-full bg-surface-2 border border-border-subtle rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-white text-white placeholder:text-muted transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="PRICE"
                    value={catalogPrice}
                    onChange={(e) => setCatalogPrice(e.target.value)}
                    required
                    className="w-full bg-surface-2 border border-border-subtle rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-white text-white placeholder:text-muted transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="CATEGORY"
                    value={catalogCategory}
                    onChange={(e) => setCatalogCategory(e.target.value)}
                    required
                    className="w-full bg-surface-2 border border-border-subtle rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-white text-white placeholder:text-muted transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Short Description
                </label>
                <textarea
                  placeholder="ENTER SHORT DESCRIPTION"
                  rows={4}
                  value={catalogDesc}
                  onChange={(e) => setCatalogDesc(e.target.value)}
                  className="w-full bg-surface-2 border border-border-subtle rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-white text-white placeholder:text-muted resize-none transition-all duration-200 leading-relaxed font-body-md"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={savingCatalog}
                className="w-full border border-white hover:bg-white hover:text-black text-white bg-transparent py-3.5 rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-mono tracking-[0.2em] uppercase text-xs cursor-pointer"
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
          <div className="bg-surface-1 border border-border-subtle rounded-none overflow-hidden">
            {catalog.length === 0 ? (
              <div className="text-center py-20 text-muted font-mono text-xs tracking-wider uppercase">
                No products added yet. Add your products using the form on the left!
              </div>
            ) : (
              <div className="flex flex-col">
                {Object.entries(groupedCatalog).map(([categoryName, items]) => (
                  <div key={categoryName} className="border-b border-border-subtle last:border-b-0">
                    {/* Category Title bar */}
                    <div className="bg-surface-2 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                      <h2 className="font-mono text-xs text-white uppercase tracking-wider font-bold">
                        {categoryName}
                      </h2>
                      <span className="font-mono text-[9px] text-white uppercase bg-surface-0 px-2 py-0.5 rounded-none border border-border-subtle">
                        {items.length} Items
                      </span>
                    </div>

                    {/* Category list items */}
                    <ul className="flex flex-col font-mono">
                      {items.map((item, idx) => (
                        <li
                          key={idx}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-2/30 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="w-10 h-10 rounded-none bg-surface-2 flex items-center justify-center flex-shrink-0 border border-border-subtle">
                              <span className="material-symbols-outlined text-[20px] text-muted-gold">
                                {categoryName.toLowerCase().includes("jewel") ? "diamond" : 
                                 categoryName.toLowerCase().includes("grocer") ? "local_grocery_store" : 
                                 categoryName.toLowerCase().includes("service") || categoryName.toLowerCase().includes("rent") ? "local_mall" : "storefront"}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-mono text-xs text-white font-bold leading-none">{item.name}</h3>
                                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-none border border-emerald-500/20">
                                  <div className="w-1.5 h-1.5 bg-emerald-500"></div>
                                  <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">Available</span>
                                </div>
                              </div>
                              <p className="font-body-md text-xs text-muted mt-1.5 italic">
                                {item.description || "No description configured."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-8 mt-4 sm:mt-0">
                            <div className="flex flex-col sm:text-right font-mono">
                              <span className="text-sm font-bold text-white">₹ {item.price?.toFixed(2)}</span>
                              <span className="text-[8px] text-muted uppercase tracking-wider mt-0.5">price</span>
                            </div>
                            <div className="w-8 flex justify-end" title={agentAccessActive ? "AI Assistant Enabled" : "AI Assistant Disabled"}>
                              {agentAccessActive ? (
                                <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
                              ) : (
                                <span className="material-symbols-outlined text-muted text-[20px] opacity-30">block</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
