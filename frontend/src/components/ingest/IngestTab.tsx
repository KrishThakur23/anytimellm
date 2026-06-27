"use client";

import React, { useRef, useState } from "react";
import { 
  Loader2, 
  UploadCloud, 
  Link as LinkIcon, 
  FileText, 
  Globe, 
  BrainCircuit, 
  Lightbulb, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Sparkles,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
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
  onDeleteDocument?: (id: string) => void;
  onRefresh?: () => void;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
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
  onDeleteDocument,
  onRefresh,
  page,
  total,
  limit,
  onPageChange,
}: IngestTabProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hasProcessingDocs = documents.some(doc => doc.status === "processing");

  React.useEffect(() => {
    if (!hasProcessingDocs || !onRefresh) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [hasProcessingDocs, onRefresh]);

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
    <div className="space-y-6 text-left pb-12">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-purple-600" />
          AI Memory Center
        </h1>
        <p className="font-body text-sm text-slate-500 mt-1 max-w-2xl">
          Upload documents and website links to train your Business Brain. The AI uses this context to autonomously handle inquiries and resolve support tickets.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-[#F8FAFC] flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-500" />
                Active Knowledge
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memory..."
                  className="w-full bg-white border border-slate-200 pl-9 pr-4 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              {filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-24 px-4 text-slate-500">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-semibold text-slate-700">Memory is empty</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Upload a document or provide a website link to start training your Business Brain.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-6 w-[45%]">Source Data</th>
                      <th className="py-4 px-4">Format</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-right">Learned On</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors shrink-0">
                              {doc.file_type === "html" ? (
                                <Globe className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-semibold text-slate-900 truncate block w-full" title={doc.file_name}>
                                {doc.file_name}
                              </span>
                              {doc.summary && (
                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed pr-4">
                                  {doc.summary}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                            {doc.file_type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {doc.status === "completed" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          )}
                          {doc.status === "processing" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Learning
                            </span>
                          )}
                          {doc.status === "failed" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right text-sm font-medium text-slate-500 whitespace-nowrap">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Just now"}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => onDeleteDocument?.(doc.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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

        {/* Right Column: Upload Forms & Status */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* File Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`bg-white border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-sm ${
              isDragOver ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-400 hover:bg-slate-50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.docx"
            />
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragOver ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
              {uploadingFile ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {uploadingFile ? "Processing Document..." : "Upload Document"}
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
              Drag & drop PDFs, text, or images up to 10MB to expand the memory.
            </p>
            <button className="text-xs font-bold uppercase tracking-wider text-purple-600 group-hover:text-purple-700 transition-colors">
              Browse Files
            </button>
          </div>

          {/* URL Crawler */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4 text-purple-500" />
              Learn from URL
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Paste a link to your website, FAQ, or policy. The AI will crawl it and build a memory map.
            </p>
            <form onSubmit={handleCrawlUrl} className="space-y-3">
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/pricing"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 placeholder:text-slate-400 transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={ingestingUrl}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
              >
                {ingestingUrl ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <>
                    <Globe className="w-4 h-4 opacity-70" />
                    Ingest Website
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Learning Progress */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-5 shadow-sm text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <BrainCircuit className="w-24 h-24" />
            </div>
            
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4 relative z-10 text-purple-50">
              <Sparkles className="w-4 h-4 text-purple-300" />
              Brain Capacity
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-purple-200">Knowledge Synapses</span>
                <span className="text-xl font-display font-bold text-white tracking-tight">
                  {documents.length > 0 ? (documents.length * 142).toLocaleString() : "0"}
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="bg-purple-400 h-full transition-all duration-1000 ease-out relative" 
                  style={{ width: documents.length > 0 ? `${Math.min(100, Math.max(5, documents.length * 8))}%` : "0%" }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-purple-300 pt-2 border-t border-white/10">
                <span>Vector DB</span>
                <span>{documents.length > 0 ? Math.min(100, documents.length * 8) : "0"}% Used</span>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start shadow-sm">
            <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Optimization Tip</h4>
              <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
                Text files mapped out as FAQs (Q&A format) yield the most accurate autonomous responses from the Business Brain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
