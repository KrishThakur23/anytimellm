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
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-text">Items & Prices List</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-semibold max-w-2xl">
            Add all products, catalog items, services, and prices here. Your automated AI chatbot assistant will automatically search this list to answer customer questions correctly.
          </p>
        </div>
        
        {/* Agent Access Toggle control (Stitch visual flair) */}
        <div className="flex items-center gap-3 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-lg px-4 py-3 shadow-sm shrink-0">
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-ink-text uppercase tracking-widest font-black">🟢 Allow Chatbot to Read Items</span>
            <span className="font-label-xs text-[9px] text-on-surface-variant font-mono uppercase font-bold mt-0.5" id="agent-status-text">
              {agentAccessActive ? "Online & Enabled (चालू है)" : "Disabled (बंद है)"}
            </span>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ml-4">
            <input
              checked={agentAccessActive}
              onChange={() => setAgentAccessActive(!agentAccessActive)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-parchment-surface dark:bg-surface-container border-4 border-surface-container appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out transform translate-x-5"
              id="agent-toggle"
              type="checkbox"
            />
            <label
              className="toggle-label block overflow-hidden h-5 rounded-full bg-emerald-500 cursor-pointer transition-colors duration-200 ease-in-out"
              htmlFor="agent-toggle"
            ></label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Seeding Form */}
        <div ref={formRef} className="lg:col-span-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle p-6 space-y-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-ink-text flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-500">add_shopping_cart</span>
              🛍️ Add Product to Price List
            </h3>

            <form onSubmit={handleAddCatalogItem} className="space-y-4 pt-2 font-bold text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                  Item Name (सामान का नाम)
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={catalogName}
                  onChange={(e) => setCatalogName(e.target.value)}
                  required
                  className="w-full bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-xs focus:ring-0 focus:border-amber-500 text-ink-text placeholder:text-outline transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                    Price (₹ or $) (कीमत)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder=""
                    value={catalogPrice}
                    onChange={(e) => setCatalogPrice(e.target.value)}
                    required
                    className="w-full bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-xs focus:ring-0 focus:border-amber-500 text-ink-text placeholder:text-outline transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                    Category (कैटेगरी)
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={catalogCategory}
                    onChange={(e) => setCatalogCategory(e.target.value)}
                    required
                    className="w-full bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-xs focus:ring-0 focus:border-amber-500 text-ink-text placeholder:text-outline transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                  Short Description (विवरण)
                </label>
                <textarea
                  placeholder=""
                  rows={4}
                  value={catalogDesc}
                  onChange={(e) => setCatalogDesc(e.target.value)}
                  className="w-full bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-xs focus:ring-0 focus:border-amber-500 text-ink-text placeholder:text-outline resize-none transition-all duration-200 leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={savingCatalog}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.95] disabled:opacity-50 font-black uppercase tracking-wider text-xs shadow-[0_4px_15px_rgba(245,158,11,0.3)] border-none cursor-pointer"
              >
                {savingCatalog ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                    💾 SAVE TO PRICE LIST (लिस्ट में जोड़ें)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Seeded Catalog List */}
        <div ref={dbRef} className="lg:col-span-8 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            {catalog.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant font-bold text-xs tracking-wide">
                No products added yet. Add your products using the form on the left!
              </div>
            ) : (
              <div className="flex flex-col">
                {Object.entries(groupedCatalog).map(([categoryName, items]) => (
                  <div key={categoryName} className="border-b border-border-subtle last:border-b-0">
                    {/* Category Title bar */}
                    <div className="bg-surface-container-low dark:bg-surface-container-high px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                      <h2 className="font-label-sm text-label-sm text-ink-text uppercase tracking-wider font-black">
                        {categoryName}
                      </h2>
                      <span className="font-mono text-[9px] text-amber-600 dark:text-amber-400 font-black uppercase bg-parchment-surface dark:bg-surface-container px-2 py-0.5 rounded border border-border-subtle">
                        {items.length} Items (सामान)
                      </span>
                    </div>

                    {/* Category list items */}
                    <ul className="flex flex-col font-bold">
                      {items.map((item, idx) => (
                        <li
                          key={idx}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-container-low/50 transition-colors duration-0 cursor-pointer"
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                              <span className="material-symbols-outlined text-[20px] text-amber-600 dark:text-amber-400">
                                {categoryName.toLowerCase().includes("jewel") ? "diamond" : 
                                 categoryName.toLowerCase().includes("grocer") ? "local_grocery_store" : 
                                 categoryName.toLowerCase().includes("service") || categoryName.toLowerCase().includes("rent") ? "local_mall" : "storefront"}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-body-md text-sm text-ink-text font-black leading-none">{item.name}</h3>
                                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  <span className="font-label-xs text-[9px] text-emerald-700 dark:text-emerald-400 font-black uppercase">Available (स्टॉक में है)</span>
                                </div>
                              </div>
                              <p className="font-label-sm text-xs text-on-surface-variant mt-1.5 font-bold">
                                {item.description || "No description configured."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-8 mt-4 sm:mt-0">
                            <div className="flex flex-col sm:text-right font-mono font-bold">
                              <span className="text-sm font-black text-ink-text">₹ {item.price?.toFixed(2)}</span>
                              <span className="text-[9px] text-on-surface-variant uppercase font-black tracking-wider">price (कीमत)</span>
                            </div>
                            <div className="w-8 flex justify-end" title={agentAccessActive ? "AI Assistant Can Read This (सहायक पढ़ सकता है)" : "AI Assistant Disabled (सहायक बंद है)"}>
                              {agentAccessActive ? (
                                <span className="material-symbols-outlined text-amber-500 text-[20px] font-bold">smart_toy</span>
                              ) : (
                                <span className="material-symbols-outlined text-outline-variant text-[20px] opacity-30">block</span>
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
