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
    <div className="space-y-8" ref={containerRef}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-display-lg text-4xl tracking-[0.08em] uppercase text-white">Client Order Inbox</h1>
          <p className="font-body-md text-sm text-muted mt-1 italic max-w-2xl">
            View and manage orders placed by your customers via WhatsApp or the web playground. Confirm orders to record sales or cancel them if needed.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono rounded-none border border-border-subtle bg-surface-1 text-white hover:bg-white hover:text-black transition-all duration-200 cursor-pointer disabled:opacity-50"
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
        <div className="p-4 rounded-none bg-surface-1 border border-border-subtle flex items-center gap-3">
          <div className="p-2 border border-border-subtle text-white bg-surface-2 rounded-none">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted">Total Orders</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalCount}</div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="p-4 rounded-none bg-surface-1 border border-border-subtle flex items-center gap-3">
          <div className="p-2 border border-border-subtle text-amber-400 bg-surface-2 rounded-none relative">
            <AlertCircle className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 animate-ping rounded-none" />
            )}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted">Pending</div>
            <div className="text-xl font-bold text-white mt-0.5">{pendingCount}</div>
          </div>
        </div>

        {/* Confirmed Card */}
        <div className="p-4 rounded-none bg-surface-1 border border-border-subtle flex items-center gap-3">
          <div className="p-2 border border-border-subtle text-emerald-400 bg-surface-2 rounded-none">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted">Confirmed</div>
            <div className="text-xl font-bold text-white mt-0.5">{confirmedCount}</div>
          </div>
        </div>

        {/* Cancelled Card */}
        <div className="p-4 rounded-none bg-surface-1 border border-border-subtle flex items-center gap-3">
          <div className="p-2 border border-border-subtle text-red-400 bg-surface-2 rounded-none">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted">Cancelled</div>
            <div className="text-xl font-bold text-white mt-0.5">{cancelledCount}</div>
          </div>
        </div>
      </div>

      {/* Orders List / Content */}
      {orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border-subtle rounded-none bg-surface-1 font-mono">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted mb-3" />
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">No orders recorded yet</h3>
          <p className="text-xs text-muted mt-1.5 max-w-sm mx-auto italic font-body-md">
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
                className="order-card p-5 rounded-none bg-surface-1 border border-border-subtle hover:border-white transition-all duration-300 relative overflow-hidden font-mono"
              >
                {/* Visual Accent Bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1 transition-colors duration-300 ${
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
                      <span className="font-bold text-white text-xs tracking-tight">
                        👤 {order.customer_name || "Guest Client"}
                      </span>
                      <span className="text-[10px] text-muted bg-surface-2 border border-border-subtle rounded-none px-1.5 py-0.5">
                        📞 {order.customer_phone || "No Phone"}
                      </span>
                    </div>

                    <div className="text-[9px] font-semibold text-muted uppercase tracking-wider mt-1.5">
                      Received: {new Date(order.created_at).toLocaleString()}
                    </div>

                    {/* Order Details List */}
                    <div className="mt-4 pt-3 border-t border-border-subtle">
                      <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Ordered Items:</h4>
                      <ul className="mt-2 space-y-1.5 pl-1.5">
                        {order.details?.items?.map((item, idx) => (
                          <li key={idx} className="text-xs text-white flex items-center justify-between max-w-md">
                            <span>🛍️ {item.name}</span>
                            <span className="text-muted">Qty: {item.quantity}</span>
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
                        className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-none border flex items-center gap-1.5 select-none ${
                          order.status === "confirmed"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : order.status === "cancelled"
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {order.status === "pending" && (
                          <span className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
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
                          className="flex items-center gap-1 px-3 py-1.5 rounded-none text-[10px] font-bold border border-white bg-transparent hover:bg-white hover:text-black text-white active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          Confirm
                        </button>
                      )}

                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "cancelled")}
                          disabled={isUpdating || loading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-none text-[10px] font-bold border border-red-900 bg-transparent hover:bg-red-900 hover:text-white text-red-400 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          Cancel
                        </button>
                      )}

                      {(order.status === "confirmed" || order.status === "cancelled") && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "pending")}
                          disabled={isUpdating || loading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-none text-[10px] font-bold border border-border-subtle bg-transparent hover:bg-white hover:text-black text-white active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          Reset to Pending
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
