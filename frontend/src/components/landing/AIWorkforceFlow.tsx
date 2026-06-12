"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  Position,
  type NodeProps,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, useInView } from "framer-motion";

/* ────────────────────────────────────────────────────────────────
   Custom Node Components
   ──────────────────────────────────────────────────────────────── */

function CustomerNode({ data }: NodeProps) {
  return (
    <div className="px-5 py-3 bg-white border-2 border-slate-200 shadow-md flex items-center gap-3" style={{ borderRadius: 14 }}>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm">👤</div>
      <div>
        <div className="text-[11px] font-semibold text-slate-800 tracking-wide">{data.label as string}</div>
        <div className="text-[9px] text-slate-400">WhatsApp / Web</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#F0F2F5]0 !w-2 !h-2 !border-0" />
    </div>
  );
}

function ChannelNode({ data }: NodeProps) {
  return (
    <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-emerald-200 shadow-sm flex items-center gap-3" style={{ borderRadius: 14 }}>
      <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-2 !h-2 !border-0" />
      <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg">💬</div>
      <div>
        <div className="text-[11px] font-semibold text-emerald-800 tracking-wide">{data.label as string}</div>
        <div className="text-[9px] text-emerald-500">Incoming Messages</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-2 !h-2 !border-0" />
    </div>
  );
}

function BrainNode({ data }: NodeProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-br from-[#128C7E] to-[#25D366] border-2 border-violet-400 shadow-lg shadow-violet-200/40 flex items-center gap-3" style={{ borderRadius: 16 }}>
      <Handle type="target" position={Position.Top} className="!bg-white !w-2.5 !h-2.5 !border-0" />
      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">🧠</div>
      <div>
        <div className="text-[12px] font-bold text-white tracking-wide">{data.label as string}</div>
        <div className="text-[9px] text-violet-200">LangGraph + Gemini</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white !w-2.5 !h-2.5 !border-0" />
    </div>
  );
}

function AgentNode({ data }: NodeProps) {
  const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    knowledge: { bg: "from-blue-50 to-indigo-50", border: "border-blue-200", text: "text-blue-800", icon: "📚" },
    sales: { bg: "from-violet-50 to-purple-50", border: "border-[#DCF8C6]", text: "text-violet-800", icon: "💰" },
    order: { bg: "from-amber-50 to-orange-50", border: "border-amber-200", text: "text-amber-800", icon: "📦" },
    support: { bg: "from-cyan-50 to-teal-50", border: "border-cyan-200", text: "text-cyan-800", icon: "🛟" },
  };
  const c = colors[(data.agentType as string) || "knowledge"];
  return (
    <div className={`px-4 py-3 bg-gradient-to-r ${c.bg} border-2 ${c.border} shadow-sm flex items-center gap-2.5`} style={{ borderRadius: 12 }}>
      <Handle type="target" position={Position.Top} className="!bg-violet-400 !w-2 !h-2 !border-0" />
      <span className="text-lg">{c.icon}</span>
      <div>
        <div className={`text-sm font-semibold ${c.text} tracking-wide`}>{data.label as string}</div>
        <div className="text-[8px] text-slate-400">{data.subtitle as string}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !border-0" />
    </div>
  );
}

function DataNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-2" style={{ borderRadius: 10 }}>
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-1.5 !h-1.5 !border-0" />
      <span className="text-sm">{data.icon as string}</span>
      <span className="text-sm font-medium text-slate-600">{data.label as string}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-1.5 !h-1.5 !border-0" />
    </div>
  );
}

function RevenueNode({ data }: NodeProps) {
  return (
    <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 border-2 border-emerald-400 shadow-lg shadow-emerald-200/40 flex items-center gap-2.5" style={{ borderRadius: 14 }}>
      <Handle type="target" position={Position.Top} className="!bg-white !w-2 !h-2 !border-0" />
      <span className="text-xl">📈</span>
      <div className="text-[12px] font-bold text-white tracking-wide">{data.label as string}</div>
    </div>
  );
}

const nodeTypes = {
  customer: CustomerNode,
  channel: ChannelNode,
  brain: BrainNode,
  agent: AgentNode,
  dataStore: DataNode,
  revenue: RevenueNode,
};

/* ────────────────────────────────────────────────────────────────
   Node & Edge Definitions
   ──────────────────────────────────────────────────────────────── */

const nodes: Node[] = [
  { id: "customer", type: "customer", position: { x: 300, y: 0 }, data: { label: "Customer" } },
  { id: "channel", type: "channel", position: { x: 290, y: 100 }, data: { label: "WhatsApp / Web" } },
  { id: "brain", type: "brain", position: { x: 280, y: 220 }, data: { label: "The Business Brain" } },

  { id: "knowledge", type: "agent", position: { x: 30, y: 370 }, data: { label: "Customer Questions", subtitle: "AI Answers Automatically", agentType: "knowledge" } },
  { id: "sales", type: "agent", position: { x: 230, y: 370 }, data: { label: "Product Search", subtitle: "AI Finds Products", agentType: "sales" } },
  { id: "order", type: "agent", position: { x: 430, y: 370 }, data: { label: "Orders", subtitle: "AI Creates Orders", agentType: "order" } },
  { id: "support", type: "agent", position: { x: 630, y: 370 }, data: { label: "Follow Ups", subtitle: "AI Sends Messages", agentType: "support" } },

  { id: "docs", type: "dataStore", position: { x: 60, y: 490 }, data: { label: "Documents", icon: "📄" } },
  { id: "catalog", type: "dataStore", position: { x: 270, y: 490 }, data: { label: "Catalog", icon: "🏷️" } },
  { id: "orders", type: "dataStore", position: { x: 470, y: 490 }, data: { label: "Transactions", icon: "📋" } },

  { id: "revenue", type: "revenue", position: { x: 280, y: 590 }, data: { label: "Revenue Generated" } },
];

const edges: Edge[] = [
  { id: "e1", source: "customer", target: "channel", animated: true, style: { stroke: "#10B981", strokeWidth: 2 } },
  { id: "e2", source: "channel", target: "brain", animated: true, style: { stroke: "#7C3AED", strokeWidth: 2 } },

  { id: "e3", source: "brain", target: "knowledge", animated: true, style: { stroke: "#3B82F6", strokeWidth: 1.5 } },
  { id: "e4", source: "brain", target: "sales", animated: true, style: { stroke: "#7C3AED", strokeWidth: 1.5 } },
  { id: "e5", source: "brain", target: "order", animated: true, style: { stroke: "#F59E0B", strokeWidth: 1.5 } },
  { id: "e6", source: "brain", target: "support", animated: true, style: { stroke: "#06B6D4", strokeWidth: 1.5 } },

  { id: "e7", source: "knowledge", target: "docs", style: { stroke: "#CBD5E1", strokeWidth: 1 } },
  { id: "e8", source: "sales", target: "catalog", style: { stroke: "#CBD5E1", strokeWidth: 1 } },
  { id: "e9", source: "order", target: "orders", style: { stroke: "#CBD5E1", strokeWidth: 1 } },

  { id: "e10", source: "docs", target: "revenue", style: { stroke: "#10B981", strokeWidth: 1, strokeDasharray: "5 5" } },
  { id: "e11", source: "catalog", target: "revenue", style: { stroke: "#10B981", strokeWidth: 1, strokeDasharray: "5 5" } },
  { id: "e12", source: "orders", target: "revenue", style: { stroke: "#10B981", strokeWidth: 1, strokeDasharray: "5 5" } },
];

/* ────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────── */

export default function AIWorkforceFlow() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[#F0F2F5] border border-[#DCF8C6] text-[#128C7E] text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
          The Signature Moment
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your business brain, working <span className="text-gradient-hero">together</span>
        </h2>
        <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
          Every customer message flows through an intelligent system that routes to specialized actions — answering questions, finding products, and closing orders automatically.
        </p>
      </div>

      {/* React Flow Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white border border-slate-200 shadow-lg overflow-hidden relative"
        style={{ height: 680, borderRadius: 20 }}
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} size={1} color="rgba(0,0,0,0.03)" />
        </ReactFlow>
      </motion.div>
    </section>
  );
}
