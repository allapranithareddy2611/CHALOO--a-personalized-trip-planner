import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import { ItineraryFormData } from '../types/travel';
import { formatINR } from '../utils/storage';

interface GenerationLoadingModalProps {
  formData: ItineraryFormData | null;
}

export const GenerationLoadingModal: React.FC<GenerationLoadingModalProps> = ({ formData }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: 'Scanning destination landmarks', desc: `Analyzing top spots, viewpoints, and culture in ${formData?.destination || 'your destination'}...` },
    { title: 'Optimizing budget distribution', desc: `Structuring stays, transit, and meals to stay close to ${formData ? formatINR(formData.budget) : 'your budget'}...` },
    { title: 'Calibrating travel pace', desc: `Arranging morning, afternoon, and evening timelines for a ${formData?.pace || 'Moderate'} pace...` },
    { title: 'Selecting authentic culinary spots', desc: 'Handpicking local breakfast cafes, authentic thalis, and famous regional dishes...' },
    { title: 'Polishing your CHALO itinerary', desc: 'Assembling day-wise timeline, travel tips, and packing essentials...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Center Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 via-teal-400 to-cyan-300 p-0.5 shadow-xl shadow-sky-500/25">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Compass className="w-10 h-10 text-sky-400 animate-spin [animation-duration:8s]" />
            </div>
            <Sparkles className="w-5 h-5 text-teal-300 absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-2xl font-black font-['Outfit'] tracking-tight">
            Crafting Your {formData?.destination} Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Powered by Google Gemini travel intelligence
          </p>
        </div>

        {/* Summary Badges */}
        {formData && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-slate-300">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {formData.destination}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              {formData.days} Days
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
              {formatINR(formData.budget)}
            </span>
          </div>
        )}

        {/* Dynamic Step Progress */}
        <div className="space-y-3 mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          {steps.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            return (
              <div
                key={step.title}
                className={`flex items-start gap-3 transition-opacity duration-300 ${
                  isCompleted ? 'opacity-80' : isCurrent ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${isCurrent ? 'text-sky-300' : 'text-slate-300'}`}>
                    {step.title}
                  </p>
                  {isCurrent && (
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug animate-pulse">
                      {step.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

      </div>
    </div>
  );
};
