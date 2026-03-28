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
  supporters?: { count: number }[];
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

export type DrawMode = 'random' | 'weighted_common' | 'weighted_rare';
export type DrawStatus = 'draft' | 'simulated' | 'published';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid';

export interface Draw {
  id: string;
  draw_date: string;
  drawn_numbers: number[];
  draw_mode: DrawMode;
  status: DrawStatus;
  total_prize_pool_pence: number;
  jackpot_pool_pence: number;
  tier2_pool_pence: number;
  tier3_pool_pence: number;
  jackpot_carried_over: boolean;
  carried_over_amount_pence: number;
  created_by: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  scores_snapshot: number[];
  matched_numbers: number[];
  match_count: number;
  prize_amount_pence: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface JackpotRollover {
  id: string;
  from_draw_id: string;
  to_draw_id: string | null;
  amount_pence: number;
  created_at: string;
}

export interface DrawSimulationResult {
  draw_id: string;
  drawn_numbers: number[];
  draw_mode: DrawMode;
  total_prize_pool_pence: number;
  jackpot_pool_pence: number;
  tier2_pool_pence: number;
  tier3_pool_pence: number;
  carried_over_amount_pence: number;
  winner_counts: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  total_eligible_users: number;
  top_winners: {
    user_id: string;
    name: string;
    match_count: number;
    prize_amount_pence: number;
  }[];
}

export type VerificationStatus = 'awaiting_proof' | 'proof_submitted' | 'approved' | 'rejected' | 'paid';

export interface WinnerVerification {
  id: string;
  draw_entry_id: string;
  user_id: string;
  proof_url: string | null;
  proof_uploaded_at: string | null;
  status: VerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  payout_reference: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  draw_entry?: DrawEntry;
  draw?: Draw;
  user?: User;
}
