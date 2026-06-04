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
        <h1 className="font-display-lg text-4xl tracking-[0.08em] uppercase text-white">
          Upload Store Details
        </h1>
        <p className="font-body-md text-sm text-muted mt-1 italic max-w-2xl">
          Upload your product sheets, price lists, pamphlets, bills, or store policy docs. Your AI chatbot assistant will read these files to answer customer questions automatically.
        </p>
      </div>

      {/* Bento Layout Grid */}
      <div ref={gridRef} className="grid grid-cols-12 gap-6">
        {/* Left Column: Tabbed list & Search & Ingested Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-1 border border-border-subtle rounded-none overflow-hidden shadow-none">
            {/* Header Tabs */}
            <div className="flex p-2 gap-2 bg-surface-2 border-b border-border-subtle">
              <button className="flex-1 px-4 py-2 bg-surface-0 border border-border-subtle rounded-none font-mono text-[10px] tracking-wider uppercase text-white font-bold">
                Uploaded Store Files
              </button>
              <button className="flex-1 px-4 py-2 rounded-none font-mono text-[10px] tracking-wider uppercase text-muted hover:text-white hover:bg-surface-0 transition-colors font-semibold">
                Website Links
              </button>
            </div>

            <div className="p-6">
              {/* Search bar */}
              <div className="relative mb-6 flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-2 border border-border-subtle rounded-none pl-9 pr-4 py-2.5 focus:outline-none focus:border-white transition-all font-mono text-xs text-white placeholder-muted"
                    placeholder="SEARCH UPLOADED FILES"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div ref={tableRef} className="overflow-x-auto">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-16 text-muted font-mono text-xs tracking-wider uppercase">
                    {searchQuery ? "No matches found." : "No store details uploaded yet. Upload a file on the right side!"}
                  </div>
                ) : (
                  <table className="w-full text-left font-mono border-collapse">
                    <thead className="border-b border-border-subtle bg-surface-2 text-muted text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-semibold w-7/12">Source Name</th>
                        <th className="py-3 px-2 font-semibold">Type</th>
                        <th className="py-3 px-2 font-semibold text-center w-28">Status</th>
                        <th className="py-3 px-4 font-semibold text-right w-24">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-surface-2/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 max-w-md">
                              <span className="material-symbols-outlined text-muted text-[16px]">
                                {doc.file_type === "html" ? "link" : "description"}
                              </span>
                              <span className="text-[12px] text-white truncate font-bold" title={doc.file_name}>
                                {doc.file_name}
                              </span>
                            </div>
                            {doc.summary && (
                              <p className="text-[9px] text-muted line-clamp-1 mt-1 pl-6">
                                {doc.summary}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-2 text-[10px] text-muted font-bold uppercase">
                            {doc.file_type}
                          </td>
                          <td className="py-3 px-2">
                            {doc.status === "completed" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none bg-emerald-500/10 w-fit mx-auto border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 bg-emerald-500"></div>
                                <span className="text-[9px] text-emerald-400 font-bold tracking-wide uppercase">INDEXED</span>
                              </div>
                            )}
                            {doc.status === "processing" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none bg-amber-500/10 w-fit mx-auto border border-amber-500/20">
                                <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse"></div>
                                <span className="text-[9px] text-amber-400 font-bold tracking-wide uppercase">SYNCING</span>
                              </div>
                            )}
                            {doc.status === "failed" && (
                              <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none bg-red-500/10 w-fit mx-auto border border-red-500/20">
                                <div className="w-1.5 h-1.5 bg-red-500"></div>
                                <span className="text-[9px] text-red-400 font-bold tracking-wide uppercase">ERROR</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right text-[10px] text-muted">
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
            className={`bg-surface-1 border border-dashed border-border-subtle rounded-none p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:border-white ${
              isDragOver
                ? "border-white bg-surface-2"
                : ""
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
            />
            <div className="w-12 h-12 bg-surface-2 border border-border-subtle rounded-none flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-black transition-colors">
              {uploadingFile ? (
                <Loader2 className="w-5 h-5 animate-spin text-white group-hover:text-black" />
              ) : (
                <span className="material-symbols-outlined text-[24px] text-muted-gold group-hover:text-black font-bold">upload</span>
              )}
            </div>
            <h3 className="font-mono text-xs text-white mb-1 font-bold uppercase tracking-wider">
              {uploadingFile ? "Saving file details..." : "Upload New File"}
            </h3>
            <p className="text-muted text-[10px] font-mono mb-4 uppercase tracking-wider">
              Select bills, leaflets, PDFs, or photos (Max 10MB)
            </p>
            <button className="border border-white hover:bg-white hover:text-black text-white font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 rounded-none bg-transparent transition-all cursor-pointer">
              Choose File
            </button>
          </div>

          {/* Web crawler form */}
          <div className="bg-surface-1 border border-border-subtle rounded-none p-5">
            <h3 className="font-mono text-[10px] text-muted-gold uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px] text-white">language</span>
              Copy from Website
            </h3>
            <p className="text-muted text-[11px] font-body-md mb-4 leading-relaxed italic">
              If your shop has a website or Facebook page, paste the link below to copy details automatically.
            </p>
            <form onSubmit={handleCrawlUrl} className="space-y-3">
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="ENTER WEBSITE LINK"
                className="w-full bg-surface-2 border border-border-subtle rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-white text-white placeholder:text-muted font-mono"
              />
              <button
                type="submit"
                disabled={ingestingUrl}
                className="w-full border border-white hover:bg-white hover:text-black text-white bg-transparent font-mono text-xs py-3 px-4 rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 tracking-[0.2em] uppercase cursor-pointer"
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
          <div className="bg-surface-1 border border-border-subtle rounded-none p-5">
            <h3 className="font-mono text-[10px] text-muted-gold uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-white">memory</span>
              Assistant Memory Status
            </h3>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-end">
                <span className="text-muted text-[10px] uppercase font-bold tracking-wider">Learned Details</span>
                <span className="text-white text-xs font-bold">
                  {documents.length > 0 ? (documents.length * 42).toLocaleString() + " memory points" : "125 details"}
                </span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-none overflow-hidden border border-border-subtle">
                <div className="bg-white h-full transition-all duration-500" style={{ width: documents.length > 0 ? `${Math.min(100, documents.length * 8)}%` : "20%" }}></div>
              </div>
              <div className="flex justify-between items-center text-[9px] text-muted pt-2 border-t border-border-subtle uppercase font-bold tracking-wider">
                <span>Memory Capacity</span>
                <span>[{documents.length > 0 ? Math.min(100, documents.length * 8) : "20"}% USED]</span>
              </div>
            </div>
          </div>

          {/* Technical Directive Help Box */}
          <div className="bg-surface-1 border border-border-subtle rounded-none p-5 overflow-hidden relative">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-gold text-[18px]">lightbulb</span>
                <span className="font-mono text-muted-gold tracking-wide text-[10px] uppercase font-bold">Shopkeeper Tip</span>
              </div>
              <p className="text-white font-body-md text-xs leading-relaxed italic">
                Upload clear photos of your product price list, or type a simple text file with product names and prices. This helps your WhatsApp assistant answer customers instantly without mistakes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
