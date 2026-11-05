import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  IndianRupee, 
  Calendar, 
  Check, 
  X,
  Filter,
  Eye,
  Utensils
} from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import { DestinationInfo } from '../types/travel';

interface ExploreDestinationsProps {
  onSelectDestination: (destName: string, budgetNum?: number) => void;
}

export const ExploreDestinations: React.FC<ExploreDestinationsProps> = ({ onSelectDestination }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalDest, setActiveModalDest] = useState<DestinationInfo | null>(null);

  const categories = ['All', 'Hills', 'Beach', 'Heritage', 'Nature', 'Spiritual', 'City'];

  const filteredDestinations = POPULAR_DESTINATIONS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bestExperiences.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Destination Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
          Explore Handpicked Destinations
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          From tranquil Nilgiri hill retreats and sun-soaked Goan shores to royal Rajasthani palaces. Choose your destination and let CHALO build your personalized day-by-day plan.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, state, or experience..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Destination Cards */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                      {dest.category}
                    </span>
                  </div>

                  {/* Best Season */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/90 backdrop-blur-md text-[10px] font-black text-slate-950">
                      {dest.bestSeason}
                    </span>
                  </div>

                  {/* Destination Name Overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-2xl font-black font-['Outfit'] text-white">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-sky-200 font-medium">
                      {dest.state} • {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Best Experiences */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Best Experiences
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.bestExperiences.slice(0, 3).map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 text-[11px] font-semibold border border-sky-100"
                        >
                          {exp}
                        </span>
                      ))}
                      {dest.bestExperiences.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-medium">
                          +{dest.bestExperiences.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Budget & Duration Stats */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Est. Budget Range</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{dest.estimatedBudget}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Recommended</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">{dest.recommendedDays} Days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalDest(dest)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDestination(dest.name, dest.budgetNumber)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip to {dest.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any destination matching &ldquo;{searchQuery}&rdquo;. Try clearing your filters or type your city into the trip planner.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* DESTINATION DETAIL POPUP MODAL */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Header Image */}
            <div className="relative h-60 w-full shrink-0">
              <img
                src={activeModalDest.image}
                alt={activeModalDest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black uppercase">
                  {activeModalDest.category}
                </span>
                <h3 className="text-3xl font-black font-['Outfit'] mt-1">
                  {activeModalDest.name}
                </h3>
                <p className="text-xs text-sky-200">
                  {activeModalDest.state} • {activeModalDest.tagline}
                </p>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
              
              <p className="text-sm leading-relaxed text-slate-600">
                {activeModalDest.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Top Highlights & Landmarks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalDest.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Famous Local Dishes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" />
                  <span>Must-Try Local Food & Specialties</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalDest.localFood.map((food, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs">
                <div>
                  <p className="text-[10px] text-sky-700 font-semibold uppercase">Best Season</p>
                  <p className="font-bold text-slate-900 mt-0.5">{activeModalDest.bestSeason}</p>
                </div>
                <div>
                  <p className="text-[10px] text-sky-700 font-semibold uppercase">Estimated Budget</p>
                  <p className="font-bold text-slate-900 mt-0.5">{activeModalDest.estimatedBudget}</p>
                </div>
                <div>
                  <p className="text-[10px] text-sky-700 font-semibold uppercase">Recommended Duration</p>
                  <p className="font-bold text-slate-900 mt-0.5">{activeModalDest.recommendedDays} Days</p>
                </div>
              </div>

            </div>

            {/* Footer Modal Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalDest(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetName = activeModalDest.name;
                  const targetBudget = activeModalDest.budgetNumber;
                  setActiveModalDest(null);
                  onSelectDestination(targetName, targetBudget);
                }}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Trip to {activeModalDest.name}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
