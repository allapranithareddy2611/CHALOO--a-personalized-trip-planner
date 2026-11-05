import React, { useState } from 'react';
import { X, User, Mail, MapPin, Compass, Sparkles, Check } from 'lucide-react';
import { UserProfile } from '../types/travel';
import { saveUserProfile } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile
}) => {
  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [homeCity, setHomeCity] = useState(userProfile.homeCity || 'Bengaluru');
  const [pace, setPace] = useState<'Relaxed' | 'Moderate' | 'Packed'>(userProfile.favoritePace || 'Moderate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: name.trim() || 'Traveler',
      email: email.trim() || 'traveler@chalo.in',
      homeCity: homeCity.trim() || 'Bengaluru',
      favoritePace: pace,
      isLoggedIn: true
    };
    saveUserProfile(updated);
    onUpdateProfile(updated);
    onClose();
  };

  const handleLogout = () => {
    const guest: UserProfile = {
      name: 'Traveler',
      email: '',
      homeCity: 'Bengaluru',
      favoritePace: 'Moderate',
      isLoggedIn: false
    };
    saveUserProfile(guest);
    onUpdateProfile(guest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Outfit'] text-slate-900">
              {userProfile.isLoggedIn ? 'Traveler Profile' : 'Welcome to CHALO'}
            </h3>
            <p className="text-xs text-slate-500">
              {userProfile.isLoggedIn ? 'Manage your travel preferences' : 'Personalize your itinerary generation'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pranitha Reddy"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. pranitha@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Home City (for origin tips)</span>
            </label>
            <input
              type="text"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              placeholder="e.g. Hyderabad / Bengaluru / Mumbai"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700">
              Default Travel Pace
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Relaxed', 'Moderate', 'Packed'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPace(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    pace === p
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{userProfile.isLoggedIn ? 'Update Profile' : 'Sign In / Save Profile'}</span>
            </button>

            {userProfile.isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Log Out
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
