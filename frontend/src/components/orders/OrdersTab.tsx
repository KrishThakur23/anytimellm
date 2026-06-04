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
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-text">🛒 Client Order Inbox</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-semibold max-w-2xl">
            View and manage orders placed by your customers via WhatsApp or the web playground. Confirm orders to record sales or cancel them if needed.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-lg border border-border-subtle bg-parchment-surface dark:bg-surface-container text-ink-text hover:bg-oatmeal-bg dark:hover:bg-surface-2 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          🔁 Refresh Orders (ताज़ा करें)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="p-4 rounded-2xl bg-parchment-surface dark:bg-surface-container border border-border-subtle shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">Total Orders</div>
            <div className="text-2xl font-black text-ink-text mt-0.5">{totalCount}</div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="p-4 rounded-2xl bg-parchment-surface dark:bg-surface-container border border-border-subtle shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl relative">
            <AlertCircle className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">Pending (पेंडिंग)</div>
            <div className="text-2xl font-black text-ink-text mt-0.5">{pendingCount}</div>
          </div>
        </div>

        {/* Confirmed Card */}
        <div className="p-4 rounded-2xl bg-parchment-surface dark:bg-surface-container border border-border-subtle shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">Confirmed (पुष्टि)</div>
            <div className="text-2xl font-black text-ink-text mt-0.5">{confirmedCount}</div>
          </div>
        </div>

        {/* Cancelled Card */}
        <div className="p-4 rounded-2xl bg-parchment-surface dark:bg-surface-container border border-border-subtle shadow-sm flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">Cancelled (रद्द)</div>
            <div className="text-2xl font-black text-ink-text mt-0.5">{cancelledCount}</div>
          </div>
        </div>
      </div>

      {/* Orders List / Content */}
      {orders.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border-subtle rounded-2xl bg-parchment-surface dark:bg-surface-container/50">
          <ShoppingBag className="w-12 h-12 mx-auto text-outline animate-bounce mb-3" style={{ animationDuration: '4s' }} />
          <h3 className="font-extrabold text-ink-text text-sm">No orders recorded yet</h3>
          <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto font-semibold">
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
                className="order-card p-5 rounded-2xl bg-parchment-surface dark:bg-surface-container border border-border-subtle hover:border-outline/40 dark:hover:border-border-subtle shadow-sm hover:shadow transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Accent Bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1.5 transition-colors duration-300 ${
                    order.status === "confirmed"
                      ? "bg-emerald-500"
                      : order.status === "cancelled"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-start gap-4 pl-3">
                  {/* Client Info & Time */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-ink-text text-xs tracking-tight">
                        👤 {order.customer_name || "Guest Client"}
                      </span>
                      <span className="text-[10px] font-mono text-outline font-black bg-surface-container-low dark:bg-surface-2 border border-border-subtle rounded-md px-1.5 py-0.5">
                        📞 {order.customer_phone || "No Phone"}
                      </span>
                    </div>

                    <div className="text-[9px] font-semibold text-outline uppercase tracking-wider mt-1.5">
                      📅 Received: {new Date(order.created_at).toLocaleString()}
                    </div>

                    {/* Order Details List */}
                    <div className="mt-4 pt-3 border-t border-border-subtle/60">
                      <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Ordered Items:</h4>
                      <ul className="mt-2 space-y-1.5 pl-1.5">
                        {order.details?.items?.map((item, idx) => (
                          <li key={idx} className="text-xs text-ink-text font-bold flex items-center justify-between max-w-md">
                            <span>🛍️ {item.name}</span>
                            <span className="text-outline font-mono">Qty: {item.quantity}</span>
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
                        className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5 select-none ${
                          order.status === "confirmed"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            : order.status === "cancelled"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {order.status === "pending" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
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
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
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
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black border border-border-subtle bg-surface-container dark:bg-surface-2 hover:bg-oatmeal-bg dark:hover:bg-surface-container text-ink-text active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
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
