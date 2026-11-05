import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to sanitize & fallback generate realistic itineraries if offline/error
function generateRealisticFallbackItinerary(params: {
  destination: string;
  budget: number;
  days: number;
  travelers: string;
  travelersCount: number;
  interests: string[];
  pace: string;
  startDate?: string;
  endDate?: string;
}) {
  const { destination, budget, days, travelers, travelersCount, interests, pace } = params;

  const destLower = destination.toLowerCase();
  
  // Destination profiles for realistic Indian & global travel
  const profiles: Record<string, {
    vibe: string;
    highlights: string[];
    attractions: Array<{ name: string; desc: string; cost: number; time: string; travel: string }>;
    restaurants: Array<{ dish: string; spot: string; cost: number; meal: 'Breakfast' | 'Lunch' | 'Dinner' }>;
    stayAreas: Array<{ name: string; type: string; price: number; area: string }>;
    tips: string[];
  }> = {
    ooty: {
      vibe: "Queen of Hill Stations with misty tea plantations, colonial charm, and cool pine forests.",
      highlights: ["Botanical Gardens", "Doddabetta Peak", "Nilgiri Mountain Railway", "Pykara Lake", "Tea Museum"],
      attractions: [
        { name: "Government Botanical Garden", desc: "Walk through 55 acres of terraced exotic flora, Italian gardens, and fossilized trees.", cost: 50, time: "2-3 hrs", travel: "15 mins by auto" },
        { name: "Ooty Boat House & Lake", desc: "Enjoy calm pedal boating surrounded by eucalyptus trees followed by homemade chocolate tasting.", cost: 250, time: "2 hrs", travel: "20 mins" },
        { name: "Doddabetta Peak & Telescope House", desc: "Highest vantage point in the Nilgiris offering panoramic views of the Western Ghats.", cost: 40, time: "2 hrs", travel: "35 mins scenic drive" },
        { name: "Tea Factory & Chocolate Museum", desc: "Witness authentic CTC tea processing, fresh tea sampling, and artisan chocolate making.", cost: 30, time: "1.5 hrs", travel: "15 mins" },
        { name: "Pykara Waterfalls & Speedboat", desc: "Pristine lake waters flanked by shola forests with thrilling speedboating.", cost: 350, time: "3 hrs", travel: "45 mins" },
        { name: "Rose Garden (Government Rose Park)", desc: "India's largest rose garden showcasing over 20,000 varieties of vibrant blooms.", cost: 60, time: "1.5 hrs", travel: "15 mins" },
        { name: "St. Stephen's Church & Heritage Walk", desc: "19th century British colonial architecture with stained glass and peaceful surroundings.", cost: 0, time: "1 hr", travel: "10 mins" },
      ],
      restaurants: [
        { dish: "Authentic South Indian Filter Coffee & Crispy Ghee Roast Dosa", spot: "Nahar's Sidewalk Café", cost: 180, meal: "Breakfast" },
        { dish: "Nilgiri Mutton / Veg Biryani with Vada Curry", spot: "Earl's Secret at King's Cliff", cost: 450, meal: "Lunch" },
        { dish: "Wood-fired Pizza & Hot Chocolate", spot: "Place To Bee", cost: 400, meal: "Dinner" },
        { dish: "Idli Vada dipped in Sambar & Masala Chai", spot: "Adyar Ananda Bhavan (A2B) Charing Cross", cost: 150, meal: "Breakfast" },
        { dish: "Fresh Homemade Chocolates & Cardamom Tea", spot: "King Star Confectionery", cost: 200, meal: "Lunch" },
        { dish: "Traditional Thali & Chettinad Spices", spot: "Shinkows Chinese or Hotel Junior Kuppanna", cost: 380, meal: "Dinner" },
      ],
      stayAreas: [
        { name: "Sinclairs Retreat Ooty", type: "Panoramic Mountain Resort", price: 3800, area: "Gorishola Road" },
        { name: "King's Cliff Heritage Mansion", type: "Colonial Heritage Hotel", price: 4200, area: "Havelock Road" },
        { name: "Zostel Ooty or Pine Homestay", type: "Budget Boutique Stay", price: 1600, area: "Fern Hill" },
      ],
      tips: [
        "Carry light woolens even during summer as evenings get breezy.",
        "Pre-book Nilgiri Mountain Toy Train tickets on IRCTC well in advance.",
        "Purchase authentic Toda embroidery and eucalyptus oil from Co-optex."
      ]
    },
    goa: {
      vibe: "Sun-kissed coastline, Portuguese heritage architecture, vibrant beach shacks, and seafood bliss.",
      highlights: ["Anjuna & Vagator Beaches", "Basilica of Bom Jesus", "Fontainhas Latin Quarter", "Dudhsagar Falls", "Chapora Fort"],
      attractions: [
        { name: "Fontainhas Latin Quarter Heritage Walk", desc: "Vibrant yellow and blue Portuguese cottages, art galleries, and quaint bakeries.", cost: 0, time: "2 hrs", travel: "15 mins" },
        { name: "Basilica of Bom Jesus & Old Goa Churches", desc: "UNESCO World Heritage site preserving Baroque art and the sacred remains of St. Francis Xavier.", cost: 0, time: "2.5 hrs", travel: "25 mins" },
        { name: "Chapora Fort Sunset Vista", desc: "Famous clifftop bastion overlooking the Arabian Sea and Vagator sands.", cost: 0, time: "1.5 hrs", travel: "30 mins" },
        { name: "Morjim Beach & Olive Ridley Turtle Sanctuary", desc: "Quiet golden beach ideal for peaceful strolls and watching coastal birdlife.", cost: 0, time: "3 hrs", travel: "25 mins" },
        { name: "Anjuna Flea Market & Beach Shack Chill", desc: "Eclectic shopping, live acoustic tunes, and coconut water under palm fronds.", cost: 150, time: "2.5 hrs", travel: "20 mins" },
        { name: "Mandovi River Sunset Cruise", desc: "Evening boat cruise with traditional Goan folk dances and scenic riverfront vistas.", cost: 500, time: "1.5 hrs", travel: "20 mins" },
      ],
      restaurants: [
        { dish: "Poi with Mushroom Xacuti or Goan Chorizo Pao", spot: "Café Bodega or Confeitaria 31 De Janeiro", cost: 220, meal: "Breakfast" },
        { dish: "Kingfish Rava Fry & Traditional Fish Thali", spot: "Vinayak Family Restaurant, Assagao", cost: 350, meal: "Lunch" },
        { dish: "Prawn Balchão & Bebinca with Kokum Soda", spot: "Fisherman's Wharf, Panjim", cost: 650, meal: "Dinner" },
        { dish: "Avocado Toast & Smoothie Bowls", spot: "Artjuna Garden Café", cost: 320, meal: "Breakfast" },
        { dish: "Wood-fired Goan Sausage Pizza & Craft Feni Cocktails", spot: "Joseph Bar / Gunpowder", cost: 600, meal: "Dinner" },
      ],
      stayAreas: [
        { name: "Casa Baga Boutique Stay", type: "Chic Coastal Hotel", price: 3200, area: "North Goa" },
        { name: "Heritage Panjim Pousada", type: "Colonial Townhouse", price: 2800, area: "Fontainhas" },
        { name: "Agonda Beachfront Eco Huts", type: "Relaxed Beach Cottages", price: 2400, area: "South Goa" },
      ],
      tips: [
        "Rent a certified scooter or self-drive car with helmets for affordable local travel.",
        "Keep cash handy for beach shacks and entry into smaller heritage sights."
      ]
    },
    manali: {
      vibe: "Snow-capped Himalayan peaks, apple orchards, soothing hot springs, and river adventure.",
      highlights: ["Solang Valley", "Hadimba Devi Temple", "Old Manali Cafés", "Atal Tunnel", "Jogini Waterfalls"],
      attractions: [
        { name: "Hadimba Temple & Cedar Forest", desc: "Ancient 16th-century wooden pagoda temple tucked inside towering deodar woods.", cost: 50, time: "2 hrs", travel: "15 mins" },
        { name: "Old Manali Hippie Trail & Vashisht Hot Springs", desc: "Artisan cafes, wooden bridges, and natural thermal sulfur baths with curative properties.", cost: 0, time: "3 hrs", travel: "20 mins" },
        { name: "Solang Valley Adventure Hub", desc: "Ziplining, paragliding, zorbing, and breathtaking vistas of glaciers.", cost: 1200, time: "4 hrs", travel: "45 mins" },
        { name: "Jogini Waterfall Short Trek", desc: "Scenic nature trail passing apple orchards leading to cascading mountain waters.", cost: 0, time: "3 hrs", travel: "25 mins" },
        { name: "Atal Tunnel & Sissu Valley Excursion", desc: "Drive through engineering marvel into Lahaul's otherworldly landscape.", cost: 800, time: "5 hrs", travel: "1.5 hrs" },
      ],
      restaurants: [
        { dish: "Siddu with Pure Ghee & Walnut Chutney", spot: "The Johnson's Café", cost: 250, meal: "Lunch" },
        { dish: "Trout Fish Sautéed in Garlic Butter", spot: "Lazy Dog Lounge, Old Manali", cost: 480, meal: "Dinner" },
        { dish: "Steaming Tibetan Thukpa & Momos", spot: "Chopsticks Restaurant Mall Road", cost: 180, meal: "Lunch" },
        { dish: "Himalayan Herbal Tea & Fresh Apple Pie", spot: "Café 1947", cost: 260, meal: "Breakfast" },
      ],
      stayAreas: [
        { name: "The Whispering Pines Resort", type: "Mountain View Cottage", price: 3400, area: "Old Manali" },
        { name: "Apple Blossom Luxury Homestay", type: "Valley Orchard Villa", price: 2600, area: "Vashisht" },
      ],
      tips: [
        "Check weather & Atal tunnel permit conditions before heading towards Sissu.",
        "Wear sturdy hiking shoes for Jogini and Old Manali pebble paths."
      ]
    },
    munnar: {
      vibe: "Endless rolling emerald tea plantations, cool mist, spice aromas, and Western Ghats wildlife.",
      highlights: ["Eravikulam National Park", "Mattupetty Dam", "Kolukkumalai Sunrise", "Tea Museum", "Kundala Lake"],
      attractions: [
        { name: "Eravikulam National Park (Rajamalai)", desc: "Spot the rare Nilgiri Tahr against panoramic hill backdrop.", cost: 200, time: "3 hrs", travel: "30 mins" },
        { name: "KDHP Tea Museum & Factory", desc: "Discover centuries-old tea manufacturing processes and savor fresh black teas.", cost: 125, time: "2 hrs", travel: "15 mins" },
        { name: "Mattupetty Dam & Echo Point", desc: "Serene reservoir surrounded by tea gardens with speedboating options.", cost: 300, time: "2.5 hrs", travel: "40 mins" },
        { name: "Top Station Border View", desc: "Historic highest point offering dizzying valley views of Tamil Nadu plains.", cost: 50, time: "3 hrs", travel: "1 hr" },
      ],
      restaurants: [
        { dish: "Kerala Appam with Vegetable Stew & Malabar Parotta", spot: "Rapsy Restaurant Munnar Town", cost: 160, meal: "Breakfast" },
        { dish: "Traditional Sadhya on Banana Leaf", spot: "Saravana Bhavan Munnar", cost: 220, meal: "Lunch" },
        { dish: "Kerala Spiced Chicken / Paneer Roast", spot: "Copper Castle Restaurant", cost: 380, meal: "Dinner" },
      ],
      stayAreas: [
        { name: "Tea Valley Resort", type: "Plantation Cottage", price: 3200, area: "Pothamedu" },
        { name: "Misty Mountain Homestay", type: "Valley View Chalet", price: 2100, area: "Chithirapuram" },
      ],
      tips: [
        "Early morning is the best time for Eravikulam Park to avoid long queues.",
        "Buy authentic vacuum-sealed black tea and cardamom pods directly from tea counters."
      ]
    },
    jaipur: {
      vibe: "The Pink City: royal Rajput palaces, majestic amber forts, bazaar handicrafts, and rich royal food.",
      highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort Sunset"],
      attractions: [
        { name: "Amber Palace & Sheesh Mahal", desc: "Grand hilltop fortress famous for ornate mirror mosaics and sweeping maota lake views.", cost: 100, time: "3 hrs", travel: "35 mins" },
        { name: "Hawa Mahal (Palace of Winds)", desc: "Iconic five-story pink sandstone facade with 953 intricate jharokhas.", cost: 50, time: "1 hr", travel: "15 mins" },
        { name: "City Palace & Royal Observatory Jantar Mantar", desc: "Museum of royal regalia, courtyards, and astronomical masonry instruments.", cost: 300, time: "2.5 hrs", travel: "10 mins" },
        { name: "Nahargarh Fort Sunset Point", desc: "Watch the golden sun dip over the Jaipur skyline while sipping chilled drinks.", cost: 50, time: "2 hrs", travel: "30 mins" },
        { name: "Johari & Bapu Bazaar Shopping", desc: "Authentic Jaipuri quilts (Razai), blue pottery, block print textiles, and lac bangles.", cost: 0, time: "2.5 hrs", travel: "15 mins" },
      ],
      restaurants: [
        { dish: "Pyaaz Kachori & Creamy Lassi", spot: "Rawat Mishthan Bhandar", cost: 120, meal: "Breakfast" },
        { dish: "Authentic Dal Baati Churma & Gatte Ki Sabzi", spot: "LMB (Laxmi Mishthan Bhandar) Johari Bazaar", cost: 420, meal: "Lunch" },
        { dish: "Laal Maas / Ker Sangri with Bajre Ki Roti", spot: "1135 AD at Amber or Spice Court", cost: 650, meal: "Dinner" },
      ],
      stayAreas: [
        { name: "Alsisar Haveli", type: "Heritage Haveli Stay", price: 4200, area: "Sansar Chandra Road" },
        { name: "Umaid Bhawan Heritage House", type: "Boutique Heritage Hotel", price: 2800, area: "Bani Park" },
      ],
      tips: [
        "Buy the composite ticket covering Amber, Hawa Mahal, Nahargarh, and Jantar Mantar for substantial savings.",
        "Evenings in bazaars can get crowded; bargaining with a smile is customary."
      ]
    }
  };

  // Find match or generate intelligent profile
  const profileKey = Object.keys(profiles).find(k => destLower.includes(k));
  const activeProfile = profileKey ? profiles[profileKey] : {
    vibe: `Captivating journeys through ${destination}, filled with iconic landmarks, culinary treats, and cultural discoveries.`,
    highlights: [`Historic City Center`, `Iconic Landmarks of ${destination}`, `Scenic Viewpoints`, `Artisanal Craft Markets`, `Local Culinary Crawl`],
    attractions: [
      { name: `Central Heritage Promenade of ${destination}`, desc: `Experience the historic core, architecture, and lively public squares.`, cost: 100, time: "2.5 hrs", travel: "15 mins" },
      { name: `Panoramic Hilltop & Sunset Lookout`, desc: `Soak in sweeping scenic viewpoints overlooking the entire valley and townscape.`, cost: 50, time: "2 hrs", travel: "25 mins" },
      { name: `Regional Culture & Art Discovery Center`, desc: `Dive deep into traditional history, exhibitions, and indigenous handicrafts.`, cost: 150, time: "2 hrs", travel: "20 mins" },
      { name: `Botanical Nature Reserve & Serene Lake`, desc: `Peaceful nature trails, lush flora, and relaxing boat or shoreline leisure.`, cost: 80, time: "2 hrs", travel: "20 mins" },
      { name: `Historic Old Bazaar & Spice Market`, desc: `Vibrant lanes filled with authentic souvenirs, traditional fabrics, and street vendors.`, cost: 0, time: "2.5 hrs", travel: "15 mins" },
      { name: `Local Riverside / Valley Excursion`, desc: `Take a picturesque day excursion to nearby tranquil waterways and pristine trails.`, cost: 200, time: "3.5 hrs", travel: "40 mins" },
    ],
    restaurants: [
      { dish: `Signature Regional Morning Breakfast & Hot Beverage`, spot: `Old Town Traditional Eatery`, cost: 150, meal: "Breakfast" },
      { dish: `Authentic Chef's Special Thali & Local Specialties`, spot: `Heritage Courtyard Restaurant`, cost: 350, meal: "Lunch" },
      { dish: `Gourmet Sunset Dinner with Local Flavors`, spot: `Rooftop Terrace Overlook`, cost: 550, meal: "Dinner" },
      { dish: `Artisanal Pastries & Fresh Fruit Infusions`, spot: `Corner Bohemian Café`, cost: 200, meal: "Breakfast" },
      { dish: `Famous Street-Side Snack & Savory Platters`, spot: `Central Food Street`, cost: 180, meal: "Lunch" },
    ],
    stayAreas: [
      { name: `${destination} Central Heritage Lodge`, type: "Boutique Heritage Hotel", price: 2900, area: "City Center" },
      { name: `Scenic Viewpoint Retreat`, type: "Eco Resort & Spa", price: 3800, area: "Hillside Promenade" },
      { name: `Cozy Travelers Haven`, type: "Comfort Homestay", price: 1800, area: "Old Town" },
    ],
    tips: [
      `Start early in the morning to beat tourist rush at primary attractions.`,
      `Always keep cash on hand for street snacks and local auto-rickshaws.`,
      `Ask locals for their preferred regional delicacies to find hidden culinary gems.`
    ]
  };

  // Build day by day itinerary
  const generatedDays = [];
  const numDays = Math.max(1, Math.min(days, 14));

  // Determine budget allocations based on input
  const perPersonTarget = Math.max(1000, Math.round(budget / Math.max(1, travelersCount)));
  const stayCostPerNight = Math.min(Math.round(perPersonTarget * 0.35), activeProfile.stayAreas[0].price);
  const foodDaily = Math.round(perPersonTarget * 0.25 / numDays);
  const transitDaily = Math.round(perPersonTarget * 0.20 / numDays);
  const activityDaily = Math.round(perPersonTarget * 0.15 / numDays);

  let totalTransport = 0;
  let totalStay = 0;
  let totalFood = 0;
  let totalActivities = 0;
  let totalMisc = 0;

  for (let i = 1; i <= numDays; i++) {
    const attrIdx1 = (i * 2 - 2) % activeProfile.attractions.length;
    const attrIdx2 = (i * 2 - 1) % activeProfile.attractions.length;
    const attrIdx3 = (i * 2) % activeProfile.attractions.length;

    const mAttr = activeProfile.attractions[attrIdx1];
    const aAttr = activeProfile.attractions[attrIdx2];
    const eAttr = activeProfile.attractions[attrIdx3];

    const bMeal = activeProfile.restaurants.find(r => r.meal === 'Breakfast') || activeProfile.restaurants[0];
    const lMeal = activeProfile.restaurants.find(r => r.meal === 'Lunch') || activeProfile.restaurants[1 % activeProfile.restaurants.length];
    const dMeal = activeProfile.restaurants.find(r => r.meal === 'Dinner') || activeProfile.restaurants[2 % activeProfile.restaurants.length];

    const stay = activeProfile.stayAreas[(i - 1) % activeProfile.stayAreas.length];

    const dayTransport = Math.max(250, transitDaily);
    const dayFood = (bMeal.cost + lMeal.cost + dMeal.cost) * travelersCount;
    const dayActivity = (mAttr.cost + aAttr.cost + eAttr.cost) * travelersCount;
    const dayStay = i < numDays ? stayCostPerNight : 0; // last day check out

    totalTransport += dayTransport;
    totalFood += dayFood;
    totalActivities += dayActivity;
    totalStay += dayStay;
    totalMisc += 150 * travelersCount;

    let dayTheme = i === 1 
      ? `Arrival & Essence of ${destination}`
      : i === numDays
      ? `Souvenirs, Panoramic Views & Fond Farewell`
      : `Deep Cultural Immersion & Scenic Trails`;

    if (interests.length > 0) {
      const interestTag = interests[(i - 1) % interests.length];
      dayTheme = `Day ${i} – ${interestTag} & Highlights of ${destination}`;
    }

    generatedDays.push({
      dayNumber: i,
      theme: dayTheme,
      overview: `A carefully paced day balancing ${pace.toLowerCase()} exploration, local tastings, and unforgettable vistas around ${destination}.`,
      morning: {
        activity: mAttr.name,
        location: `${destination} - Central`,
        description: mAttr.desc,
        estimatedCost: mAttr.cost * travelersCount,
        estimatedTime: mAttr.time,
        travelTimeNext: mAttr.travel,
        tips: "Arrive right around opening time for soft morning light and calm crowds."
      },
      afternoon: {
        activity: aAttr.name,
        location: `${destination} - Scenic Outskirts`,
        description: aAttr.desc,
        estimatedCost: aAttr.cost * travelersCount,
        estimatedTime: aAttr.time,
        travelTimeNext: aAttr.travel,
        tips: "Stay hydrated and carry sunglasses or a sunhat."
      },
      evening: {
        activity: eAttr.name,
        location: `${destination} - Old Bazaar & Promenades`,
        description: eAttr.desc,
        estimatedCost: eAttr.cost * travelersCount,
        estimatedTime: eAttr.time,
        travelTimeNext: "15 mins back to stay",
        tips: "Perfect hour for capturing golden hour photos and savoring local snacks."
      },
      suggestedStay: {
        name: stay.name,
        type: stay.type,
        area: stay.area,
        estimatedPricePerNight: stay.price,
        whyRecommended: "Centrally positioned with great customer reviews, scenic views, and easy transport connectivity."
      },
      recommendedFood: [
        { mealType: 'Breakfast', dish: bMeal.dish, restaurant: bMeal.spot, approxCost: bMeal.cost * travelersCount, isLocalSpecialty: true },
        { mealType: 'Lunch', dish: lMeal.dish, restaurant: lMeal.spot, approxCost: lMeal.cost * travelersCount, isLocalSpecialty: true },
        { mealType: 'Dinner', dish: dMeal.dish, restaurant: dMeal.spot, approxCost: dMeal.cost * travelersCount, isLocalSpecialty: true },
      ],
      travelTips: [
        `Local transport: Shared cabs or rented scooters provide the best value in ${destination}.`,
        activeProfile.tips[(i - 1) % activeProfile.tips.length] || "Keep an emergency powerbank and basic medicine kit handy."
      ]
    });
  }

  const grandTotal = totalTransport + totalStay + totalFood + totalActivities + totalMisc;
  const remaining = budget - grandTotal;
  const status = remaining >= 0 ? "within_budget" : (Math.abs(remaining) <= budget * 0.15 ? "stretched" : "exceeded");

  return {
    tripTitle: `${numDays}-Day ${pace} Explorer: The Best of ${destination}`,
    destination,
    summary: `Welcome to your custom CHALO travel blueprint for ${destination}. Crafted for ${travelers.toLowerCase()} seeking a ${pace.toLowerCase()} pace, this itinerary balances iconic sightseeing, local gastronomy, and immersive heritage without rush.`,
    totalEstimatedCost: grandTotal,
    budget,
    costPerPerson: Math.round(grandTotal / Math.max(1, travelersCount)),
    remainingBudget: remaining,
    budgetStatus: status,
    budgetBreakdown: {
      transportation: totalTransport,
      accommodation: totalStay,
      food: totalFood,
      activities: totalActivities,
      miscellaneous: totalMisc,
      notes: "Estimates calculated for all travelers based on typical seasonal rates, entrance fees, and popular eateries."
    },
    days: generatedDays,
    packingAndWeatherAdvice: [
      "Comfortable walking shoes with good grip for cobbled streets and gentle trails.",
      "Reusable water bottle to stay refreshed and reduce plastic waste.",
      "Appropriate seasonal attire (layers for hill stations, breathable cottons for coastal plains).",
      "Powerbank and compact daypack for daily sightseeing essentials."
    ],
    importantDisclaimers: [
      "All prices, entry tickets, and restaurant hours are estimates based on standard season rates and should be verified on-site.",
      "Transportation times may vary depending on local weather and peak traffic conditions."
    ]
  };
}

// Gemini AI Itinerary API Route
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const {
      destination,
      budget = 20000,
      days = 3,
      startDate = '',
      endDate = '',
      travelers = '2 people',
      travelersCount = 2,
      interests = ['Nature and landscapes', 'Food and restaurants'],
      pace = 'Moderate',
      specialNotes = ''
    } = req.body;

    if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const cleanDest = destination.trim();
    const cleanDays = Math.max(1, Math.min(Number(days) || 3, 14));
    const cleanBudget = Math.max(1000, Number(budget) || 20000);
    const cleanTravelersCount = Math.max(1, Number(travelersCount) || 2);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('No GEMINI_API_KEY found in environment. Generating high-fidelity curated itinerary.');
      const fallback = generateRealisticFallbackItinerary({
        destination: cleanDest,
        budget: cleanBudget,
        days: cleanDays,
        travelers,
        travelersCount: cleanTravelersCount,
        interests,
        pace,
        startDate,
        endDate
      });
      return res.json({ ...fallback, generatedBy: 'curated-engine' });
    }

    // Call Gemini with the official @google/genai SDK
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
You are the lead travel planning AI for CHALO, an intelligent travel-planning platform in India.
Generate a comprehensive, realistic, day-by-day travel itinerary for:
- Destination: ${cleanDest}
- Total Budget for the entire trip: ₹${cleanBudget.toLocaleString('en-IN')} (Indian Rupees)
- Trip Duration: ${cleanDays} day(s) ${startDate && endDate ? `(${startDate} to ${endDate})` : ''}
- Number of Travelers: ${travelers} (${cleanTravelersCount} person/people)
- Travel Interests: ${interests.join(', ') || 'General Sightseeing'}
- Travel Pace: ${pace} (${pace === 'Relaxed' ? 'fewer activities with ample free time' : pace === 'Packed' ? 'high energy, see as many top sights as possible' : 'balanced sightseeing and relaxation'})
${specialNotes ? `- Additional traveler preferences: ${specialNotes}` : ''}

Strict Requirements:
1. Provide authentic, actual tourist attractions, viewpoints, and monuments specific to "${cleanDest}".
2. Recommend real, famous restaurants, cafes, and iconic regional dishes to try (e.g. filter coffee, local thalis, coastal seafood, street snacks, etc.).
3. Recommend realistic accommodation types (e.g., heritage havelis, boutique resorts, homestays, or city center hotels) with approximate cost per night.
4. Estimate realistic costs in Indian Rupees (₹) for activities, food, local transport, and lodging for ${cleanTravelersCount} traveler(s).
5. Compare total estimated cost with the user's budget of ₹${cleanBudget}. If the budget is tight, recommend budget-friendly alternatives and clearly state if it is within budget, stretched, or exceeded.
6. Provide travel time estimates between consecutive locations.
7. Return strictly valid JSON adhering to this exact structure:

{
  "tripTitle": "Catchy headline for the trip",
  "destination": "${cleanDest}",
  "summary": "1-2 paragraphs highlighting the trip essence, best vibes, and pace alignment.",
  "totalEstimatedCost": number (in INR),
  "budget": ${cleanBudget},
  "costPerPerson": number (in INR),
  "remainingBudget": number (in INR, can be negative if exceeded),
  "budgetStatus": "within_budget" | "stretched" | "exceeded",
  "budgetBreakdown": {
    "transportation": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "miscellaneous": number,
    "notes": "Short note about budget management"
  },
  "days": [
    {
      "dayNumber": 1,
      "theme": "Catchy theme for Day 1",
      "overview": "Summary of today's pace and experiences",
      "morning": {
        "activity": "Morning attraction name",
        "location": "Specific area or landmark",
        "description": "Engaging description of what to do and see",
        "estimatedCost": number (INR for all travelers),
        "estimatedTime": "e.g. 2 hours",
        "travelTimeNext": "e.g. 20 mins by auto/taxi",
        "tips": "Pro tip for this spot"
      },
      "afternoon": {
        "activity": "Afternoon attraction name",
        "location": "Specific area",
        "description": "Engaging description",
        "estimatedCost": number,
        "estimatedTime": "e.g. 2.5 hours",
        "travelTimeNext": "e.g. 15 mins",
        "tips": "Pro tip"
      },
      "evening": {
        "activity": "Evening attraction or market name",
        "location": "Specific area",
        "description": "Engaging description",
        "estimatedCost": number,
        "estimatedTime": "e.g. 2 hours",
        "travelTimeNext": "e.g. 15 mins back to stay",
        "tips": "Pro tip"
      },
      "suggestedStay": {
        "name": "Recommended stay or hotel type",
        "type": "e.g. Boutique Tea Estate Villa / Centrally Located 3-Star Hotel",
        "area": "Best neighborhood to stay in",
        "estimatedPricePerNight": number (INR),
        "whyRecommended": "Why this area suits their pace and budget"
      },
      "recommendedFood": [
        {
          "mealType": "Breakfast",
          "dish": "Dish name",
          "restaurant": "Known restaurant or cafe",
          "approxCost": number (INR total for group),
          "isLocalSpecialty": true
        },
        {
          "mealType": "Lunch",
          "dish": "Dish name",
          "restaurant": "Known restaurant",
          "approxCost": number,
          "isLocalSpecialty": true
        },
        {
          "mealType": "Dinner",
          "dish": "Dish name",
          "restaurant": "Known restaurant",
          "approxCost": number,
          "isLocalSpecialty": true
        }
      ],
      "travelTips": [
        "Practical tip 1 for today",
        "Practical tip 2 for today"
      ]
    }
  ],
  "packingAndWeatherAdvice": [
    "Item or climate advice 1",
    "Item or climate advice 2"
  ],
  "importantDisclaimers": [
    "Prices are estimates and subject to seasonal variations and availability.",
    "Verify opening hours and ticket booking requirements in advance."
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    let parsedData;

    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Direct JSON parse failed, attempting regex cleanup:', parseErr);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON response from Gemini');
      }
    }

    return res.json({ ...parsedData, generatedBy: 'gemini-3.8-flash' });

  } catch (error: any) {
    console.error('Error generating itinerary with Gemini:', error);
    // Graceful fallback to avoid breaking the user experience
    const cleanDest = req.body.destination || 'India';
    const cleanBudget = Number(req.body.budget) || 20000;
    const cleanDays = Number(req.body.days) || 3;
    const travelers = req.body.travelers || '2 people';
    const travelersCount = Number(req.body.travelersCount) || 2;
    const interests = req.body.interests || ['Nature and landscapes'];
    const pace = req.body.pace || 'Moderate';

    const fallback = generateRealisticFallbackItinerary({
      destination: cleanDest,
      budget: cleanBudget,
      days: cleanDays,
      travelers,
      travelersCount,
      interests,
      pace,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    return res.json({
      ...fallback,
      generatedBy: 'curated-fallback',
      notice: 'Generated using CHALO curated travel intelligence.'
    });
  }
});

// Vite server integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CHALO Travel Platform Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
