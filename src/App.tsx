/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { PlanTripForm } from './components/PlanTripForm';
import { GenerationLoadingModal } from './components/GenerationLoadingModal';
import { ItineraryView } from './components/ItineraryView';
import { ExploreDestinations } from './components/ExploreDestinations';
import { MyTrips } from './components/MyTrips';
import { AboutSection } from './components/AboutSection';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ItineraryFormData, ItineraryResult, UserProfile } from './types/travel';
import { getSavedTrips, getUserProfile, saveTrip } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryResult | null>(null);
  const [savedTrips, setSavedTrips] = useState<ItineraryResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingFormData, setLoadingFormData] = useState<ItineraryFormData | null>(null);
  const [prefilledDestination, setPrefilledDestination] = useState<string>('');
  const [prefilledBudget, setPrefilledBudget] = useState<number | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load saved trips on mount
  useEffect(() => {
    refreshTrips();
  }, []);

  const refreshTrips = () => {
    const list = getSavedTrips();
    setSavedTrips(list);
  };

  // User starts planning from hero or explore
  const handleStartPlanning = (destination?: string, budgetNum?: number) => {
    if (destination) {
      setPrefilledDestination(destination);
    }
    if (budgetNum) {
      setPrefilledBudget(budgetNum);
    }
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit form and generate itinerary via server backend
  const handleGenerateItinerary = async (formData: ItineraryFormData) => {
    setIsLoading(true);
    setLoadingFormData(formData);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          budget: formData.budget,
          days: formData.days,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelers: formData.travelers,
          travelersCount: formData.travelersCount,
          interests: formData.interests,
          pace: formData.pace,
          specialNotes: formData.specialNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate itinerary (Status: ${response.status})`);
      }

      const data: ItineraryResult = await response.json();
      
      // Attach an ID and metadata if missing
      const fullItinerary: ItineraryResult = {
        ...data,
        id: data.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: data.createdAt || new Date().toISOString(),
        travelers: formData.travelers,
        travelersCount: formData.travelersCount,
        pace: formData.pace,
        interests: formData.interests,
        startDate: formData.startDate,
        endDate: formData.endDate,
        specialNotes: formData.specialNotes,
      };

      // Automatically store in saved trips
      saveTrip(fullItinerary);
      refreshTrips();

      setCurrentItinerary(fullItinerary);
      setActiveTab('itinerary');

      // Confetti burst for victory!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fail
      }

    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      setApiError(
        err.message || 'Something went wrong while generating your travel itinerary. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setLoadingFormData(null);
    }
  };

  // Open a saved trip from My Trips
  const handleOpenTrip = (trip: ItineraryResult) => {
    setCurrentItinerary(trip);
    setActiveTab('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedTripsCount={savedTrips.length}
        userProfile={userProfile}
        onOpenAuth={() => setAuthModalOpen(true)}
        onStartPlanning={() => handleStartPlanning()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* API Error Notification */}
        {apiError && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <p className="text-xs sm:text-sm font-medium">{apiError}</p>
              </div>
              <button
                onClick={() => setApiError(null)}
                className="px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: Home View */}
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onPlanTrip={(dest) => handleStartPlanning(dest)}
              onExplore={() => {
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <WhyChooseSection
              onPlanTrip={() => handleStartPlanning()}
            />
            <div className="py-16 bg-slate-50">
              <div className="text-center max-w-3xl mx-auto mb-8 px-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Featured Getaways
                </span>
                <h2 className="text-3xl font-black font-['Outfit'] text-slate-900 mt-1">
                  Popular Indian Destinations
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Click any destination to start your personalized trip itinerary
                </p>
              </div>
              <ExploreDestinations
                onSelectDestination={(dest, budget) => handleStartPlanning(dest, budget)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Plan Trip View */}
        {activeTab === 'plan' && (
          <div className="py-6">
            <PlanTripForm
              initialDestination={prefilledDestination}
              initialBudget={prefilledBudget}
              onGenerate={handleGenerateItinerary}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* TAB 3: Itinerary View */}
        {activeTab === 'itinerary' && currentItinerary && (
          <div className="py-6">
            <ItineraryView
              itinerary={currentItinerary}
              onRegenerate={() => {
                if (loadingFormData) {
                  handleGenerateItinerary(loadingFormData);
                } else {
                  handleStartPlanning(currentItinerary.destination, currentItinerary.budget);
                }
              }}
              onModify={() => {
                setPrefilledDestination(currentItinerary.destination);
                setPrefilledBudget(currentItinerary.budget);
                setActiveTab('plan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTripSaved={refreshTrips}
            />
          </div>
        )}

        {/* TAB 4: Explore Destinations View */}
        {activeTab === 'explore' && (
          <div>
            <ExploreDestinations
              onSelectDestination={(dest, budget) => handleStartPlanning(dest, budget)}
            />
          </div>
        )}

        {/* TAB 5: My Trips Dashboard */}
        {activeTab === 'my-trips' && (
          <div>
            <MyTrips
              trips={savedTrips}
              onOpenTrip={handleOpenTrip}
              onPlanNewTrip={(dest) => handleStartPlanning(dest)}
              onRefreshTrips={refreshTrips}
            />
          </div>
        )}

        {/* TAB 6: About Us View */}
        {activeTab === 'about' && (
          <div>
            <AboutSection />
          </div>
        )}

      </main>

      {/* Loading Modal with step by step animation */}
      {isLoading && (
        <GenerationLoadingModal formData={loadingFormData} />
      )}

      {/* User Auth / Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(profile) => {
          setUserProfile(profile);
          refreshTrips();
        }}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectDestination={(dest) => handleStartPlanning(dest)}
      />

    </div>
  );
}
