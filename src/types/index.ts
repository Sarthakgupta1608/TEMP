export type PageRoute = 
  | 'home' 
  | 'about' 
  | 'contact' 
  | 'blog' 
  | 'packages' 
  | 'destinations' 
  | 'become-agency' 
  | 'ai-planner' 
  | 'compare-quotes' 
  | 'login' 
  | 'signup'
  | 'traveller-dashboard'
  | 'agency-dashboard'
  | 'admin-panel';

export type TravellerTab = 
  | 'dashboard'
  | 'trips'
  | 'requests'
  | 'ai-planner'
  | 'wishlist'
  | 'bookings'
  | 'payments'
  | 'messages'
  | 'notifications'
  | 'reviews'
  | 'settings';

export type AgencyTab = 
  | 'overview'
  | 'kyc'
  | 'leads'
  | 'create-quote'
  | 'bookings'
  | 'wallet'
  | 'reviews'
  | 'settings';

export type AdminTab = 
  | 'overview'
  | 'verify-agencies'
  | 'users'
  | 'bookings-escrow'
  | 'reports';

export interface DestinationItem {
  id: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  heroImage: string;
  packageCount: number;
  agencyCount: number;
  startingPrice: number;
  popularActivities: string[];
  bestTimeToVisit: string;
  rating: number;
}

export interface PackageItem {
  id: string;
  title: string;
  agencyName: string;
  agencyLogo: string;
  agencyRating: number;
  agencyReviews: number;
  destination: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  originalPrice?: number;
  coverImage: string;
  highlights: string[];
  includedAccommodations: string;
  includedMeals: string;
  transportType: string;
  isFeatured?: boolean;
}

export interface QuoteItem {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyLogo: string;
  agencyRating: number;
  agencyReviews: number;
  verifiedLocal: boolean;
  totalPrice: number;
  pricePerPerson: number;
  hotelCategory: string;
  hotelNames: string[];
  vehicleType: string;
  includedMeals: string[];
  includedActivities: string[];
  excludedItems: string[];
  cancellationPolicy: string;
  aiMatchScore: number;
  aiRecommendationReason: string;
  itinerary: { day: number; title: string; desc: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  tripName: string;
  agencyBooked: string;
  quoteSaved: string;
  rating: number;
  comment: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'travellers' | 'agencies' | 'payments' | 'ai';
}
