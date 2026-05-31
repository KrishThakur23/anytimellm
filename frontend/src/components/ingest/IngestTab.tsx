"use client";

import React, { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import { DocumentInfo } from "@/lib/api";

interface IngestTabProps {
  documents: DocumentInfo[];
  urlInput: string;
  setUrlInput: (val: string) => void;
  ingestingUrl: boolean;
  uploadingFile: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCrawlUrl: (e: React.FormEvent) => void;
}

export default function IngestTab({
  documents,
  urlInput,
  setUrlInput,
  ingestingUrl,
  uploadingFile,
  fileInputRef,
  handleFileUpload,
  handleCrawlUrl,
}: IngestTabProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
    }
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      const fileInputElement = fileInputRef.current;
      if (fileInputElement) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        fileInputElement.files = dataTransfer.files;
        const event = new Event("change", { bubbles: true }) as any;
        fileInputElement.dispatchEvent(event);
      }
    }
  };

  // Filter documents based on search query
  const filteredDocs = documents.filter(doc => 
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.summary && doc.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-text">
          Upload Store Details
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 font-semibold max-w-2xl">
          Upload your product sheets, price lists, pamphlets, bills, or store policy docs. Your AI chatbot assistant will read these files to answer customer questions automatically.
        </p>
      </div>

      {/* Bento Layout Grid */}
      <div ref={gridRef} className="grid grid-cols-12 gap-gutter">
        {/* Left Column: Tabbed list & Search & Ingested Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {/* Header Tabs */}
            <div className="flex p-2 gap-2 bg-surface-container-low dark:bg-surface-container border-b border-border-subtle">
              <button className="flex-1 px-4 py-2 bg-parchment-surface dark:bg-surface-container-high border border-border-subtle shadow-sm rounded-md font-label-sm text-ink-text font-bold">
                Uploaded Store Files
              </button>
              <button className="flex-1 px-4 py-2 rounded-md font-label-sm text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-low transition-colors font-semibold">
                Website Links
              </button>
            </div>

            <div className="p-6">
              {/* Search bar */}
              <div className="relative mb-6 flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-parchment-surface dark:bg-surface-container-low border border-border-subtle rounded pl-9 pr-4 py-2.5 focus:ring-0 focus:border-ink-text transition-all font-label-sm text-xs text-ink-text"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Data Table */}
              <div ref={tableRef} className="overflow-x-auto">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-16 text-on-surface-variant text-xs font-mono tracking-wide">
                    {searchQuery ? "No matches found." : "No store details uploaded yet. Upload a file on the right side!"}
                  </div>
                ) : (
                  <table className="w-full text-left font-mono border-collapse">
                    <thead className="border-b border-border-subtle bg-surface-container-low dark:bg-surface-container-high text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-semibold w-7/12">Source Name</th>
                        <th className="py-3 px-2 font-semibold">Type</th>
                        <th className="py-3 px-2 font-semibold text-center w-28">Status</th>
                        <th className="py-3 px-4 font-semibold text-right w-24">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-surface-container-low dark:hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 max-w-md">
                              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                                {doc.file_type === "html" ? "link" : "description"}
                              </span>
                              <span className="text-[12px] text-ink-text truncate font-bold" title={doc.file_name}>
                                {doc.file_name}
                              </span>
                            </div>
                            {doc.summary && (
                              <p className="text-[9px] text-on-surface-variant line-clamp-1 mt-1 pl-6">
                                {doc.summary}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-2 text-[10px] text-on-surface-variant font-bold uppercase">
                            {doc.file_type}
                          </td>
                          <td className="py-3 px-2">
                            {doc.status === "completed" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 w-fit mx-auto border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold tracking-wide uppercase">INDEXED</span>
                              </div>
                            )}
                            {doc.status === "processing" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 w-fit mx-auto border border-amber-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold tracking-wide uppercase">SYNCING</span>
                              </div>
                            )}
                            {doc.status === "failed" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 w-fit mx-auto border border-red-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                <span className="text-[9px] text-red-700 dark:text-red-400 font-bold tracking-wide uppercase">ERROR</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right text-[10px] text-on-surface-variant">
                            {doc.created_at ? new Date(doc.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "just now"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload forms, Web crawler, Health indicators */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          {/* File drag uploader container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`bg-purple-500/[0.02] dark:bg-purple-500/[0.05] border-2 border-dashed border-purple-400 dark:border-purple-600/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-sm hover:scale-[1.01] ${
              isDragOver
                ? "border-purple-600 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                : "hover:border-purple-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
            />
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 dark:group-hover:bg-purple-500 group-hover:text-white transition-colors">
              {uploadingFile ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400 group-hover:text-white" />
              ) : (
                <span className="material-symbols-outlined text-[24px] text-purple-600 dark:text-purple-400 group-hover:text-white font-bold">upload</span>
              )}
            </div>
            <h3 className="font-label-sm text-ink-text mb-1 font-black text-xs">
              {uploadingFile ? "💾 Saving file details..." : "📁 Upload New File"}
            </h3>
            <p className="text-on-surface-variant text-[10px] font-bold mb-4">
              Select bills, leaflets, PDFs, or photos (Max 10MB)
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg border-none transition-all cursor-pointer shadow-sm active:scale-[0.95]">
              Choose File (फाइल चुनें)
            </button>
          </div>

          {/* Web crawler form */}
          <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl p-5 shadow-sm">
            <h3 className="font-label-xs text-on-surface-variant uppercase tracking-widest mb-3 font-black flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px] text-purple-500">language</span>
              🌐 Copy from Website (वेबसाइट लिंक)
            </h3>
            <p className="text-on-surface-variant text-[11px] font-bold mb-4 leading-relaxed">
              If your shop has a website or Facebook page, paste the link below to copy details automatically.
            </p>
            <form onSubmit={handleCrawlUrl} className="space-y-3">
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder=""
                className="w-full bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-xs focus:ring-0 focus:border-purple-500 text-ink-text placeholder:text-outline font-bold"
              />
              <button
                type="submit"
                disabled={ingestingUrl}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.95] disabled:opacity-50 tracking-wider cursor-pointer shadow-sm border-none"
              >
                {ingestingUrl ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  "📥 Copy Website Link"
                )}
              </button>
            </form>
          </div>

          {/* System Health Progress Indicators */}
          <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl p-5 shadow-sm">
            <h3 className="font-label-xs text-on-surface-variant uppercase tracking-widest mb-4 font-black flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-purple-500">memory</span>
              🧠 Assistant Memory Status (याददाश्त)
            </h3>
            <div className="space-y-4 font-bold text-xs">
              <div className="flex justify-between items-end">
                <span className="text-on-surface-variant text-[10px] uppercase font-black tracking-wider">🧠 Learned Details</span>
                <span className="text-purple-600 dark:text-purple-400 text-xs font-black">
                  {documents.length > 0 ? (documents.length * 42).toLocaleString() + " memory points" : "125 details"}
                </span>
              </div>
              <div className="w-full bg-surface-container-low dark:bg-surface-container-high h-2.5 rounded-full overflow-hidden border border-border-subtle">
                <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: documents.length > 0 ? `${Math.min(100, documents.length * 8)}%` : "20%" }}></div>
              </div>
              <div className="flex justify-between items-center text-[9px] text-on-surface-variant pt-2 border-t border-border-subtle uppercase font-black tracking-wider">
                <span>Memory Capacity</span>
                <span>[{documents.length > 0 ? Math.min(100, documents.length * 8) : "20"}% USED]</span>
              </div>
            </div>
          </div>

          {/* Technical Directive Help Box */}
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 overflow-hidden relative shadow-sm">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px] font-bold">lightbulb</span>
                <span className="font-label-sm text-amber-600 dark:text-amber-400 tracking-wide text-[10px] uppercase font-black">💡 Shopkeeper Tip (सलाह)</span>
              </div>
              <p className="text-ink-text dark:text-foreground text-xs leading-relaxed font-bold">
                Upload clear photos of your product price list, or type a simple text file with product names and prices. This helps your WhatsApp assistant answer customers instantly without mistakes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
