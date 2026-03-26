import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
}

/**
 * Stripe singleton instance.
 * Initialized once and reused across API routes to optimize connection reuse.
 * We use the latest API version as required by our tech stack.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-03-25.dahlia', // Using latest required version from lint
  typescript: true,
});
