export type Role = 'ADMIN' | 'PLAYER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export type EventType = 'golf_day' | 'fundraiser' | 'tournament' | 'other';

export interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CharityEvent {
  id: string;
  charity_id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: EventType;
  image_url: string | null;
  registration_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCharity {
  id: string;
  user_id: string;
  charity_id: string;
  allocation_perc: number;
  created_at: string;
  updated_at: string;
  charity?: Charity;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  stripe_prod_id: string;
  stripe_price_id: string;
  features: string[];
  minimal_charity_fee: number;
  duration: 'monthly' | 'yearly';
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  cancelled_at: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
