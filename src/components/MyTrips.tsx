import React, { useState } from 'react';
import { 
  Heart, 
  Trash2, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Clock, 
  IndianRupee, 
  Search,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ItineraryResult } from '../types/travel';
import { formatINR, deleteSavedTrip, toggleFavoriteTrip } from '../utils/storage';

interface MyTripsProps {
  trips: ItineraryResult[];
  onOpenTrip: (trip: ItineraryResult) => void;
  onPlanNewTrip: (destination?: string) => void;
  onRefreshTrips: () => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({
  trips,
  onOpenTrip,
  onPlanNewTrip,
  onRefreshTrips
}) => {
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const filteredTrips = trips.filter((trip) => {
    const matchesFav = !filterFavoriteOnly || trip.isFavorite;
    const matchesSearch = 
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.tripTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFav && matchesSearch;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedTrip(id);
    setTripToDelete(null);
    onRefreshTrips();
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteTrip(id);
    onRefreshTrips();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black font-['Outfit'] text-slate-900 tracking-tight">
              My Saved Trips
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black">
              {trips.length}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Reopen your generated day-wise itineraries, track budgets, and manage your travel bucket list.
          </p>
        </div>

        <button
          onClick={() => onPlanNewTrip()}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Another Trip</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      {trips.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by destination or title..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterFavoriteOnly
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filterFavoriteOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Favorites Only</span>
            </button>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onOpenTrip(trip)}
              className="group cursor-pointer bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-400 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                
                {/* Destination & Action Icons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      {trip.destination}
                    </span>
                    <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {trip.tripTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleToggleFav(trip.id, e)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Favorite"
                    >
                      <Heart className={`w-4 h-4 ${trip.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTripToDelete(trip.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {trip.summary}
                </p>

                {/* Key Metadata */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Duration</p>
                    <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      {trip.days.length} Days ({trip.pace})
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Est. Budget</p>
                    <p className="font-extrabold text-teal-700 flex items-center gap-1 mt-0.5">
                      {formatINR(trip.totalEstimatedCost)}
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Card Bar */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-sky-600 transition-colors">
                <span>View Full Day-by-Day Itinerary</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-bold text-slate-700">No trips match your filter</p>
          <button
            onClick={() => {
              setFilterFavoriteOnly(false);
              setSearchTerm('');
            }}
            className="text-xs font-bold text-sky-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 space-y-6 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">
              No Saved Trips Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              You haven&apos;t generated or saved any travel itineraries yet. Start by picking a dream destination or generate an AI-powered plan in seconds.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onPlanNewTrip()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Your First Trip</span>
            </button>
          </div>

          {/* Quick starter suggestions */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold mb-2">Need inspiration? Try one click:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Ooty (3 Days)', 'Goa (4 Days)', 'Manali (4 Days)', 'Jaipur (3 Days)'].map((p) => {
                const name = p.split(' ')[0];
                return (
                  <button
                    key={p}
                    onClick={() => onPlanNewTrip(name)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Delete Saved Itinerary?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove this itinerary from your saved trips? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTripToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleDelete(tripToDelete, e)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
