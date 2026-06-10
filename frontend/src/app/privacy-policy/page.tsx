"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, Server } from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#02000f] text-white relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Background Glows */}
      <div className="absolute top-[10%] left-1/4 w-[500px] h-[500px] bg-purple-600/[0.01] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-36 pb-8 px-6 md:px-12 max-w-4xl mx-auto w-full text-center z-10">
        <div className="mb-4 inline-flex items-center gap-1.5 border border-purple-500/20 bg-purple-950/20 px-3 py-1" style={{ borderRadius: '9999px' }}>
          <Shield className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-300 uppercase font-bold">
            LEGAL COMPLIANCE
          </span>
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl tracking-wide uppercase text-white mt-2 mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="font-body-lg text-sm md:text-base text-text-secondary italic max-w-xl mx-auto leading-relaxed">
          Last Updated: June 7, 2026. Learn how we safeguard your business catalogs and WhatsApp chats.
        </p>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto w-full z-10 mb-24 font-body-md text-xs md:text-sm text-text-secondary space-y-8 leading-relaxed">
        
        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 border border-border-subtle bg-[#070518]/40 backdrop-blur-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Lock className="w-5 h-5 text-purple-400 mb-3" />
            <h3 className="font-display-lg text-xs uppercase tracking-wider text-white font-bold mb-2">Tenant Isolation</h3>
            <p className="text-[11px] text-text-secondary">
              Your uploaded catalogs, menus, and business databases are strictly partitioned using multi-tenant namespaces.
            </p>
          </div>
          <div className="p-5 border border-border-subtle bg-[#070518]/40 backdrop-blur-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Eye className="w-5 h-5 text-purple-400 mb-3" />
            <h3 className="font-display-lg text-xs uppercase tracking-wider text-white font-bold mb-2">Message Encryption</h3>
            <p className="text-[11px] text-text-secondary">
              Customer messages forwarded via WhatsApp Cloud API are processed on-the-fly and never sold to third parties.
            </p>
          </div>
          <div className="p-5 border border-border-subtle bg-[#070518]/40 backdrop-blur-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Server className="w-5 h-5 text-purple-400 mb-3" />
            <h3 className="font-display-lg text-xs uppercase tracking-wider text-white font-bold mb-2">Secure Storage</h3>
            <p className="text-[11px] text-text-secondary">
              Relational order details are stored in locally partitioned SQLite files, isolated per workspace environment.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="border border-border-subtle bg-[#070518]/30 p-8 md:p-10 space-y-8" style={{ borderRadius: 'var(--radius-xl)' }}>
          
          <div className="space-y-3">
            <h2 className="font-display-lg text-sm md:text-base uppercase tracking-widest text-white font-bold border-b border-border-subtle/50 pb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect information to initialize, operate, and maintain your AI assistant workspace:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Credentials:</strong> Admin email, business metadata, and hash passwords collected at registration.</li>
              <li><strong>Catalog Content:</strong> Documents, PDF catalogs, URLs, and pricing grids uploaded to train your agent.</li>
              <li><strong>Integration Keys:</strong> WhatsApp phone IDs and webhook verify tokens necessary to link Meta Cloud API.</li>
              <li><strong>Customer Conversations:</strong> Text bubbles, timestamp sequences, and order records processed by the RAG reasoning loop.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display-lg text-sm md:text-base uppercase tracking-widest text-white font-bold border-b border-border-subtle/50 pb-2">
              2. How We Use Data
            </h2>
            <p>
              The collected data is exclusively used to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Power the LangGraph cognitive loop to answer customer catalog questions.</li>
              <li>Parse uploaded documents, extract product metadata, and build search indexes.</li>
              <li>Process checkout commands and populate your relational order database.</li>
              <li>Send real-time updates and notification webhooks to Meta servers.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display-lg text-sm md:text-base uppercase tracking-widest text-white font-bold border-b border-border-subtle/50 pb-2">
              3. Data Boundaries & Security
            </h2>
            <p>
              We enforce enterprise-grade security protocols:
            </p>
            <p className="italic">
              Multi-tenant separation prevents cross-workspace leaks. If you use a cloud index, your embeddings are isolated under dedicated namespaces. Local SQLite files are partitioned per user session. All authentication tokens are stored securely in localStorage and verified via HMAC signatures on the FastAPI backend.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display-lg text-sm md:text-base uppercase tracking-widest text-white font-bold border-b border-border-subtle/50 pb-2">
              4. Your Choices & Data Deletion
            </h2>
            <p>
              As a workspace administrator, you have full control over your business intelligence:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You can delete uploaded documents or catalogs at any point from the admin console.</li>
              <li>You can request complete workspace termination, which wipes all user accounts, databases, and indexes.</li>
              <li>To initiate a request, please reach out to our privacy officer at <strong>privacy@anytimellm.com</strong>.</li>
            </ul>
          </div>

        </div>

      </section>

      <Footer />
    </div>
  );
}
