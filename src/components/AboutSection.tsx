import React, { useState } from 'react';
import { Compass, Sparkles, Shield, Heart, HelpCircle, ChevronDown, ChevronUp, MapPin, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does CHALO calculate trip budgets and pricing?',
      a: 'CHALO aggregates real-world median pricing for Indian tourist destinations across budget homestays, mid-range hotels, local transportation (auto-rickshaws, shared taxis, car rentals), iconic regional restaurants, and state monument entry tickets. Gemini AI then optimizes your schedule to fit seamlessly within your chosen budget bracket in Indian Rupees (₹).'
    },
    {
      q: 'Can I customize the travel pace to my style?',
      a: 'Absolutely! You can choose between "Relaxed" (fewer spots, leisurely morning starts, ample cafe time), "Moderate" (balanced sightseeing with comfortable breaks), and "Packed" (sunrise to sunset high-energy exploration to cover as many iconic landmarks as possible).'
    },
    {
      q: 'Are the hotel and restaurant suggestions verified?',
      a: 'Yes, CHALO recommends renowned, authentic culinary institutions (like heritage cafes, legendary bakeries, and famous thali spots) and established hotel zones. While we provide realistic estimates, travelers are advised to verify seasonal tariff spikes and opening hours before departure.'
    },
    {
      q: 'Do I need to pay or create an account to use CHALO?',
      a: 'CHALO is 100% free to use! You can plan trips, download clean print/PDF versions, and save multiple itineraries to your browser via LocalStorage with zero hidden costs.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Narrative */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-800 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight leading-tight">
            Less Planning. More Exploring.
          </h2>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
            &ldquo;CHALO is designed to make travel planning simple, personalized, and stress-free. We bring destinations, accommodation suggestions, food recommendations, and activities together into one convenient travel-planning experience.&rdquo;
          </div>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Planning a getaway shouldn&apos;t feel like a second job. Traditional travel planning forces travelers to bounce frantically between blogs, booking engines, maps, and budgeting spreadsheets. CHALO unites all these moving pieces into an intelligent, cohesive, day-by-day blueprint.
          </p>
        </div>
      </div>

      {/* Core Values 3-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-['Outfit'] text-slate-900">
            Intelligent Personalization
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every itinerary is built dynamically around your exact budget, group size, personal interests, and preferred rhythm.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-['Outfit'] text-slate-900">
            Real-World Feasibility
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We compute travel times between consecutive sights and avoid unrealistic promises so your trip stays enjoyable.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-['Outfit'] text-slate-900">
            Local Culture & Gastronomy
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From Ooty chocolates and Nilgiri tea to Goan prawn balchão, CHALO highlights the true culinary soul of each region.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">
            Everything You Need To Know
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-sky-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-sky-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-8">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
