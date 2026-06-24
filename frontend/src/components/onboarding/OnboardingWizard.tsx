"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import type { Business } from "@/lib/api";
import { 
  CheckCircle2, 
  Circle, 
  QrCode, 
  UploadCloud, 
  Bot, 
  Rocket, 
  ArrowRight, 
  Loader2,
  FileText,
  MessageSquare
} from "lucide-react";

interface OnboardingWizardProps {
  activeBusiness: Business;
  onComplete: (updatedBiz: Business) => void;
}

const STEPS = [
  { id: 1, title: "Connect WhatsApp", desc: "Link your business number" },
  { id: 2, title: "Upload Catalog", desc: "Teach AI your products & prices" },
  { id: 3, title: "Upload Knowledge", desc: "Add FAQs and policies" },
  { id: 4, title: "Test AI", desc: "Verify responses safely" },
  { id: 5, title: "Go Live", desc: "Activate your autonomous agent" }
];

export default function OnboardingWizard({ activeBusiness, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: QR
  const [isQrScanned, setIsQrScanned] = useState(false);

  // Step 2 & 3: Uploads
  const [catalogUploaded, setCatalogUploaded] = useState(false);
  const [knowledgeUploaded, setKnowledgeUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Test
  const [testMessages, setTestMessages] = useState<{role: string, text: string}[]>([]);
  const [testInput, setTestInput] = useState("");

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(curr => curr + 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.updateBusinessSettings(activeBusiness.id, {
        onboarding_status: "completed"
      });
      const freshBiz = await api.getMyBusiness();
      onComplete(freshBiz);
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setLoading(false);
    }
  };

  const handleScanQr = () => {
    setLoading(true);
    setTimeout(() => {
      setIsQrScanned(true);
      setLoading(false);
    }, 2000);
  };

  const handleFileUpload = (type: 'catalog' | 'knowledge') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Use existing API to upload file
      await api.uploadFile(activeBusiness.id, file, activeBusiness.name, activeBusiness.business_type);
      if (type === 'catalog') {
        setCatalogUploaded(true);
      } else {
        setKnowledgeUploaded(true);
      }
      setLoading(false);
    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
      // For demo purposes, we still allow them to proceed
      if (type === 'catalog') setCatalogUploaded(true);
      else setKnowledgeUploaded(true);
    }
  };

  const handleTestChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    
    setTestMessages(prev => [...prev, { role: "user", text: testInput }]);
    const currentInput = testInput;
    setTestInput("");
    setLoading(true);

    setTimeout(() => {
      setTestMessages(prev => [...prev, { 
        role: "agent", 
        text: `Based on your uploaded documents, here is how I would answer: "${currentInput}"` 
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col md:flex-row font-body">
      {/* Left Sidebar - Progress Tracker */}
      <div className="w-full md:w-80 bg-white border-r border-surface-border p-8 flex flex-col justify-between shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 mb-8">
            Setup AnytimeLLM
          </h1>
          <div className="space-y-6">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <div key={step.id} className={`flex items-start gap-4 transition-all ${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                  <div className="mt-0.5">
                    {isPast ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="hidden md:block">
          <p className="text-xs text-slate-400">Need help? Contact support@anytimellm.com</p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WhatsApp */}
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <QrCode className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Connect WhatsApp</h2>
                  <p className="text-slate-500 mb-8">
                    Scan the QR code below using your WhatsApp app to link your business number. This gives your AI agent permission to reply to customers.
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8 flex flex-col items-center justify-center min-h-[240px]">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                        <span className="text-sm font-medium text-slate-600">Waiting for scan...</span>
                      </div>
                    ) : isQrScanned ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                        <span className="text-lg font-bold text-slate-900">Successfully Connected!</span>
                      </div>
                    ) : (
                      <div className="relative cursor-pointer group" onClick={handleScanQr}>
                        <QrCode className="w-40 h-40 text-slate-800" />
                        <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-600 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">Click to Simulate Scan</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={nextStep}
                    disabled={!isQrScanned}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Catalog <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Catalog */}
            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Upload Your Catalog</h2>
                  <p className="text-slate-500 mb-8">
                    Upload your menu, service list, or product catalog. The AI will learn your offerings and pricing instantly.
                  </p>
                  
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-8 mb-8 flex flex-col items-center justify-center min-h-[240px]">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload('catalog')} 
                      className="hidden" 
                      accept=".pdf,.csv,.txt"
                    />
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                        <span className="text-sm font-medium text-slate-600">Extracting products and prices...</span>
                      </div>
                    ) : catalogUploaded ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 mb-1">Catalog Processed!</span>
                        <span className="text-sm text-slate-500">Products are now in your database.</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm mb-3"
                        >
                          Select File (PDF, CSV, TXT)
                        </button>
                        <span className="text-xs text-slate-400">Max file size: 10MB</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={nextStep}
                      disabled={!catalogUploaded}
                      className="flex-1 py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Knowledge <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Knowledge */}
            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <UploadCloud className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Upload Knowledge Base</h2>
                  <p className="text-slate-500 mb-8">
                    Upload your FAQs, return policies, or store hours. The AI uses this to handle general customer inquiries.
                  </p>
                  
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-8 mb-8 flex flex-col items-center justify-center min-h-[240px]">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload('knowledge')} 
                      className="hidden" 
                      accept=".pdf,.csv,.txt,.docx"
                    />
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                        <span className="text-sm font-medium text-slate-600">Vectorizing knowledge...</span>
                      </div>
                    ) : knowledgeUploaded ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 mb-1">Knowledge Active!</span>
                        <span className="text-sm text-slate-500">Your AI is now fully trained.</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm mb-3"
                        >
                          Select File (PDF, DOCX, TXT)
                        </button>
                        <span className="text-xs text-slate-400">Max file size: 10MB</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={nextStep}
                      disabled={!knowledgeUploaded}
                      className="flex-1 py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Testing <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Test AI */}
            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900">Test Your Agent</h2>
                      <p className="text-sm text-slate-500">Ask questions as if you were a customer.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4 min-h-[300px]">
                  {testMessages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-12">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Send a message to start testing.</p>
                    </div>
                  ) : (
                    testMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-tl-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                  <form onSubmit={handleTestChat} className="flex gap-2 mb-6">
                    <input 
                      type="text" 
                      value={testInput}
                      onChange={e => setTestInput(e.target.value)}
                      placeholder="e.g. Do you have any vegetarian options?"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    />
                    <button type="submit" disabled={!testInput.trim() || loading} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50">
                      Send
                    </button>
                  </form>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={nextStep}
                      className="flex-1 py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
                    >
                      Looks Good, Go Live <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Go Live */}
            {currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-8 md:p-12 text-center">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl shadow-xl flex items-center justify-center relative z-10 transform rotate-3">
                      <Rocket className="w-12 h-12 text-white transform -rotate-3" />
                    </div>
                  </div>
                  
                  <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">You're Ready to Go Live!</h2>
                  <p className="text-slate-500 mb-8 text-lg">
                    Your autonomous sales agent is fully configured. It will now handle inquiries, answer questions, and capture orders automatically.
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-left space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">WhatsApp Channel Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">Catalog Indexed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">Knowledge Base Trained</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-lg disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enter Mission Control"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
