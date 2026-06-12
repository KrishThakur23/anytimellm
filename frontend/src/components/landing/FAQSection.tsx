"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setActiveFaq(prev => prev === id ? null : id);
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100 w-full z-10" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-[#F0F2F5] border border-[#DCF8C6] text-[#128C7E] text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
            Common Questions
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto bg-white border border-slate-200 p-2 shadow-xs" style={{ borderRadius: 20 }}>
          {[
            {
              id: "wa-api",
              q: "How does the WhatsApp integration work?",
              a: "AnytimeLLM connects directly to Meta's WhatsApp Cloud API. Once configured, all incoming messages trigger our secure gateway webhook, which processes query intents, scans your catalog/knowledge base, and dispatches automated replies instantly."
            },
            {
              id: "unknown",
              q: "What happens when the AI doesn't know the answer?",
              a: "If the AI confidence falls below a preset threshold, or it detects a complaint or complex query, it pauses auto-replies, alerts you via push notifications, and highlights the chat in the 'Needs Action' dashboard folder so you can intervene manually."
            },
            {
              id: "security",
              q: "Is my business data secure?",
              a: "Yes. AnytimeLLM indexes all business data (PDFs, Catalogs, CSVs) inside fully isolated namespaces via Pinecone database partitioning. Your data is private, sandboxed, and can never leak to or train other tenants."
            },
            {
              id: "formats",
              q: "What file formats can I upload to the knowledge base?",
              a: "We support PDF, TXT, DOCX, CSV, and direct website URL crawls. Our file parser strips formatting, extracts text, handles table values, and chunks files semantically for vector database retrieval."
            },
            {
              id: "hinglish",
              q: "Does it support local Indian languages or dialects?",
              a: "Yes! Our engine natively understands and writes in Hindi, English, and Hinglish (Hindi written in the Roman script), mapping to how local Indian customers naturally converse on WhatsApp."
            }
          ].map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div key={faq.id} className="border-b border-slate-100 last:border-b-0">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm text-slate-800">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-slate-100" : "max-h-0"
                  }`}
                >
                  <p className="font-body text-base text-slate-500 leading-relaxed p-5 bg-slate-50/40">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
