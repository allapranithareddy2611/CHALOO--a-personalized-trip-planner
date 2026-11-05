import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Users, 
  Sparkles, 
  Clock, 
  Check, 
  AlertCircle, 
  Info,
  Trees,
  Compass,
  Landmark,
  Waves,
  Utensils,
  ShoppingBag,
  Camera,
  Smile,
  ChevronDown
} from 'lucide-react';
import { DESTINATION_SUGGESTIONS, BUDGET_TIERS, INTEREST_OPTIONS } from '../data/destinations';
import { ItineraryFormData } from '../types/travel';
import { formatINR } from '../utils/storage';

interface PlanTripFormProps {
  initialDestination?: string;
  initialBudget?: number;
  onGenerate: (formData: ItineraryFormData) => void;
  isLoading: boolean;
}

export const PlanTripForm: React.FC<PlanTripFormProps> = ({
  initialDestination = '',
  initialBudget,
  onGenerate,
  isLoading
}) => {
  // Destination
  const [destination, setDestination] = useState(initialDestination || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destinationRef = useRef<HTMLDivElement>(null);

  // Budget
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<string>('₹10,000 – ₹20,000');
  const [customBudget, setCustomBudget] = useState<number>(initialBudget || 16000);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Trip Duration
  const [days, setDays] = useState<number>(3);
  
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // Travelers
  const [travelers, setTravelers] = useState<string>('2 people');
  const [travelersCount, setTravelersCount] = useState<number>(2);

  // Interests
  const [interests, setInterests] = useState<string[]>([
    'Nature and landscapes',
    'Food and restaurants',
    'Historical places'
  ]);

  // Pace
  const [pace, setPace] = useState<'Relaxed' | 'Moderate' | 'Packed'>('Moderate');

  // Special Notes
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Synchronize initialDestination if changed from parent
  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  // Synchronize initialBudget
  useEffect(() => {
    if (initialBudget) {
      setCustomBudget(initialBudget);
      const matched = BUDGET_TIERS.find(t => initialBudget >= t.min && initialBudget <= t.max);
      if (matched) {
        setSelectedBudgetTier(matched.label);
      } else {
        setIsCustomMode(true);
      }
    }
  }, [initialBudget]);

  // Update End Date whenever Start Date or Days change
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(end.getDate() + Math.max(0, days - 1));
        setEndDate(end.toISOString().split('T')[0]);
      }
    }
  }, [startDate, days]);

  // Destination autocomplete
  const handleDestinationChange = (val: string) => {
    setDestination(val);
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: '' }));
    }
    if (val.trim().length > 0) {
      const matches = DESTINATION_SUGGESTIONS.filter(item =>
        item.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Budget preset selection
  const handleSelectTier = (tier: typeof BUDGET_TIERS[0]) => {
    setSelectedBudgetTier(tier.label);
    setCustomBudget(tier.value);
    setIsCustomMode(false);
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: '' }));
    }
  };

  // Travelers selection
  const handleTravelerSelect = (label: string, count: number) => {
    setTravelers(label);
    setTravelersCount(count);
  };

  // Interest toggle
  const toggleInterest = (interestId: string) => {
    setInterests(prev => {
      if (prev.includes(interestId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(i => i !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };

  // Handle End Date manual change to recalculate days
  const handleEndDateChange = (endVal: string) => {
    setEndDate(endVal);
    if (startDate && endVal) {
      const s = new Date(startDate);
      const e = new Date(endVal);
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 1 && diffDays <= 14) {
        setDays(diffDays);
      }
    }
  };

  // Validate and submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!destination.trim()) {
      newErrors.destination = 'Please enter or select a travel destination.';
    }

    if (!customBudget || customBudget < 1000) {
      newErrors.budget = 'Please specify a realistic budget of at least ₹1,000.';
    }

    if (days < 1 || days > 14) {
      newErrors.days = 'Duration must be between 1 and 14 days.';
    }

    if (interests.length === 0) {
      newErrors.interests = 'Please pick at least one travel interest.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    onGenerate({
      destination: destination.trim(),
      budget: customBudget,
      budgetTier: isCustomMode ? `Custom (${formatINR(customBudget)})` : selectedBudgetTier,
      days,
      startDate,
      endDate,
      travelers,
      travelersCount,
      interests,
      pace,
      specialNotes: specialNotes.trim()
    });
  };

  // Helper icon renderer for interests
  const renderInterestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees': return <Trees className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Landmark': return <Landmark className="w-5 h-5" />;
      case 'Waves': return <Waves className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 px-6 sm:px-10 py-8 text-white relative">
          <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>CHALO Intelligent Trip Planner</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight">
            Design Your Dream Itinerary
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Fill in your trip details below. Google Gemini will engineer a personalized day-by-day plan with budget estimates, attractions, stays, and dining recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
          
          {/* SECTION A: Destination */}
          <div className="space-y-3" ref={destinationRef}>
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                  A
                </span>
                <span>Where do you want to travel?</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Suggestions available</span>
            </div>

            <div className="relative">
              <div className="relative flex items-center">
                <MapPin className="w-5 h-5 text-sky-600 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => {
                    if (destination.trim().length > 0) setShowSuggestions(true);
                  }}
                  placeholder="e.g. Ooty, Goa, Manali, Munnar, Jaipur, Varanasi..."
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                    errors.destination 
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' 
                      : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                  }`}
                />
              </div>

              {/* Autocomplete dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setDestination(item.split(',')[0]);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-900 flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {errors.destination && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.destination}</span>
              </p>
            )}

            {/* Quick destination suggestion pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-medium">Quick Pick:</span>
              {['Ooty', 'Goa', 'Manali', 'Munnar', 'Jaipur', 'Hyderabad', 'Coorg', 'Kerala'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setDestination(city);
                    setShowSuggestions(false);
                    if (errors.destination) setErrors(prev => ({ ...prev, destination: '' }));
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    destination.toLowerCase() === city.toLowerCase()
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>


          {/* SECTION B: Budget */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                  B
                </span>
                <span>Total Trip Budget in Indian Rupees (₹)</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
                Current: {formatINR(customBudget)}
              </span>
            </div>

            {/* Budget Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {BUDGET_TIERS.map((tier) => {
                const isSelected = !isCustomMode && selectedBudgetTier === tier.label;
                return (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-400/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                      {tier.label}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                      {tier.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Budget Input */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                    <span>Enter Custom Budget Amount</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Adjust to your exact group spending target.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={customBudget}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        setCustomBudget(val);
                        setIsCustomMode(true);
                        if (errors.budget) setErrors(prev => ({ ...prev, budget: '' }));
                      }}
                      className="w-40 pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  {isCustomMode && (
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/70 px-2.5 py-1 rounded-md">
                      Custom Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {errors.budget && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.budget}</span>
              </p>
            )}
          </div>


          {/* SECTION C: Trip Duration & Dates */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                  C
                </span>
                <span>Trip Duration & Travel Dates</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                {days} {days === 1 ? 'Day' : 'Days'} Trip
              </span>
            </div>

            {/* Quick Day Stepper */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Select Days:</span>
              {[1, 2, 3, 4, 5, 6, 7, 10].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    days === d
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {d} {d === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>End Date (Calculated automatically)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>
          </div>


          {/* SECTION D: Number of Travelers */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-black flex items-center justify-center">
                D
              </span>
              <span>Number of Travelers</span>
              <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Solo', count: 1, sub: '1 Explorer', icon: '👤' },
                { label: '2 people', count: 2, sub: 'Couple / Duo', icon: '👥' },
                { label: '3–5 people', count: 4, sub: 'Small Group / Family', icon: '👨‍👩‍👧' },
                { label: '6+ people', count: 7, sub: 'Large Group / Squad', icon: '🎉' },
              ].map((opt) => {
                const isSelected = travelers === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleTravelerSelect(opt.label, opt.count)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/80 ring-2 ring-cyan-400/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <p className={`text-sm font-bold ${isSelected ? 'text-cyan-950' : 'text-slate-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {opt.sub}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>


          {/* SECTION E: Travel Interests (Multiple Selection) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">
                  E
                </span>
                <span>Travel Interests (Select all that apply)</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-semibold">
                {interests.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((item) => {
                const isChecked = interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isChecked
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {renderInterestIcon(item.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-bold truncate ${
                        isChecked ? 'text-sky-950' : 'text-slate-700'
                      }`}>
                        {item.label}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.interests && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.interests}</span>
              </p>
            )}
          </div>


          {/* SECTION F: Preferred Travel Pace */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center">
                F
              </span>
              <span>Preferred Travel Pace</span>
              <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { 
                  id: 'Relaxed' as const, 
                  title: 'Relaxed', 
                  desc: 'Fewer activities with more free time and leisurely cafe breaks.',
                  badge: 'Slow Travel',
                  color: 'teal'
                },
                { 
                  id: 'Moderate' as const, 
                  title: 'Moderate', 
                  desc: 'Balanced sightseeing, good resting intervals, and authentic dining.',
                  badge: 'Most Popular',
                  color: 'sky'
                },
                { 
                  id: 'Packed' as const, 
                  title: 'Packed', 
                  desc: 'Explore as many top sights as possible from sunrise to late evening.',
                  badge: 'High Energy',
                  color: 'indigo'
                },
              ].map((p) => {
                const isSelected = pace === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPace(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-400/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                          {p.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Optional: Special Notes */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Special Notes or Preferences (Optional)</span>
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Traveling with senior parents, prefer vegetarian food, want scenic sunset spots..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>


          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-400 to-sky-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-lg shadow-xl shadow-sky-500/25 hover:shadow-sky-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>{isLoading ? 'Generating Your Itinerary...' : 'Generate My Itinerary'}</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              CHALO creates custom day-wise plans respecting your ₹{customBudget.toLocaleString('en-IN')} budget and {pace.toLowerCase()} pace.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
