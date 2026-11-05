import React from 'react';
import { Compass, Sparkles, Heart, MapPin, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onSelectDestination: (destName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectDestination }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 text-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-400 to-cyan-300 flex items-center justify-center text-slate-950">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black font-['Outfit'] text-white tracking-tight">
                CHALO
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              CHALO is an intelligent travel-planning platform generating personalized day-wise itineraries, itemized budget breakdowns in Indian Rupees (₹), and curated dining & stay recommendations.
            </p>

            <p className="text-[11px] font-semibold text-sky-400">
              Less Planning. More Exploring.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-white transition-colors">
                  Plan My Trip
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-trips')} className="hover:text-white transition-colors">
                  My Saved Trips
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Us & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Trending Destinations
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Ooty', 'Goa', 'Manali', 'Munnar', 'Jaipur', 'Hyderabad', 'Coorg', 'Kerala'].map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectDestination(city)}
                  className="text-left hover:text-sky-400 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              AI & Budget Transparency
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Google Gemini 3.8 Flash. All estimates are calculated to respect user budgets with authentic local sights and regional cuisine.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Verify opening hours and seasonal room tariffs before traveling.</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CHALO Travel Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with passion for curious travelers across India & beyond</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
