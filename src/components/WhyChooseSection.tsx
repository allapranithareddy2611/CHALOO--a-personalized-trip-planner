import React from 'react';
import { Calendar, Wallet, Compass, SlidersHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhyChooseSectionProps {
  onPlanTrip: () => void;
}

export const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({ onPlanTrip }) => {
  const features = [
    {
      id: 1,
      title: 'Smart Itineraries',
      subtitle: 'Personalized day-wise travel plans.',
      description: 'Hour-by-hour morning, afternoon, and evening schedules with calculated travel times so you never feel rushed or disoriented.',
      icon: Calendar,
      color: 'from-sky-500 to-blue-600',
      badge: 'Day-by-Day Logic',
      tag: 'Morning • Afternoon • Evening'
    },
    {
      id: 2,
      title: 'Budget Friendly',
      subtitle: 'Plans that match your spending limit.',
      description: 'Strict budget adherence in Indian Rupees (₹) with real itemized estimates across transportation, stays, dining, and entrance fees.',
      icon: Wallet,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Zero Surprise Costs',
      tag: '₹5,000 to ₹1,00,000+'
    },
    {
      id: 3,
      title: 'All-in-One Planning',
      subtitle: 'Destinations, stays, food, and activities.',
      description: 'Eliminate 10 browser tabs. Get hand-picked accommodations, regional dining gems, must-try local specialties, and top tourist sights.',
      icon: Compass,
      color: 'from-cyan-500 to-teal-500',
      badge: 'Curated Experiences',
      tag: 'Stays + Dining + Sights'
    },
    {
      id: 4,
      title: 'Flexible Travel',
      subtitle: 'Customize your itinerary according to your pace.',
      description: 'Whether you prefer a relaxed morning coffee vibe, a moderate balanced getaway, or a high-energy packed adventure, CHALO adapts to you.',
      icon: SlidersHorizontal,
      color: 'from-indigo-500 to-sky-600',
      badge: 'Dynamic Pacing',
      tag: 'Relaxed • Moderate • Packed'
    },
  ];

  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-800/80 text-sky-400 text-xs font-bold uppercase tracking-wider">
            Why Choose CHALO?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            Travel Planning Made{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Effortless & Intelligent
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Say goodbye to endless spreadsheets, scattered bookmarks, and travel anxiety. CHALO combines local intelligence with Gemini AI to design your ideal escape.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-lg text-slate-950 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold font-['Outfit'] text-white group-hover:text-sky-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-400 mt-1 mb-3">
                    {feat.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span>{feat.tag}</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-teal-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white font-['Outfit']">
              Ready to experience stress-free travel planning?
            </h4>
            <p className="text-sm text-slate-400">
              Build your custom day-by-day itinerary in less than 30 seconds.
            </p>
          </div>
          <button
            onClick={onPlanTrip}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-teal-400 text-slate-950 font-bold text-sm hover:from-sky-300 hover:to-teal-300 shadow-md shadow-sky-500/20 flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
