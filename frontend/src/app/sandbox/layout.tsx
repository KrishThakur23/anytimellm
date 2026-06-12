import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Sandbox Warning Banner */}
      <div className="bg-violet-600 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium z-50 sticky top-0">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        This is a live sandbox with sample data.
        <Link href="/register" className="underline font-bold ml-2 hover:text-violet-200 transition-colors">
          Connect your WhatsApp to use real data &rarr;
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Simple Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <Link href="/" className="text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-extrabold text-lg tracking-tight">AnytimeLLM</span>
          </div>

          <div className="flex-1 py-4 flex flex-col gap-1 px-3">
            {[
              { id: "overview", label: "Overview", active: true },
              { id: "orders", label: "Orders", active: false },
              { id: "chat", label: "Live Chats", active: false },
              { id: "catalog", label: "Catalog", active: false },
              { id: "settings", label: "Settings", active: false },
            ].map((item) => (
              <div
                key={item.id}
                className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                  item.active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                JD
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">John Doe</div>
                <div className="text-[10px] text-slate-500">Demo User</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
