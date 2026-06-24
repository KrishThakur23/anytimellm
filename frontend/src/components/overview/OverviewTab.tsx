"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Business, CatalogItem, DocumentInfo, Order } from "@/lib/api";
import { 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  ShoppingBag, 
  ArrowRight,
  Bot,
  Zap
} from "lucide-react";

interface OverviewTabProps {
  activeBusiness: Business;
  documents: DocumentInfo[];
  catalog: CatalogItem[];
  orders: Order[];
  copied: boolean;
  copyToClipboard: (text: string) => void;
  onTabChange?: (tab: "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats") => void;
  onUpdateBusiness?: (updatedBiz: Business) => void;
  subscription?: any;
  stats?: {
    unread_conversations: number;
    pending_orders: number;
    failed_responses: number;
    followups_due: number;
    revenue_today: number;
    orders_count: number;
    chats_count: number;
    ai_resolution_rate: number;
  };
}

export default function OverviewTab({
  activeBusiness,
  catalog,
  orders,
  onTabChange,
  subscription,
  stats
}: OverviewTabProps) {

  // Needs Attention
  const hasUrgentIssues = (stats?.failed_responses ?? 0) > 0 || (stats?.pending_orders ?? 0) > 0 || (stats?.followups_due ?? 0) > 0;

  return (
    <div className="space-y-12 pb-12 max-w-5xl overflow-x-hidden font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Mission Control
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl">
            Your business pulse at a glance. Prioritize what needs your attention, review what happened, and take the next step.
          </p>
        </div>
      </div>

      {/* Payment Recovery Banner */}
      {subscription && (subscription.status === "past_due" || subscription.status === "pending_payment") && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Payment Action Required
            </h3>
            <p className="text-red-700 text-sm mt-1">
              Your latest payment has failed or is pending. Please update your payment method to avoid service interruption.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors">
              Retry Payment
            </button>
          </div>
        </div>
      )}

      {/* 1. What needs attention? (Highest Priority) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full ${hasUrgentIssues ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <h2 className="text-lg font-bold text-slate-900">What needs attention?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onTabChange?.('orders')}
            className="flex flex-col p-6 bg-white border border-slate-200 hover:border-amber-300 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-amber-600">{stats?.pending_orders ?? 0}</span>
            </div>
            <span className="font-bold text-slate-900">Pending Orders</span>
            <span className="text-sm text-slate-500 mt-1">Requires fulfillment</span>
          </button>

          <button 
            onClick={() => onTabChange?.('chats')}
            className="flex flex-col p-6 bg-white border border-slate-200 hover:border-red-300 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-red-600">{stats?.failed_responses ?? 0}</span>
            </div>
            <span className="font-bold text-slate-900">Failed AI Replies</span>
            <span className="text-sm text-slate-500 mt-1">Requires human intervention</span>
          </button>

          <button 
            onClick={() => onTabChange?.('chats')}
            className="flex flex-col p-6 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats?.followups_due ?? 0}</span>
            </div>
            <span className="font-bold text-slate-900">Follow-ups Due</span>
            <span className="text-sm text-slate-500 mt-1">Customers waiting for reply</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 2. What happened? */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-slate-900">What happened today?</h2>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            {/* Primary Metric: Revenue */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Revenue Generated</p>
                  <p className="font-display text-3xl font-bold text-slate-900 mt-1">
                    ₹{(stats?.revenue_today ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-semibold">Orders Automated</span>
                </div>
                <p className="font-display text-2xl font-bold text-slate-900">{stats?.orders_count ?? orders.length}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-semibold">Chats Resolved</span>
                </div>
                <p className="font-display text-2xl font-bold text-slate-900">{stats?.chats_count ?? 0}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI Resolution</span>
                </div>
                <p className="font-display text-2xl font-bold text-slate-900">{stats?.ai_resolution_rate ?? 100}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. What should I do next? */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-slate-900">What should I do next?</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {catalog.length === 0 ? (
              <button 
                onClick={() => onTabChange?.("catalog")}
                className="group flex items-center justify-between p-6 bg-primary text-white rounded-2xl shadow-md hover:bg-primary-hover transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Upload Your Catalog</h3>
                    <p className="text-primary-muted text-white/70 text-sm mt-1">Start answering questions automatically.</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : null}

            <button 
              onClick={() => onTabChange?.("catalog")}
              className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Add New Product</h3>
                  <p className="text-slate-500 text-sm mt-1">Keep your AI up to date.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => onTabChange?.("playground")}
              className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Test AI Assistant</h3>
                  <p className="text-slate-500 text-sm mt-1">Verify responses to complex questions.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>

    </div>
  );
}
