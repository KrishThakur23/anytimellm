"use client";

import React, { useMemo } from "react";
import { 
  LineChart, 
  TrendingUp, 
  Bot, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users
} from "lucide-react";
import type { Order, Conversation, CatalogItem } from "@/lib/api";

interface AnalyticsTabProps {
  orders: Order[];
  chats: Conversation[];
  catalog: CatalogItem[];
}

export default function AnalyticsTab({ orders, chats, catalog }: AnalyticsTabProps) {
  const stats = useMemo(() => {
    // Orders & Revenue
    const completedOrders = orders.filter(o => o.status !== "cancelled");
    const totalRevenue = completedOrders.reduce((sum, order) => {
      const orderTotal = order.details.items.reduce((itemSum, item) => itemSum + ((item.price || 0) * item.quantity), 0);
      return sum + orderTotal;
    }, 0);

    // AI Resolution
    const totalChats = chats.length;
    const resolvedChats = chats.filter(c => c.status === "resolved");
    const aiResolved = resolvedChats.filter(c => !c.is_ai_paused).length;
    const aiResolutionRate = resolvedChats.length > 0 
      ? Math.round((aiResolved / resolvedChats.length) * 100) 
      : 0;

    // Top Items
    const itemCounts: Record<string, { name: string; revenue: number; quantity: number }> = {};
    completedOrders.forEach(order => {
      order.details.items.forEach(item => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { name: item.name, revenue: 0, quantity: 0 };
        }
        itemCounts[item.name].quantity += item.quantity;
        itemCounts[item.name].revenue += (item.price || 0) * item.quantity;
      });
    });

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      revenue: totalRevenue,
      orderCount: completedOrders.length,
      aiResolutionRate,
      topItems,
      totalChats
    };
  }, [orders, chats]);

  return (
    <div className="space-y-6 text-left pb-12">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <LineChart className="w-6 h-6 text-emerald-600" />
          Analytics & Performance
        </h1>
        <p className="font-body text-sm text-slate-500 mt-1 max-w-2xl">
          Track your revenue, popular products, and how well your Business Brain is handling customer conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Volume */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sales Volume</p>
              <h3 className="text-3xl font-display font-bold text-slate-900">
                ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 w-max px-2 py-1 rounded-md">
            <TrendingUp className="w-4 h-4 mr-1" />
            +14.2% from last week
          </div>
        </div>

        {/* AI Resolution Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">AI Resolution Rate</p>
              <h3 className="text-3xl font-display font-bold text-slate-900">
                {stats.aiResolutionRate}%
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-purple-600 bg-purple-50 w-max px-2 py-1 rounded-md">
            <Activity className="w-4 h-4 mr-1" />
            Based on {stats.totalChats} total chats
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Completed Orders</p>
              <h3 className="text-3xl font-display font-bold text-slate-900">
                {stats.orderCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-blue-600 bg-blue-50 w-max px-2 py-1 rounded-md">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +8.5% from last week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-[#F8FAFC]">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Top Performing Items
            </h2>
          </div>
          <div className="p-0 overflow-x-auto">
            {stats.topItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                <ShoppingBag className="w-8 h-8 text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-500">No items sold yet</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Item Name</th>
                    <th className="py-3 px-5 text-right">Qty Sold</th>
                    <th className="py-3 px-5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.topItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 font-semibold text-slate-800 text-sm">
                        {item.name}
                      </td>
                      <td className="py-3 px-5 text-right text-slate-600 text-sm font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-5 text-right text-emerald-600 text-sm font-bold">
                        ${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* AI Performance Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-[#F8FAFC]">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-500" />
              AI Performance
            </h2>
          </div>
          <div className="p-6 flex flex-col justify-center h-full">
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">Autonomous Responses</span>
                    <span className="text-purple-600">{stats.aiResolutionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full transition-all" 
                      style={{ width: `${stats.aiResolutionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Conversations fully resolved without human intervention.</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">Human Handoffs</span>
                    <span className="text-amber-600">{100 - stats.aiResolutionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full transition-all" 
                      style={{ width: `${100 - stats.aiResolutionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Conversations requiring a human agent to pause AI and step in.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
