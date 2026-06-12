"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { ShoppingBag, Utensils, Truck, Star } from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function UseCasesPage() {
  const cases = [
    {
      title: "D2C & E-Commerce",
      icon: <ShoppingBag className="w-5 h-5 text-rose-600" />,
      iconBg: "bg-rose-50 border-rose-100",
      tagline: "Increase Sales & Reduce Cart Abandonment",
      description: "Let customers browse your catalog, search for specific variants, calculate delivery fees, and create instant shopping checkouts right inside WhatsApp without leaving the app.",
      bullets: [
        "Semantic Catalog Search: Customer asks for 'red silk dress M size'",
        "Real-time Order Tracking: Automatic status lookups on request",
        "Hassle-free Returns: Guided bot workflows to initiate refund/return requests"
      ],
      whatsappMock: {
        chatName: "Trendify Boutique",
        customerText: "Do you have the Floral Summer dress in Blue?",
        agentResponse: "Yes! We have 4 left in stock. Price is ₹1,499. Here is the link to purchase: trends.anyt/buy/floral-blue 🌸"
      },
      gradient: "from-rose-50/50 via-white to-white hover:border-rose-200"
    },
    {
      title: "Restaurants & Food",
      icon: <Utensils className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-100",
      tagline: "Automate Orders & Dining Bookings",
      description: "Never lose an order due to a busy phone line or delayed text reply. Your AI assistant displays menus, registers delivery orders, and reserves seating coordinates instantly.",
      bullets: [
        "Menu Q&A: Answers questions about ingredients, vegetarian options, allergens",
        "Table Bookings: Registers guest counts and reservation hours",
        "Delivery Status: Real-time order dispatch notifications"
      ],
      whatsappMock: {
        chatName: "Zaika Kitchen",
        customerText: "Is the Paneer Tikka gluten-free? Also, book a table for 4 at 8 PM.",
        agentResponse: "Our Paneer Tikka is 100% gluten-free! 🧀 I have also reserved Table #4 for 4 guests tonight at 8:00 PM. See you soon!"
      },
      gradient: "from-amber-50/50 via-white to-white hover:border-amber-200"
    },
    {
      title: "Distributors & B2B",
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      tagline: "Streamline Supply Chains & Bulk Reorders",
      description: "Allow retailers, stockists, and wholesale partners to check live inventories, access custom pricing grids, and submit bulk purchase sheets 24 hours a day.",
      bullets: [
        "Product Availability: Instant lookups across multiple warehouse locations",
        "Tiered Pricing: Displays negotiated trade discount lists on auth validation",
        "Quick Reorder: Single-tap commands to duplicate previous weekly orders"
      ],
      whatsappMock: {
        chatName: "Vardhman Wholesale",
        customerText: "Check stock for 50 boxes of Grade-A paper and reorder my last shipment.",
        agentResponse: "We have 120 boxes available at Warehouse-A. I have queued your reorder for 50 boxes at your contract price of ₹12,500. Reply YES to confirm delivery."
      },
      gradient: "from-emerald-50/50 via-white to-white hover:border-emerald-200"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <section className="relative pt-36 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full text-center z-10">
        <div className="mb-4 inline-flex items-center gap-1.5 border border-purple-100 bg-purple-50 px-3 py-1" style={{ borderRadius: '9999px' }}>
          <Star className="w-3.5 h-3.5 text-purple-600 animate-pulse fill-current" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-600 uppercase font-bold">
            INDUSTRY SOLUTIONS
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-slate-900 mt-2 mb-4 leading-tight font-extrabold">
          Tailored For Your Business Vertical
        </h1>
        <p className="font-body text-base md:text-lg text-slate-500 italic max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover how pilot businesses automate conversation cycles and secure checkout points on WhatsApp.
        </p>
      </section>

      {/* Use Cases Cards Grid */}
      <section className="py-8 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
        {cases.map((c, idx) => (
          <div
            key={idx}
            className={`border border-slate-250 flex flex-col justify-between p-8 relative transition-all duration-500 hover:scale-[1.01] hover:shadow-lg rounded-3xl bg-gradient-to-br ${c.gradient}`}
          >
            <div>
              {/* Header Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 border flex items-center justify-center rounded-xl ${c.iconBg}`}>
                  {c.icon}
                </div>
                <h2 className="font-display text-xl tracking-tight uppercase text-slate-900 font-extrabold">
                  {c.title}
                </h2>
              </div>

              {/* Tagline */}
              <span className="font-mono text-[8px] tracking-[0.2em] text-purple-600 uppercase block mb-3 font-bold">
                {c.tagline}
              </span>
              
              <p className="font-body text-xs text-slate-500 leading-relaxed mb-6">
                {c.description}
              </p>

              {/* Bullet points */}
              <ul className="space-y-3 mb-8 border-t border-slate-200/60 pt-5">
                {c.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="font-body text-xs text-slate-600 leading-normal flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 shrink-0 mt-1.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp Mock Simulator */}
            <div className="border border-slate-800 bg-[#0b141a] p-4 font-sans text-xs select-none shadow-inner rounded-2xl">
              
              {/* Mock Chat Header */}
              <div className="border-b border-white/5 pb-2 mb-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00a884] animate-pulse" />
                <span className="font-bold text-[10px] text-white/90 uppercase tracking-wide">
                  {c.whatsappMock.chatName}
                </span>
                <span className="font-mono text-[8px] text-white/30 ml-auto">WhatsApp Web</span>
              </div>

              {/* Chat messages layout */}
              <div className="space-y-3 leading-normal text-left">
                {/* Customer bubble */}
                <div className="bg-[#202c33] text-white/90 p-2.5 max-w-[85%] border border-white/5 shadow-sm rounded-r-xl rounded-bl-xl">
                  <p className="text-[10px] leading-relaxed">{c.whatsappMock.customerText}</p>
                </div>

                {/* Agent bubble (Greenish background matching WhatsApp standard) */}
                <div className="bg-[#005c4b] text-white p-2.5 max-w-[85%] ml-auto border border-white/5 shadow-sm rounded-l-xl rounded-br-xl">
                  <p className="text-[10px] leading-relaxed">{c.whatsappMock.agentResponse}</p>
                </div>
              </div>

            </div>

          </div>
        ))}
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
