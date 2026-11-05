import React, { useState } from 'react';
import { 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Users, 
  Clock, 
  Compass, 
  Heart, 
  Printer, 
  Share2, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Hotel,
  Car,
  Ticket,
  Luggage,
  ShieldAlert,
  ChevronRight,
  Sliders,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { ItineraryResult, DayPlan, DayActivity } from '../types/travel';
import { formatINR, saveTrip, toggleFavoriteTrip } from '../utils/storage';

interface ItineraryViewProps {
  itinerary: ItineraryResult;
  onRegenerate: () => void;
  onModify: () => void;
  onTripSaved?: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onRegenerate,
  onModify,
  onTripSaved
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [showAllDays, setShowAllDays] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(!!itinerary.isFavorite);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');

  const currentDay = itinerary.days.find(d => d.dayNumber === selectedDayNumber) || itinerary.days[0];

  // Budget calculations
  const totalCost = itinerary.totalEstimatedCost;
  const targetBudget = itinerary.budget;
  const remaining = itinerary.remainingBudget;
  const costPerPerson = itinerary.costPerPerson;

  // Percentage calculations for progress bar
  const totalBreakdown = 
    itinerary.budgetBreakdown.transportation +
    itinerary.budgetBreakdown.accommodation +
    itinerary.budgetBreakdown.food +
    itinerary.budgetBreakdown.activities +
    itinerary.budgetBreakdown.miscellaneous || 1;

  const pctTransport = Math.round((itinerary.budgetBreakdown.transportation / totalBreakdown) * 100);
  const pctStay = Math.round((itinerary.budgetBreakdown.accommodation / totalBreakdown) * 100);
  const pctFood = Math.round((itinerary.budgetBreakdown.food / totalBreakdown) * 100);
  const pctActivities = Math.round((itinerary.budgetBreakdown.activities / totalBreakdown) * 100);
  const pctMisc = Math.max(0, 100 - (pctTransport + pctStay + pctFood + pctActivities));

  const handleSave = () => {
    const updated = { ...itinerary, isFavorite: true };
    saveTrip(updated);
    setIsSaved(true);
    setSaveSuccessNotice('Itinerary saved to My Trips!');
    setTimeout(() => setSaveSuccessNotice(''), 3000);
    if (onTripSaved) onTripSaved();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = `Check out my ${itinerary.days.length}-day trip to ${itinerary.destination} on CHALO! Total Estimated Budget: ${formatINR(totalCost)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Save Toast Notification */}
      {saveSuccessNotice && (
        <div className="fixed top-24 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* TOP HERO SUMMARY CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-950 border border-sky-800 text-sky-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {itinerary.destination}
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-950 border border-teal-800 text-teal-400 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {itinerary.days.length} Days Itinerary
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                {itinerary.travelers}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                {itinerary.pace} Pace
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-white">
              {itinerary.tripTitle}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {itinerary.summary}
            </p>

            {/* Interest Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-slate-400 font-medium">Interests:</span>
              {itinerary.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-semibold text-slate-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2.5 shrink-0 no-print">
            <button
              onClick={handleSave}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isSaved
                  ? 'bg-rose-500/20 border border-rose-500 text-rose-300'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSaved ? 'Trip Saved' : 'Save Itinerary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-teal-400" /> : <Share2 className="w-4 h-4 text-teal-400" />}
              <span>{copiedLink ? 'Copied Summary!' : 'Share Trip'}</span>
            </button>

            <div className="flex items-center gap-2 w-full pt-1">
              <button
                onClick={onModify}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1 border border-slate-700/80 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Modify</span>
              </button>
              <button
                onClick={onRegenerate}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1 border border-slate-700/80 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 7: BUDGET BREAKDOWN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg shadow-slate-100 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900">
                Visual Budget Breakdown
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                remaining >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {remaining >= 0 ? 'Within Budget' : 'Budget Stretched'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Itemized estimates for {itinerary.travelers} in Indian Rupees (₹)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-medium">Cost Per Person</p>
              <p className="text-lg font-extrabold text-slate-800">{formatINR(costPerPerson)}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-medium">Total Estimated</p>
              <p className="text-xl font-black text-sky-600">{formatINR(totalCost)}</p>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs text-slate-500 font-medium">Your Target Budget</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(targetBudget)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Budget limit specified</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs text-slate-500 font-medium">Total Estimated Expenditure</p>
            <p className="text-2xl font-black text-sky-700 mt-1">{formatINR(totalCost)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Includes stays, transit & dining</p>
          </div>

          <div className={`p-4 rounded-2xl border ${
            remaining >= 0
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <p className="text-xs font-medium opacity-80">
              {remaining >= 0 ? 'Remaining Balance' : 'Estimated Excess'}
            </p>
            <p className="text-2xl font-black mt-1">
              {remaining >= 0 ? formatINR(remaining) : `+${formatINR(Math.abs(remaining))}`}
            </p>
            <p className="text-[11px] opacity-75 mt-0.5">
              {remaining >= 0 ? 'Buffer for shopping & treats' : 'Consider budget homestays to balance'}
            </p>
          </div>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${pctStay}%` }} className="bg-sky-500 transition-all duration-500" title={`Stay: ${pctStay}%`} />
            <div style={{ width: `${pctFood}%` }} className="bg-amber-500 transition-all duration-500" title={`Food: ${pctFood}%`} />
            <div style={{ width: `${pctActivities}%` }} className="bg-teal-500 transition-all duration-500" title={`Activities: ${pctActivities}%`} />
            <div style={{ width: `${pctTransport}%` }} className="bg-indigo-500 transition-all duration-500" title={`Transport: ${pctTransport}%`} />
            <div style={{ width: `${pctMisc}%` }} className="bg-slate-400 transition-all duration-500" title={`Misc: ${pctMisc}%`} />
          </div>

          {/* Bar Legends */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Accommodation</p>
                <p className="text-[11px] text-slate-500">{formatINR(itinerary.budgetBreakdown.accommodation)} ({pctStay}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Food & Dining</p>
                <p className="text-[11px] text-slate-500">{formatINR(itinerary.budgetBreakdown.food)} ({pctFood}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Sightseeing & Entry</p>
                <p className="text-[11px] text-slate-500">{formatINR(itinerary.budgetBreakdown.activities)} ({pctActivities}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Transportation</p>
                <p className="text-[11px] text-slate-500">{formatINR(itinerary.budgetBreakdown.transportation)} ({pctTransport}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Miscellaneous</p>
                <p className="text-[11px] text-slate-500">{formatINR(itinerary.budgetBreakdown.miscellaneous)} ({pctMisc}%)</p>
              </div>
            </div>
          </div>
        </div>

        {itinerary.budgetBreakdown.notes && (
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
            💡 {itinerary.budgetBreakdown.notes}
          </p>
        )}
      </div>


      {/* SECTION 6: DAY-WISE ITINERARY */}
      <div className="space-y-6">
        
        {/* Day Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black font-['Outfit'] text-slate-900">
              Day-Wise Itinerary Plan
            </h2>
            <p className="text-xs text-slate-500">
              Tailored morning, afternoon, and evening experiences in {itinerary.destination}
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showAllDays
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {showAllDays ? 'Single Day View' : 'Show All Days'}
            </button>
          </div>
        </div>

        {/* Day Pills Bar */}
        {!showAllDays && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
            {itinerary.days.map((day) => {
              const isSelected = selectedDayNumber === day.dayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-105'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>Day {day.dayNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-sky-700 text-sky-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {day.theme.split('–')[1] || day.theme.split('-')[1] || 'Highlights'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Days List */}
        <div className="space-y-8">
          {(showAllDays ? itinerary.days : [currentDay]).map((day) => (
            <div
              key={day.dayNumber}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md shadow-slate-100 space-y-6 page-break"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center">
                      {day.dayNumber}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900">
                      Day {day.dayNumber}: {day.theme}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {day.overview}
                  </p>
                </div>
              </div>

              {/* 3 Activities Timeline (Morning, Afternoon, Evening) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Morning */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold">
                        <Sun className="w-3.5 h-3.5 text-amber-600" />
                        <span>Morning</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {day.morning.estimatedTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {day.morning.activity}
                      </h4>
                      <p className="text-xs font-medium text-amber-800 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {day.morning.location}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {day.morning.description}
                    </p>

                    {day.morning.tips && (
                      <p className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded-lg italic">
                        💡 {day.morning.tips}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      Est. Cost: <strong className="text-slate-900">{formatINR(day.morning.estimatedCost)}</strong>
                    </span>
                    <span className="text-amber-800 text-[11px]">
                      Next: {day.morning.travelTimeNext}
                    </span>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-bold">
                        <Sunset className="w-3.5 h-3.5 text-sky-600" />
                        <span>Afternoon</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {day.afternoon.estimatedTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {day.afternoon.activity}
                      </h4>
                      <p className="text-xs font-medium text-sky-800 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {day.afternoon.location}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {day.afternoon.description}
                    </p>

                    {day.afternoon.tips && (
                      <p className="text-[11px] text-sky-900 bg-sky-100/70 p-2 rounded-lg italic">
                        💡 {day.afternoon.tips}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      Est. Cost: <strong className="text-slate-900">{formatINR(day.afternoon.estimatedCost)}</strong>
                    </span>
                    <span className="text-sky-800 text-[11px]">
                      Next: {day.afternoon.travelTimeNext}
                    </span>
                  </div>
                </div>

                {/* Evening */}
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 text-xs font-bold">
                        <Moon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Evening</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {day.evening.estimatedTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {day.evening.activity}
                      </h4>
                      <p className="text-xs font-medium text-indigo-800 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {day.evening.location}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {day.evening.description}
                    </p>

                    {day.evening.tips && (
                      <p className="text-[11px] text-indigo-900 bg-indigo-100/70 p-2 rounded-lg italic">
                        💡 {day.evening.tips}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-indigo-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      Est. Cost: <strong className="text-slate-900">{formatINR(day.evening.estimatedCost)}</strong>
                    </span>
                    <span className="text-indigo-800 text-[11px]">
                      {day.evening.travelTimeNext}
                    </span>
                  </div>
                </div>

              </div>

              {/* Suggested Accommodation & Recommended Food */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Stay Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Hotel className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Suggested Accommodation</h4>
                        <p className="text-[11px] text-slate-500">{day.suggestedStay.type}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      ~{formatINR(day.suggestedStay.estimatedPricePerNight)} / night
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-slate-800">
                      {day.suggestedStay.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-500" />
                      Area: {day.suggestedStay.area}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {day.suggestedStay.whyRecommended}
                    </p>
                  </div>
                </div>

                {/* Food Recommendations */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Curated Local Dining</h4>
                        <p className="text-[11px] text-slate-500">Authentic regional flavors</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                      Specialties
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {day.recommendedFood.map((food, fIdx) => (
                      <div key={fIdx} className="p-2.5 rounded-xl bg-white border border-slate-100 flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              {food.mealType}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {food.dish}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Spot: {food.restaurant}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-700 shrink-0">
                          {formatINR(food.approxCost)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Day Travel Tips */}
              {day.travelTips && day.travelTips.length > 0 && (
                <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
                  <Compass className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sky-950">Local Day Tips:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {day.travelTips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>


      {/* PACKING, WEATHER & DISCLAIMERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Packing Advice */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md shadow-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Packing & Weather Insights</h3>
              <p className="text-xs text-slate-500">Customized for {itinerary.destination}</p>
            </div>
          </div>

          <ul className="space-y-2">
            {itinerary.packingAndWeatherAdvice.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md shadow-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Verification & Important Notes</h3>
              <p className="text-xs text-slate-500">Live booking guidance</p>
            </div>
          </div>

          <ul className="space-y-2">
            {itinerary.importantDisclaimers.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
              <span>
                CHALO provides intelligent estimates. Please re-confirm monument opening hours, permits, and restaurant table availability before heading out.
              </span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
