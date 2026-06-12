"use client";

import React, { useRef, useEffect } from "react";
import { Loader2, RefreshCw, ShoppingBag, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import gsap from "gsap";
import type { Order } from "@/lib/api";

interface OrdersTabProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateStatus: (orderId: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  updatingOrderId: string | null;
}

export default function OrdersTab({
  orders,
  loading,
  onRefresh,
  onUpdateStatus,
  updatingOrderId,
}: OrdersTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".order-card");
      gsap.fromTo(
        items,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [orders]);

  // Compute stats
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const confirmedCount = orders.filter(o => o.status === "confirmed").length;
  const cancelledCount = orders.filter(o => o.status === "cancelled").length;

  return (
    <div className="space-y-8 text-left" ref={containerRef}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Client Order Inbox</h1>
          <p className="font-body text-sm text-slate-500 mt-1 max-w-2xl">
            View and manage orders placed by your customers via WhatsApp or the web playground. Confirm orders to record sales or cancel them if needed.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 text-base font-mono rounded-none border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer disabled:opacity-50 font-bold shadow-xs"
          style={{ borderRadius: 8 }}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Refresh Orders
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        {/* Total Card */}
        <div className="p-4 rounded-none bg-white border border-slate-200 flex items-center gap-3 shadow-xs" style={{ borderRadius: 12 }}>
          <div className="p-2 border border-slate-100 text-slate-600 bg-slate-50 flex items-center justify-center" style={{ borderRadius: 8 }}>
            <ShoppingBag className="w-4 h-4 text-[#128C7E]" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total Orders</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{totalCount}</div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="p-4 rounded-none bg-white border border-slate-200 flex items-center gap-3 shadow-xs" style={{ borderRadius: 12 }}>
          <div className="p-2 border border-slate-100 text-amber-500 bg-slate-50 flex items-center justify-center relative" style={{ borderRadius: 8 }}>
            <AlertCircle className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 animate-ping rounded-full" />
            )}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pending</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{pendingCount}</div>
          </div>
        </div>

        {/* Confirmed Card */}
        <div className="p-4 rounded-none bg-white border border-slate-200 flex items-center gap-3 shadow-xs" style={{ borderRadius: 12 }}>
          <div className="p-2 border border-slate-100 text-emerald-500 bg-slate-50 flex items-center justify-center" style={{ borderRadius: 8 }}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Confirmed</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{confirmedCount}</div>
          </div>
        </div>

        {/* Cancelled Card */}
        <div className="p-4 rounded-none bg-white border border-slate-200 flex items-center gap-3 shadow-xs" style={{ borderRadius: 12 }}>
          <div className="p-2 border border-slate-100 text-red-500 bg-slate-50 flex items-center justify-center" style={{ borderRadius: 8 }}>
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Cancelled</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{cancelledCount}</div>
          </div>
        </div>
      </div>

      {/* Orders List / Content */}
      {orders.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 bg-white font-mono shadow-xs" style={{ borderRadius: 16 }}>
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-700 text-base uppercase tracking-wider">No orders recorded yet</h3>
          <p className="text-base text-slate-400 mt-1.5 max-w-sm mx-auto italic font-body">
            Ask the AI Assistant in the **"Test Chatbot"** tab or via **WhatsApp** to place an order (e.g. *"place an order for gold ring"*) to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isUpdating = updatingOrderId === order.id;

            return (
              <div
                key={order.id}
                className="order-card p-5 rounded-none bg-white border border-slate-200 hover:border-slate-350 transition-all duration-300 relative overflow-hidden font-mono shadow-xs"
                style={{ borderRadius: 16 }}
              >
                {/* Visual Accent Bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1.5 transition-colors duration-300 ${
                    order.status === "confirmed"
                      ? "bg-emerald-500"
                      : order.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-start gap-4 pl-3">
                  {/* Client Info & Time */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800 text-base tracking-tight">
                        👤 {order.customer_name || "Guest Client"}
                      </span>
                      <span className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-none px-1.5 py-0.5" style={{ borderRadius: 6 }}>
                        📞 {order.customer_phone || "No Phone"}
                      </span>
                    </div>

                    <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                      Received: {new Date(order.created_at).toLocaleString()}
                    </div>

                    {/* Order Details List */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ordered Items:</h4>
                      <ul className="mt-2 space-y-1.5 pl-1.5">
                        {order.details?.items?.map((item, idx) => (
                          <li key={idx} className="text-base text-slate-700 flex items-center justify-between max-w-md">
                            <span>🛍️ {item.name}</span>
                            <span className="text-slate-400 font-bold">Qty: {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2.5 py-1 border flex items-center gap-1.5 select-none font-bold ${
                          order.status === "confirmed"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : order.status === "cancelled"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-amber-50 border-amber-250/60 text-amber-700"
                        }`}
                        style={{ borderRadius: 6 }}
                      >
                        {order.status === "pending" && (
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        )}
                        {order.status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === "cancelled" && <XCircle className="w-3 h-3" />}
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {order.status !== "confirmed" && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "confirmed")}
                          disabled={isUpdating || loading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-none text-sm font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                          style={{ borderRadius: 6 }}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          )}
                          Confirm
                        </button>
                      )}

                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "cancelled")}
                          disabled={isUpdating || loading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-none text-sm font-bold border border-red-200 bg-white hover:bg-red-50 text-red-650 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                          style={{ borderRadius: 6 }}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          Cancel
                        </button>
                      )}

                      {(order.status === "confirmed" || order.status === "cancelled") && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "pending")}
                          disabled={isUpdating || loading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-none text-sm font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                          style={{ borderRadius: 6 }}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#128C7E]" />
                          )}
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
