"use client";

import React, { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import type { DocumentInfo } from "@/lib/api";

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
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          Upload Store Details
        </h1>
        <p className="font-body text-sm text-slate-500 mt-1 max-w-2xl">
          Upload your product sheets, price lists, pamphlets, bills, or store policy docs. Your AI chatbot assistant will read these files to answer customer questions automatically.
        </p>
      </div>

      {/* Bento Layout Grid */}
      <div ref={gridRef} className="grid grid-cols-12 gap-6">
        {/* Left Column: Tabbed list & Search & Ingested Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 overflow-hidden shadow-xs" style={{ borderRadius: 16 }}>
            {/* Header Tabs */}
            <div className="flex p-2 gap-2 bg-slate-50 border-b border-slate-200">
              <button className="flex-1 px-4 py-2 bg-white border border-slate-200 font-mono text-sm tracking-wider uppercase text-slate-800 font-bold" style={{ borderRadius: 8 }}>
                Uploaded Store Files
              </button>
              <button className="flex-1 px-4 py-2 font-mono text-sm tracking-wider uppercase text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors font-semibold" style={{ borderRadius: 8 }}>
                Website Links
              </button>
            </div>

            <div className="p-6">
              {/* Search bar */}
              <div className="relative mb-6 flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] font-mono text-base text-slate-800 placeholder-slate-400"
                    style={{ borderRadius: 10 }}
                    placeholder="SEARCH UPLOADED FILES"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div ref={tableRef} className="overflow-x-auto">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-mono text-base tracking-wider uppercase font-semibold">
                    {searchQuery ? "No matches found." : "No store details uploaded yet. Upload a file on the right side!"}
                  </div>
                ) : (
                  <table className="w-full text-left font-mono border-collapse">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-bold w-7/12">Source Name</th>
                        <th className="py-3 px-2 font-bold">Type</th>
                        <th className="py-3 px-2 font-bold text-center w-28">Status</th>
                        <th className="py-3 px-4 font-bold text-right w-24">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 max-w-md">
                              <span className="material-symbols-outlined text-slate-450 text-[16px]">
                                {doc.file_type === "html" ? "link" : "description"}
                              </span>
                              <span className="text-[12px] text-slate-800 truncate font-bold" title={doc.file_name}>
                                {doc.file_name}
                              </span>
                            </div>
                            {doc.summary && (
                              <p className="text-[9px] text-slate-400 line-clamp-1 mt-1 pl-6">
                                {doc.summary}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm text-slate-400 font-bold uppercase">
                            {doc.file_type}
                          </td>
                          <td className="py-3 px-2">
                            {doc.status === "completed" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none bg-emerald-50 text-emerald-700 border border-emerald-250/60 w-fit mx-auto" style={{ borderRadius: 6 }}>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-bold tracking-wide uppercase">INDEXED</span>
                              </div>
                            )}
                            {doc.status === "processing" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none bg-amber-50 text-amber-700 border border-amber-250/60 w-fit mx-auto" style={{ borderRadius: 6 }}>
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-bold tracking-wide uppercase">SYNCING</span>
                              </div>
                            )}
                            {doc.status === "failed" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none bg-red-50 text-red-700 border border-red-250/60 w-fit mx-auto" style={{ borderRadius: 6 }}>
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                <span className="text-[9px] font-bold tracking-wide uppercase">ERROR</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-slate-400">
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
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* File drag uploader container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`bg-white border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:border-[#25D366] hover:bg-[#F0F2F5]/15 ${
              isDragOver
                ? "border-[#25D366] bg-[#F0F2F5]/20"
                : ""
            }`}
            style={{ borderRadius: 16 }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
            />
            <div className="w-12 h-12 bg-slate-50 border border-slate-250 rounded-none flex items-center justify-center mb-3 group-hover:bg-[#128C7E] group-hover:text-white group-hover:border-[#128C7E] transition-colors" style={{ borderRadius: 10 }}>
              {uploadingFile ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-700 group-hover:text-white" />
              ) : (
                <span className="material-symbols-outlined text-[24px] text-[#128C7E] group-hover:text-white font-bold">upload</span>
              )}
            </div>
            <h3 className="font-mono text-base text-slate-800 mb-1 font-bold uppercase tracking-wider">
              {uploadingFile ? "Saving file details..." : "Upload New File"}
            </h3>
            <p className="text-slate-400 text-sm font-mono mb-4 uppercase tracking-wider">
              Select bills, leaflets, PDFs, or photos (Max 10MB)
            </p>
            <button className="border border-slate-200 group-hover:border-[#25D366] group-hover:bg-[#128C7E] group-hover:text-white text-slate-700 font-mono text-sm uppercase tracking-[0.2em] px-4 py-2.5 bg-white transition-all cursor-pointer" style={{ borderRadius: 8 }}>
              Choose File
            </button>
          </div>

          {/* Web crawler form */}
          <div className="bg-white border border-slate-200 p-5 shadow-xs" style={{ borderRadius: 16 }}>
            <h3 className="font-mono text-[9px] text-[#128C7E] uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px] text-[#128C7E]">language</span>
              Copy from Website
            </h3>
            <p className="text-slate-400 text-[11px] mb-4 leading-relaxed font-normal">
              If your shop has a website or Facebook page, paste the link below to copy details automatically.
            </p>
            <form onSubmit={handleCrawlUrl} className="space-y-3">
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="ENTER WEBSITE LINK"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] text-slate-800 placeholder:text-slate-400 font-mono"
                style={{ borderRadius: 10 }}
              />
              <button
                type="submit"
                disabled={ingestingUrl}
                className="w-full bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white font-mono text-base py-3 px-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 tracking-[0.2em] uppercase cursor-pointer shadow-xs"
                style={{ borderRadius: 10 }}
              >
                {ingestingUrl ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  "Copy Website Link"
                )}
              </button>
            </form>
          </div>

          {/* System Health Progress Indicators */}
          <div className="bg-white border border-slate-200 p-5 shadow-xs" style={{ borderRadius: 16 }}>
            <h3 className="font-mono text-[9px] text-[#128C7E] uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-[#128C7E]">memory</span>
              Assistant Memory Status
            </h3>
            <div className="space-y-4 font-mono text-base">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-sm uppercase font-bold tracking-wider">Learned Details</span>
                <span className="text-slate-700 text-base font-bold">
                  {documents.length > 0 ? (documents.length * 42).toLocaleString() + " memory points" : "125 details"}
                </span>
              </div>
              <div className="w-full bg-slate-50 h-2 overflow-hidden border border-slate-200" style={{ borderRadius: 9999 }}>
                <div className="bg-[#128C7E] h-full transition-all duration-500 animate-pulse" style={{ width: documents.length > 0 ? `${Math.min(100, documents.length * 8)}%` : "20%" }}></div>
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-400 pt-2 border-t border-slate-100 uppercase font-bold tracking-wider">
                <span>Memory Capacity</span>
                <span>[{documents.length > 0 ? Math.min(100, documents.length * 8) : "20"}% USED]</span>
              </div>
            </div>
          </div>

          {/* Technical Help Box */}
          <div className="bg-[#25D366]/10 border border-violet-100 p-5 overflow-hidden relative" style={{ borderRadius: 16 }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#128C7E] text-[18px]">lightbulb</span>
                <span className="font-mono text-[#128C7E] tracking-wide text-[9px] uppercase font-bold">Shopkeeper Tip</span>
              </div>
              <p className="text-slate-650 font-normal text-base leading-relaxed">
                Upload clear photos of your product price list, or type a simple text file with product names and prices. This helps your WhatsApp assistant answer customers instantly without mistakes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
