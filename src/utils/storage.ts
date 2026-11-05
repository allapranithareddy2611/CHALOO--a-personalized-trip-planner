import { ItineraryResult, UserProfile } from '../types/travel';

const TRIPS_STORAGE_KEY = 'chalo_saved_trips_v1';
const USER_PROFILE_KEY = 'chalo_user_profile_v1';
const RECENT_SEARCHES_KEY = 'chalo_recent_searches_v1';

export function getSavedTrips(): ItineraryResult[] {
  try {
    const data = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load saved trips from localStorage', e);
    return [];
  }
}

export function saveTrip(trip: ItineraryResult): boolean {
  try {
    const trips = getSavedTrips();
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.unshift(trip);
    }
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch (e) {
    console.error('Failed to save trip to localStorage', e);
    return false;
  }
}

export function deleteSavedTrip(id: string): boolean {
  try {
    const trips = getSavedTrips().filter(t => t.id !== id);
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch (e) {
    console.error('Failed to delete trip', e);
    return false;
  }
}

export function toggleFavoriteTrip(id: string): boolean {
  try {
    const trips = getSavedTrips();
    const trip = trips.find(t => t.id === id);
    if (trip) {
      trip.isFavorite = !trip.isFavorite;
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
      return trip.isFavorite;
    }
    return false;
  } catch (e) {
    console.error('Failed to toggle favorite', e);
    return false;
  }
}

export function getUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse user profile', e);
  }
  return {
    name: 'Traveler',
    email: 'traveler@chalo.in',
    homeCity: 'Bengaluru',
    favoritePace: 'Moderate',
    isLoggedIn: false
  };
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : ['Ooty', 'Goa', 'Manali', 'Munnar'];
  } catch {
    return ['Ooty', 'Goa', 'Manali', 'Munnar'];
  }
}

export function addRecentSearch(dest: string): void {
  try {
    const recents = getRecentSearches().filter(s => s.toLowerCase() !== dest.toLowerCase());
    recents.unshift(dest);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recents.slice(0, 8)));
  } catch {
    // Ignore error
  }
}

export function formatINR(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}
