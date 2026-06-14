"use client";

import React, { useState } from "react";
import { Loader2, RefreshCw, ShoppingBag, MoreHorizontal, Check, X, Clock, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Compute stats
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const confirmedCount = orders.filter(o => o.status === "confirmed").length;
  const cancelledCount = orders.filter(o => o.status === "cancelled").length;

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const calculateTotal = (order: Order) => {
    if (!order.details?.items) return 0;
    return order.details.items.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);
  };

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + calculateTotal(o), 0);

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-2">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="font-body text-sm text-slate-500 mt-1 max-w-2xl">
            Manage your AI-generated sales and track revenue in real-time.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Orders Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalCount}</div>
        </div>

        {/* Revenue Card */}
        <div className="p-5 rounded-xl bg-white border border-emerald-200 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full opacity-50 pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Net Revenue</div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-700 relative z-10">
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>

        {/* Pending Card */}
        <div className="p-5 rounded-xl bg-white border border-amber-200 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Requires Action</div>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-700">{pendingCount}</div>
        </div>

        {/* Confirmed Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Fulfilled</div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{confirmedCount}</div>
        </div>
      </div>

      {/* Orders List / Content */}
      {orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 bg-white rounded-xl shadow-sm">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700 text-sm">No orders yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            When your AI agent completes a sale, it will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8FAFC]">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[120px]">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[180px]">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-[120px]">Total</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-[140px]">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-[80px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const isUpdating = updatingOrderId === order.id;
                  const isMenuOpen = openMenuId === order.id;
                  const orderTotal = calculateTotal(order);

                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">
                          #{order.id.slice(0, 6).toUpperCase()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-500">
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">
                            {order.customer_name || "Guest User"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {order.customer_phone || "No Phone"}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 max-w-[250px] truncate">
                          {order.details?.items?.map(i => `${i.quantity}x ${i.name}`).join(", ") || "No items"}
                        </div>
                        <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3" />
                          AI Generated
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-slate-900">
                          ₹{orderTotal > 0 ? orderTotal.toLocaleString() : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.status === 'confirmed' ? 'bg-emerald-500' :
                            order.status === 'cancelled' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`} />
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right relative">
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-400 inline-block" />
                        ) : (
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => toggleMenu(order.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>

                            <AnimatePresence>
                              {isMenuOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-8 top-0 mt-2 w-48 rounded-xl shadow-lg bg-white border border-slate-200 z-50 overflow-hidden"
                                  >
                                    <div className="py-1">
                                      {order.status !== "confirmed" && (
                                        <button
                                          onClick={() => {
                                            onUpdateStatus(order.id, "confirmed");
                                            setOpenMenuId(null);
                                          }}
                                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                          <Check className="w-4 h-4" />
                                          Mark Confirmed
                                        </button>
                                      )}
                                      {order.status !== "cancelled" && (
                                        <button
                                          onClick={() => {
                                            onUpdateStatus(order.id, "cancelled");
                                            setOpenMenuId(null);
                                          }}
                                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                          Mark Cancelled
                                        </button>
                                      )}
                                      {(order.status === "confirmed" || order.status === "cancelled") && (
                                        <button
                                          onClick={() => {
                                            onUpdateStatus(order.id, "pending");
                                            setOpenMenuId(null);
                                          }}
                                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                                        >
                                          <AlertCircle className="w-4 h-4" />
                                          Mark Pending
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
