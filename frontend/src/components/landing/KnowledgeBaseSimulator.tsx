"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const files = {
  sop: {
    name: "Store_Standard_Operating_Procedures.pdf",
    size: "1.4 MB",
    queries: [
      "What is the policy for booking cancellations?",
      "When is the store opening hours?"
    ],
    answers: {
      "What is the policy for booking cancellations?": "Cancellations made within 24 hours of the scheduled service slot will incur a 50% fee. No-shows are charged at 100%. Cancellations made earlier are fully refunded.",
      "When is the store opening hours?": "We are open Monday through Saturday from 9:00 AM to 8:00 PM. On Sundays, we operate on a shortened schedule from 10:00 AM to 4:00 PM."
    },
    chunks: [
      { doc: "SOP.pdf [Page 4]", content: "...cancellations made less than 24 hours prior to the slot will be charged a 50% cancellation penalty fee...", score: 0.96 },
      { doc: "SOP.pdf [Page 1]", content: "...standard operating hours of the storefront are 09:00 to 20:00, Mon-Sat, Sunday 10:00 to 16:00...", score: 0.94 }
    ]
  },
  refund: {
    name: "Customer_Refund_Policy.docx",
    size: "820 KB",
    queries: [
      "Do you accept returns on sales items?",
      "How long do refunds take to process?"
    ],
    answers: {
      "Do you accept returns on sales items?": "No, all clearance and sale items are marked as final sale and cannot be returned or refunded unless they arrive damaged.",
      "How long do refunds take to process?": "Once approved, refunds are processed immediately back to the original payment method. Depending on your bank, it takes 5 to 7 business days to reflect."
    },
    chunks: [
      { doc: "Refund_Policy.docx [Para 3]", content: "...items sold on clearance, discount, or marked as final sale are ineligible for returns, exchange, or refund...", score: 0.98 },
      { doc: "Refund_Policy.docx [Para 1]", content: "...refund processing window is 5-7 business days depending on credit card issuer/banking institution policies...", score: 0.95 }
    ]
  },
  catalog: {
    name: "Summer_Product_Catalog.csv",
    size: "240 KB",
    queries: [
      "What is the price of the Linen Summer Shirt?",
      "What colors are available for the Denim Jacket?"
    ],
    answers: {
      "What is the price of the Linen Summer Shirt?": "The Linen Summer Shirt is priced at ₹1,899, available in White, Sand, and Olive.",
      "What colors are available for the Denim Jacket?": "The Classic Denim Jacket is available in Light Wash Blue, Dark Indigo, and Faded Black at ₹2,499."
    },
    chunks: [
      { doc: "Catalog.csv [Line 14]", content: "SKU-LN-14, Linen Summer Shirt, category=tops, price=1899, colors=White|Sand|Olive, stock=45", score: 0.97 },
      { doc: "Catalog.csv [Line 82]", content: "SKU-DJ-02, Classic Denim Jacket, category=outerwear, price=2499, colors=Light Blue|Indigo|Black, stock=18", score: 0.96 }
    ]
  }
};

export default function KnowledgeBaseSimulator() {
  const [kbFile, setKbFile] = useState<"sop" | "refund" | "catalog">("sop");
  const [kbStatus, setKbStatus] = useState<"idle" | "uploading" | "chunking" | "embedding" | "completed">("idle");
  const [kbProgress, setKbProgress] = useState(0);
  const [kbConsoleLogs, setKbConsoleLogs] = useState<string[]>([]);
  const [kbTestQuery, setKbTestQuery] = useState("");
  const [kbAiReply, setKbAiReply] = useState("");
  const [kbIsAnswering, setKbIsAnswering] = useState(false);
  const [kbExtractedChunks, setKbExtractedChunks] = useState<{ doc: string; content: string; score: number }[]>([]);

  const handleKbFileSelect = (fileKey: "sop" | "refund" | "catalog") => {
    setKbFile(fileKey);
    setKbStatus("idle");
    setKbProgress(0);
    setKbConsoleLogs([]);
    setKbTestQuery("");
    setKbAiReply("");
    setKbExtractedChunks([]);
  };

  const startKbIngestionSim = () => {
    setKbStatus("uploading");
    setKbProgress(0);
    setKbConsoleLogs(["[INIT] Connecting to tenant ingestion gateway...", "[INGEST] Receiving file byte stream..."]);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setKbProgress(currentProgress);
      
      if (currentProgress === 30) {
        setKbStatus("chunking");
        setKbConsoleLogs(prev => [...prev, `[PROCESS] Parsing file structure...`, `[PROCESS] Extracting plain text. File parsed successfully.`, `[PROCESS] Splitting text into semantic, overlapping chunks...`]);
      } else if (currentProgress === 60) {
        setKbStatus("embedding");
        setKbConsoleLogs(prev => [...prev, `[COGNITION] Invoking text-embedding-004 model...`, `[COGNITION] Computed vector coordinates for 12 nodes.`]);
      } else if (currentProgress === 90) {
        setKbConsoleLogs(prev => [...prev, `[DB] Connecting to namespace '${files[kbFile].name.split(".")[0].toLowerCase()}'...`, `[DB] Upserting vector vectors to Pinecone Index...`]);
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setKbStatus("completed");
        setKbConsoleLogs(prev => [...prev, `[SUCCESS] Sync completed. 12 vector nodes indexed in tenant namespace.`, `[SYSTEM] Ready for testing.`]);
      }
    }, 250);
  };

  const runKbTestQuery = (queryText: string) => {
    if (kbStatus !== "completed" || kbIsAnswering) return;
    setKbTestQuery(queryText);
    setKbIsAnswering(true);
    setKbAiReply("");
    setKbExtractedChunks([]);

    setTimeout(() => {
      // Simulate retrieval
      const activeFile = files[kbFile];
      setKbExtractedChunks(activeFile.chunks);

      let answer = (activeFile.answers as Record<string, string>)[queryText] || "Result matches catalog criteria.";
      let currentText = "";
      let wordIdx = 0;
      const words = answer.split(" ");
      
      const typeInterval = setInterval(() => {
        if (wordIdx < words.length) {
          currentText += (wordIdx === 0 ? "" : " ") + words[wordIdx];
          setKbAiReply(currentText);
          wordIdx++;
        } else {
          clearInterval(typeInterval);
          setKbIsAnswering(false);
        }
      }, 70);

    }, 800);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text description */}
        <div className="lg:col-span-5 text-left">
          <span className="inline-block px-3 py-1 bg-[#F0F2F5] border border-[#DCF8C6] text-[#128C7E] text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
            No Setup Required
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Just upload your files. <span className="text-gradient-hero">We do the rest.</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 leading-relaxed font-normal">
            Drop your catalog sheets, cancellation guidelines, restaurant menus, or service policies. Our system instantly reads and understands your business so it can answer customers accurately.
          </p>
          
          {/* Interactive File Switcher buttons */}
          <div className="mt-8 space-y-3">
            {[
              { key: "sop", label: "Store_Standard_Operating_Procedures.pdf", size: "1.4 MB", icon: "📄" },
              { key: "refund", label: "Customer_Refund_Policy.docx", size: "820 KB", icon: "📄" },
              { key: "catalog", label: "Summer_Product_Catalog.csv", size: "240 KB", icon: "📊" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => handleKbFileSelect(f.key as "sop" | "refund" | "catalog")}
                className={`w-full p-3.5 border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                  kbFile === f.key 
                    ? "border-[#25D366] bg-[#25D366]/10 text-[#075E54]" 
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
                style={{ borderRadius: 12 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <div>
                    <div className="text-[11px] font-semibold tracking-wide truncate max-w-[200px] md:max-w-[280px]">
                      {f.label}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{f.size}</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400">SELECT</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Pipeline simulation */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 shadow-xl overflow-hidden p-6 relative flex flex-col justify-between" style={{ borderRadius: 20, minHeight: 450 }}>
            
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F0F2F5]0 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700 tracking-wider uppercase">
                  Data Processor
                </span>
              </div>
            </div>

            {/* Ingestion Panel */}
            <div className="flex-1 flex flex-col justify-center">
              {kbStatus === "idle" && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-[#F0F2F5] border-2 border-dashed border-violet-300 mx-auto flex items-center justify-center text-xl" style={{ borderRadius: 12 }}>
                    📥
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                      {files[kbFile].name}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">File loaded. Ready to process.</p>
                  </div>
                  <button
                    onClick={startKbIngestionSim}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white font-semibold text-base tracking-wider uppercase shadow-sm cursor-pointer"
                    style={{ borderRadius: 8 }}
                  >
                    Start Processing
                  </button>
                </div>
              )}

              {(kbStatus === "uploading" || kbStatus === "chunking" || kbStatus === "embedding") && (
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm font-semibold uppercase text-slate-600">
                      <span>
                        {kbStatus === "uploading" && "Uploading document..."}
                        {kbStatus === "chunking" && "Reading content..."}
                        {kbStatus === "embedding" && "Saving to AI memory..."}
                      </span>
                      <span>{kbProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 overflow-hidden" style={{ borderRadius: 9999 }}>
                      <div 
                        className="h-full bg-gradient-to-r from-[#128C7E] to-[#25D366] transition-all duration-300 ease-out" 
                        style={{ width: `${kbProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Progress details */}
                  <div className="bg-[#0A0A0F] text-slate-300 font-mono text-[9px] p-3.5 h-[110px] overflow-y-auto leading-relaxed border border-slate-800" style={{ borderRadius: 10 }}>
                    {kbConsoleLogs.map((log, idx) => (
                      <div key={idx} className="truncate">
                        <span className="text-[#25D366] mr-1.5">$</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {kbStatus === "completed" && (
                <div className="space-y-5 py-2">
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 text-emerald-800" style={{ borderRadius: 12 }}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider">Learned Successfully</div>
                      <div className="text-[9px] text-emerald-600 font-medium">Ready to answer customer questions based on this file.</div>
                    </div>
                  </div>

                  {/* Interactive query playground inside simulator */}
                  <div className="space-y-3">
                    <label className="font-mono text-[8px] text-slate-400 uppercase tracking-widest block font-bold">Ask a test question</label>
                    <div className="flex flex-wrap gap-1.5">
                      {files[kbFile].queries.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => runKbTestQuery(q)}
                          disabled={kbIsAnswering}
                          className="text-sm bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 hover:bg-slate-100 transition-all cursor-pointer"
                          style={{ borderRadius: 9999 }}
                        >
                          💡 "{q}"
                        </button>
                      ))}
                    </div>

                    {/* Input mockup / Output showing retrieval chunks */}
                    {kbTestQuery && (
                      <div className="border border-slate-100 bg-slate-50/50 p-4 space-y-3" style={{ borderRadius: 12 }}>
                        {/* Query */}
                        <div className="text-sm text-slate-400">
                          Question: <span className="font-semibold text-slate-700">"{kbTestQuery}"</span>
                        </div>

                        {/* AI Reply */}
                        <div className="border-t border-slate-200/50 pt-3">
                          <span className="text-[8px] font-mono text-[#128C7E] uppercase tracking-wider block font-bold mb-1">AI Answer:</span>
                          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                            {kbAiReply}
                            {kbIsAnswering && <span className="inline-block w-1.5 h-3.5 bg-[#128C7E] ml-1 animate-pulse" />}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
