"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import type { Business } from "@/lib/api";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface IntegrationsTabProps {
  activeBusiness: Business;
  copyToClipboard: (text: string) => void;
}

export default function IntegrationsTab({ activeBusiness, copyToClipboard }: IntegrationsTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Connection states
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState<{
    connected: boolean;
    provider?: string;
    phone_number_id?: string;
    display_name?: string;
    verify_token?: string;
  } | null>(null);

  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedVerify, setCopiedVerify] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  
  // Developer/Mock settings
  const [developerMode, setDeveloperMode] = useState(true);

  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
    
    // Animate container elements
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await api.getMetaIntegrationStatus();
      setIntegrationStatus(res);
    } catch (err) {
      console.error("Failed to load WhatsApp status:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      if (developerMode) {
        // Developer mock code - bypasses Facebook login dialog for fast local testing
        await api.saveMetaAuthCode("mock_code_" + Math.random().toString(36).substring(7));
        await fetchStatus();
      } else {
        // Production Meta login popup trigger
        if (!(window as any).FB) {
          throw new Error(
            "Facebook SDK is not initialized. Please verify META_APP_ID is configured in the environment settings."
          );
        }
        (window as any).FB.login(
          async (response: any) => {
            if (response.authResponse && response.authResponse.code) {
              try {
                await api.saveMetaAuthCode(response.authResponse.code);
                await fetchStatus();
              } catch (ex: any) {
                setError(ex.message || "Failed to exchange auth credentials with the server.");
              }
            } else {
              setError("Meta registration login was cancelled or failed to verify.");
            }
            setConnecting(false);
          },
          {
            scope: "whatsapp_business_management,whatsapp_business_messaging",
            extras: {
              feature: "whatsapp_embedded_signup"
            }
          }
        );
        return; // wait for login callback
      }
    } catch (err: any) {
      setError(err.message || "Connection failed.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect WhatsApp? Your chatbot will stop responding to WhatsApp customers.")) return;
    setLoadingStatus(true);
    try {
      // Disconnect by updating settings to default mock/ignored state
      await api.updateBusinessSettings(activeBusiness.id, {
        whatsapp_provider: "mock"
      });
      await fetchStatus();
    } catch (err) {
      setError("Failed to disconnect WhatsApp integrations.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleCopyWebhook = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:8000";
    copyToClipboard(`${baseUrl}/api/webhooks/whatsapp/incoming`);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCopyVerify = (text: string) => {
    copyToClipboard(text);
    setCopiedVerify(true);
    setTimeout(() => setCopiedVerify(false), 2000);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          Integrations & Channels
        </h1>
        <p className="font-body text-sm text-slate-500 mt-1">
          Link your automated AI assistant directly to messaging channels.
        </p>
      </div>

      <div ref={containerRef} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-none flex items-start gap-3 text-red-750 text-base font-mono" style={{ borderRadius: 12 }}>
            <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0 mt-0.5">error</span>
            <span className="tracking-wider">{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loadingStatus ? (
          <div className="bg-white border border-slate-200 p-12 flex flex-col items-center justify-center space-y-4 shadow-xs" style={{ borderRadius: 16 }}>
            <Loader2 className="w-8 h-8 animate-spin text-[#128C7E]" />
            <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase font-bold">Querying WhatsApp Status...</span>
          </div>
        ) : (
          <>
            {/* Status Section */}
            {integrationStatus?.connected ? (
              <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-xs" style={{ borderRadius: 16 }}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="font-mono text-[9px] text-emerald-700 tracking-widest font-bold uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-1" style={{ borderRadius: 6 }}>
                      CONNECTED (COEXISTENCE ACTIVE)
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-slate-800 uppercase mt-4">
                      {integrationStatus.display_name || "WhatsApp Business Account"}
                    </h3>
                    <p className="font-body text-base text-slate-500 mt-1 leading-relaxed">
                      Incoming messages to your business number are processed by your AI agent, while you retain manual chat controls on your WhatsApp Business app.
                    </p>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="border border-red-200 hover:border-red-500 hover:bg-red-50/50 text-red-650 rounded-none py-1.5 px-4 font-mono text-[9px] tracking-wider uppercase transition-all duration-305 cursor-pointer font-bold shrink-0"
                    style={{ borderRadius: 8 }}
                  >
                    Disconnect Channel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  {/* Phone ID */}
                  <div className="p-4 bg-slate-50 border border-slate-200 font-mono text-base text-left" style={{ borderRadius: 12 }}>
                    <span className="block text-slate-400 text-[9px] uppercase tracking-wider font-bold mb-1">WhatsApp Phone ID</span>
                    <span className="text-slate-800 font-bold select-all">{integrationStatus.phone_number_id || "N/A"}</span>
                  </div>
                  {/* Provider */}
                  <div className="p-4 bg-slate-50 border border-slate-200 font-mono text-base text-left" style={{ borderRadius: 12 }}>
                    <span className="block text-slate-400 text-[9px] uppercase tracking-wider font-bold mb-1">API Provider</span>
                    <span className="text-slate-800 font-bold uppercase tracking-wider">{integrationStatus.provider || "N/A"}</span>
                  </div>
                </div>

                {integrationStatus.verify_token && (
                  <div className="space-y-4 border-t border-slate-100 pt-6 font-mono text-base text-left">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-sm">System Webhook Details:</h4>
                    <p className="text-slate-500 leading-relaxed font-body text-base">
                      Below is your unified webhook callback URL. When deploying in production, ensure this endpoint is subscribed in your Meta Developer Portal.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-none bg-slate-50 border border-slate-200 items-center" style={{ borderRadius: 12 }}>
                        <div className="col-span-1 text-slate-450 font-bold uppercase tracking-wider text-[9px]">Webhook URL:</div>
                        <div className="col-span-2 text-slate-850 truncate font-bold select-all pl-2">
                          {typeof window !== "undefined" ? window.location.origin : "http://localhost:8000"}/api/webhooks/whatsapp/incoming
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            onClick={handleCopyWebhook}
                            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-3.5 py-1.5 bg-white hover:bg-slate-50 rounded-none border border-slate-200 transition duration-200 cursor-pointer font-bold text-slate-700"
                            style={{ borderRadius: 8 }}
                          >
                            {copiedWebhook ? "Copied" : "Copy URL"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-none bg-slate-50 border border-slate-200 items-center" style={{ borderRadius: 12 }}>
                        <div className="col-span-1 text-slate-450 font-bold uppercase tracking-wider text-[9px]">Verify Token:</div>
                        <div className="col-span-2 text-slate-850 font-bold select-all pl-2">
                          {integrationStatus.verify_token}
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            onClick={() => handleCopyVerify(integrationStatus.verify_token || "")}
                            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-3.5 py-1.5 bg-white hover:bg-slate-50 rounded-none border border-slate-200 transition duration-200 cursor-pointer font-bold text-slate-700"
                            style={{ borderRadius: 8 }}
                          >
                            {copiedVerify ? "Copied" : "Copy Token"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-8 space-y-8 shadow-xs" style={{ borderRadius: 16 }}>
                <div>
                  <span className="font-mono text-[9px] text-[#128C7E] tracking-widest uppercase font-bold">META WHATSAPP INTEGRATION</span>
                  <h3 className="font-display text-2xl font-extrabold text-slate-800 uppercase mt-1 mb-3">
                    Connect via Embedded Signup
                  </h3>
                  <p className="font-body text-sm text-slate-500 leading-relaxed max-w-2xl">
                    Upgrade your business phone number to the official WhatsApp Business Cloud API. This enables automated catalog lookup, order placement, and AI chats without losing access to your mobile WhatsApp Business App.
                  </p>
                </div>

                {/* Coexistence Features Bento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-base text-left">
                  <div className="p-5 bg-slate-50 border border-slate-200" style={{ borderRadius: 12 }}>
                    <span className="block font-bold text-slate-850 uppercase tracking-wider mb-2">💬 WhatsApp App Access</span>
                    <span className="text-slate-500 leading-relaxed font-body text-base">Keep your iOS/Android WhatsApp app. Both the app and our AI bot operate on the same number simultaneously.</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200" style={{ borderRadius: 12 }}>
                    <span className="block font-bold text-slate-850 uppercase tracking-wider mb-2">⚡ Real-Time Sync</span>
                    <span className="text-slate-500 leading-relaxed font-body text-base">All conversation threads are mirrored across your phone and this dashboard console instantly.</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200" style={{ borderRadius: 12 }}>
                    <span className="block font-bold text-slate-850 uppercase tracking-wider mb-2">🔒 Secure OAuth Setup</span>
                    <span className="text-slate-500 leading-relaxed font-body text-base">No manual webhook setups. Simply verify your number in Meta's popup and we handle tokens automatically.</span>
                  </div>
                </div>

                {/* Onboarding Trigger Controls */}
                <div className="p-6 bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderRadius: 14 }}>
                  <div className="text-left">
                    <h4 className="font-display text-sm text-slate-800 uppercase font-bold tracking-wider">Start Verification Flow</h4>
                    <p className="font-body text-base text-slate-500 mt-1">
                      Initiate the 2-minute Facebook setup. You will need your Facebook Login credentials.
                    </p>
                    
                    {/* Developer Mock Toggle */}
                    <div className="flex items-center gap-2 mt-4 font-mono text-[9px]">
                      <input
                        type="checkbox"
                        id="dev-mode-checkbox"
                        checked={developerMode}
                        onChange={(e) => setDeveloperMode(e.target.checked)}
                        className="rounded-none border border-slate-250 bg-transparent text-slate-800 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="dev-mode-checkbox" className="text-slate-500 uppercase tracking-wider cursor-pointer font-bold">
                        Developer Testing / Mock Verification Mode (Connect instantly)
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="w-full md:w-auto h-12 px-8 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white font-mono text-base tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-sm font-bold"
                    style={{ borderRadius: 10 }}
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        CONNECTING...
                      </>
                    ) : (
                      "Connect with Facebook"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
