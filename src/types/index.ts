export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
}

export interface PriceOption {
  id: number;
  campaign_id: number;
  duration_seconds: number;
  price: number;
  is_active: boolean;
}

export interface Campaign {
  id: number;
  user_id: number;
  category_id: number;
  custom_title: string | null;
  is_active: boolean;
  is_unlimited: boolean;
  max_shoutouts: number | null;
  shoutouts_sold: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  priceOptions?: PriceOption[];
}

export interface ProfileData {
  user: User;
  campaigns: Campaign[];
  stats: {
    totalShoutouts: number;
    avgRating: number;
    responseTime: string;
  };
}