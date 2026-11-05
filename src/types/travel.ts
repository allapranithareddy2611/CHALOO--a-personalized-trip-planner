export interface DayActivity {
  activity: string;
  location: string;
  description: string;
  estimatedCost: number;
  estimatedTime: string;
  travelTimeNext: string;
  tips?: string;
}

export interface SuggestedStay {
  name: string;
  type: string;
  area: string;
  estimatedPricePerNight: number;
  whyRecommended: string;
}

export interface RecommendedFood {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  dish: string;
  restaurant: string;
  approxCost: number;
  isLocalSpecialty: boolean;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  overview: string;
  morning: DayActivity;
  afternoon: DayActivity;
  evening: DayActivity;
  suggestedStay: SuggestedStay;
  recommendedFood: RecommendedFood[];
  travelTips: string[];
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  notes?: string;
}

export interface ItineraryResult {
  id: string;
  createdAt: string;
  tripTitle: string;
  destination: string;
  summary: string;
  totalEstimatedCost: number;
  budget: number;
  costPerPerson: number;
  remainingBudget: number;
  budgetStatus: 'within_budget' | 'stretched' | 'exceeded';
  budgetBreakdown: BudgetBreakdown;
  days: DayPlan[];
  packingAndWeatherAdvice: string[];
  importantDisclaimers: string[];
  travelers: string;
  travelersCount: number;
  pace: 'Relaxed' | 'Moderate' | 'Packed';
  interests: string[];
  startDate?: string;
  endDate?: string;
  specialNotes?: string;
  isFavorite?: boolean;
  generatedBy?: string;
}

export interface ItineraryFormData {
  destination: string;
  budget: number;
  budgetTier: string;
  days: number;
  startDate: string;
  endDate: string;
  travelers: string;
  travelersCount: number;
  interests: string[];
  pace: 'Relaxed' | 'Moderate' | 'Packed';
  specialNotes?: string;
}

export interface DestinationInfo {
  id: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  image: string;
  category: 'Hills' | 'Beach' | 'Heritage' | 'Nature' | 'Spiritual' | 'City' | 'Adventure';
  estimatedBudget: string;
  budgetNumber: number;
  recommendedDays: number;
  bestExperiences: string[];
  bestSeason: string;
  highlights: string[];
  localFood: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  homeCity: string;
  favoritePace: 'Relaxed' | 'Moderate' | 'Packed';
  isLoggedIn: boolean;
}
