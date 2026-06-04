"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import type { Business } from "@/lib/api";

interface IntegrationsTabProps {
  activeBusiness: Business;
  copyToClipboard: (text: string) => void;
}

export default function IntegrationsTab({ activeBusiness, copyToClipboard }: IntegrationsTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const handleCopyUrl = () => {
    copyToClipboard(`http://your-server-ip:8000/api/webhooks/whatsapp/${activeBusiness.id}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyToken = () => {
    copyToClipboard("anytimellm_verify_token");
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display-lg text-4xl tracking-[0.08em] uppercase text-white">
          WhatsApp Setup
        </h1>
        <p className="font-body-md text-sm text-muted mt-1 italic">
          Connect your shop chatbot directly to WhatsApp! Follow these simple steps so your customers can start chatting with your shop.
        </p>
      </div>

      <div ref={containerRef} className="space-y-6">
        <div className="bg-surface-1 border border-border-subtle p-6 space-y-6 rounded-none">
          <h3 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Your Store Webhook Details
          </h3>

          <div className="space-y-4">
            {/* Row 1: Callback URL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-none bg-surface-2 border border-border-subtle text-xs items-center font-mono">
              <div className="col-span-1 text-muted font-bold uppercase tracking-wider text-[9px]">WhatsApp Webhook URL:</div>
              <div className="col-span-2 text-white truncate font-bold select-all pl-2">
                http://your-server-ip:8000/api/webhooks/whatsapp/{activeBusiness.id}
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={handleCopyUrl}
                  className="group inline-flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] px-3.5 py-2 bg-surface-1 hover:bg-white hover:text-black rounded-none border border-border-subtle transition duration-200 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px] text-muted group-hover:text-black transition-colors duration-200">content_copy</span>
                      Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Row 2: Verify Token */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-none bg-surface-2 border border-border-subtle text-xs items-center font-mono">
              <div className="col-span-1 text-muted font-bold uppercase tracking-wider text-[9px]">Verify Code:</div>
              <div className="col-span-2 text-white font-bold select-all pl-2">
                anytimellm_verify_token
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={handleCopyToken}
                  className="group inline-flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] px-3.5 py-2 bg-surface-1 hover:bg-white hover:text-black rounded-none border border-border-subtle transition duration-200 cursor-pointer"
                >
                  {copiedToken ? (
                    <>
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px] text-muted group-hover:text-black transition-colors duration-200">content_copy</span>
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Guide Section */}
          <div className="border-t border-border-subtle pt-6 space-y-4 font-mono text-xs">
            <h4 className="font-bold text-xs text-white uppercase tracking-widest">How to setup your WhatsApp chatbot in 5 minutes:</h4>
            <ol className="list-decimal list-inside text-xs text-muted space-y-3 leading-relaxed font-semibold">
              <li>
                Go to your app dashboard in <strong className="text-white font-bold">Meta for Developers</strong> (under the WhatsApp section).
              </li>
              <li>
                Click on <strong className="text-white font-bold">Configuration</strong> in the left sidebar navigation list.
              </li>
              <li>
                In the <strong className="text-white font-bold">Webhook</strong> parameters, paste the Callback URL and Verify Token from above.
              </li>
              <li>
                Click <strong className="text-white font-bold">Verify and Save</strong>. Meta will send a validation GET request to check authentication.
              </li>
              <li>
                Click <strong className="text-white font-bold">Manage</strong> webhooks subscriptions, and subscribe to the <strong className="text-white font-bold">messages</strong> fields.
              </li>
              <li>
                Now, any message sent to your WhatsApp number will trigger your automated shop chatbot assistant!
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
