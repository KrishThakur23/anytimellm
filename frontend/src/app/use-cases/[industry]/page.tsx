import React from "react";
import { notFound } from "next/navigation";
import { getIndustry, industries } from "@/data/industries";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBannerV2 from "@/components/landing/CtaBannerV2";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export async function generateStaticParams() {
  return industries.map((industry) => ({
    industry: industry.id,
  }));
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const data = getIndustry(params.industry);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Industry Hero */}
        <section className="pt-32 pb-24 px-6 md:px-12 w-full text-center max-w-5xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 border border-[#DCF8C6] bg-[#F0F2F5]/80 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#075E54] uppercase font-bold">
              Built for {data.name}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-8">
            {data.title}
          </h1>
          <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
            {data.description}
          </p>
          <button
            className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg tracking-wide shadow-2xl flex items-center justify-center gap-3 mx-auto transition-transform hover:scale-105"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        {/* Benefits & Features */}
        <section className="py-24 px-6 md:px-12 bg-slate-50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">Why AnytimeLLM for {data.name}?</h2>
              <ul className="space-y-6">
                {data.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-lg font-medium text-slate-600">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">Key Capabilities</h2>
              <ul className="space-y-6">
                {data.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-lg font-medium text-slate-600">
                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CtaBannerV2 />
      </main>

      <Footer />
    </div>
  );
}
