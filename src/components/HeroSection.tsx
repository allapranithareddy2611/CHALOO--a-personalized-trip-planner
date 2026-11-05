import React, { useState } from 'react';
import { Sparkles, MapPin, Search, ArrowRight, ShieldCheck, Compass, Sliders, IndianRupee, Clock } from 'lucide-react';
import { DESTINATION_SUGGESTIONS } from '../data/destinations';

interface HeroSectionProps {
  onPlanTrip: (destination?: string) => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlanTrip, onExplore }) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSuggestions = DESTINATION_SUGGESTIONS.filter(item =>
    item.toLowerCase().includes(quickSearch.toLowerCase())
  ).slice(0, 5);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onPlanTrip(quickSearch.trim());
    } else {
      onPlanTrip();
    }
  };

  const trendingDestinations = [
    { name: 'Ooty', tag: 'Hill Station', days: '3 Days' },
    { name: 'Goa', tag: 'Beaches & Shacks', days: '4 Days' },
    { name: 'Manali', tag: 'Snow & Valleys', days: '4 Days' },
    { name: 'Munnar', tag: 'Tea Plantations', days: '3 Days' },
    { name: 'Jaipur', tag: 'Royal Forts', days: '3 Days' },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Image with layered gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=85"
          alt="Scenic Mountain Travel Landscape"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950" />
        <div className="absolute inset-0 bg-radial-at-c from-sky-900/20 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
        
        {/* Subtle Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 shadow-inner backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-400"></span>
            <span className="text-xs font-semibold text-sky-300">
              Less Planning. More Exploring.
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              Powered by Google Gemini
            </span>
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Outfit'] leading-[1.1]">
            Your Journey, Your Way.{' '}
            <span className="block mt-2 bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
              Let CHALO Plan It.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop switching between apps. Discover destinations, plan your budget, and get your personalized travel itinerary in one place.
          </p>

          {/* Quick Search & Planning Launcher */}
          <div className="pt-4 max-w-2xl mx-auto relative">
            <form onSubmit={handleQuickSubmit} className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              <div className="relative flex-1 w-full flex items-center pl-3">
                <MapPin className="w-5 h-5 text-sky-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => {
                    setQuickSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Where do you want to travel? (e.g. Ooty, Goa, Manali)"
                  className="w-full bg-transparent py-2.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex w-full sm:w-auto items-center gap-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Plan My Trip</span>
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && quickSearch.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 overflow-hidden text-left">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuickSearch(item.split(',')[0]);
                        setShowDropdown(false);
                        onPlanTrip(item.split(',')[0]);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{item}</span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      onPlanTrip(quickSearch);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>Search customized trip for &ldquo;{quickSearch}&rdquo;</span>
                  </button>
                )}
              </div>
            )}

            {/* Trending Quick Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-400">Popular:</span>
              {trendingDestinations.map((d) => (
                <button
                  key={d.name}
                  onClick={() => onPlanTrip(d.name)}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-sky-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>{d.name}</span>
                  <span className="text-[10px] text-slate-400">({d.days})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onPlanTrip()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-base shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base backdrop-blur-sm hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-sky-400" />
              <span>Explore Destinations</span>
            </button>
          </div>

        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center shrink-0 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Personalized</p>
              <p className="text-sm font-bold text-white">Day-Wise Itineraries</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950 flex items-center justify-center shrink-0 text-teal-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Accurate</p>
              <p className="text-sm font-bold text-white">Budget In ₹ (INR)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center shrink-0 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tailored</p>
              <p className="text-sm font-bold text-white">Flexible Pacing</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">All-in-One</p>
              <p className="text-sm font-bold text-white">Stays, Food & Sights</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
