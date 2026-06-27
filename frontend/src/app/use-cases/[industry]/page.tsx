import React from "react";
import { notFound } from "next/navigation";
import { getIndustry, industries } from "@/data/industries";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBannerV2 from "@/components/landing/CtaBannerV2";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import BusinessBrainMotif from "@/components/ui/BusinessBrainMotif";

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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-body selection:bg-emerald-500/30">
      <Header />
      
      <main className="flex-1 overflow-x-hidden">
        {/* Industry Hero */}
        <section className="relative pt-32 pb-24 px-6 md:px-12 w-full text-center max-w-5xl mx-auto z-10">
          <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none mix-blend-multiply" />
          <div className="absolute top-0 left-[50%] translate-x-[-50%] w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-[100%] pointer-events-none" />

          <div className="mb-6 inline-flex items-center gap-2 border border-emerald-200/50 bg-emerald-50/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm relative z-10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] tracking-widest text-emerald-700 uppercase font-bold">
              Built for {data.name}
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-8 relative z-10">
            {data.title}
          </h1>
          
          <p className="text-xl text-slate-600 font-medium mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
            {data.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <button
              className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg tracking-wide shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-sm text-slate-500 font-medium text-left">
              <span className="block">No credit card required.</span>
              <span className="block">Setup in 3 minutes.</span>
            </div>
          </div>

          <div className="mt-16 flex justify-center relative z-10">
            <BusinessBrainMotif className="scale-110" />
          </div>
        </section>

        {/* Benefits & Features */}
        <section className="py-24 px-6 md:px-12 bg-slate-50 border-t border-slate-100 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="font-display text-3xl font-black text-slate-900">Why AnytimeLLM?</h2>
              </div>
              <ul className="space-y-6">
                {data.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-lg font-medium text-slate-600">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="font-display text-3xl font-black text-slate-900">Key Capabilities</h2>
              </div>
              <div className="space-y-4">
                {data.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-inner">
                      {idx + 1}
                    </div>
                    <span className="text-xl font-bold text-slate-800">{feature}</span>
                  </div>
                ))}
              </div>
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
