export type Role = 'ADMIN' | 'PLAYER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  charity_perc: number;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
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
