import React, { useState } from 'react';
import { Compass, MapPin, Calendar, Heart, User, Menu, X, Sparkles, Luggage } from 'lucide-react';
import { UserProfile } from '../types/travel';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedTripsCount: number;
  userProfile: UserProfile;
  onOpenAuth: () => void;
  onStartPlanning: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedTripsCount,
  userProfile,
  onOpenAuth,
  onStartPlanning
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Destinations' },
    { id: 'plan', label: 'Plan My Trip' },
    { id: 'my-trips', label: 'My Trips', badge: savedTripsCount > 0 ? savedTripsCount : null },
    { id: 'about', label: 'About Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight font-['Outfit'] bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                  CHALO
                </span>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] font-medium tracking-wider uppercase text-sky-400/90 -mt-0.5">
                Intelligent Travel Planner
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-sky-300 bg-sky-950/60 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                  {link.badge !== null && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-teal-500 text-slate-950 rounded-full animate-bounce">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onStartPlanning}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan My Trip</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 border border-slate-700/60"
              title={userProfile.isLoggedIn ? `Logged in as ${userProfile.name}` : 'Login / Sign Up'}
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-sky-400/30 flex items-center justify-center text-xs font-bold text-sky-400">
                {userProfile.isLoggedIn ? userProfile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="text-xs font-medium text-slate-300 hidden lg:inline">
                {userProfile.isLoggedIn ? userProfile.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('plan')}
              className="p-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/98 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-base font-medium ${
                activeTab === link.id
                  ? 'bg-sky-950/80 text-sky-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{link.label}</span>
              {link.badge !== null && (
                <span className="px-2 py-0.5 text-xs font-bold bg-teal-500 text-slate-950 rounded-full">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-sky-400" />
              <span>{userProfile.isLoggedIn ? `Account: ${userProfile.name}` : 'Login / Sign Up'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
