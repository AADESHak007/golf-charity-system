import { stripe } from '@/lib/stripe/client';
import { supabaseServiceRole } from '@/lib/supabase/service';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text(); // CRITICAL: raw body required for signature verification
  const sig = (await headers()).get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Stripe signature or endpoint secret is missing');
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    logger.error(`Webhook signature error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {

      /**
       * Fired when customer completes Stripe Checkout.
       * We use the session metadata to link user → plan → subscription.
       * The invoice period_start/period_end on the session are the canonical
       * billing cycle dates in the new Stripe SDK (current_period_* was removed).
       */
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, planId } = session.metadata || {};

        // session.subscription is a string ID in checkout mode
        const stripe_subscription_id = session.subscription as string | null;

        if (userId && planId && stripe_subscription_id) {
          // Retrieve the subscription to get the first invoice's period dates
          // We expand the latest_invoice so we can read period_start/period_end
          const subscription = await stripe.subscriptions.retrieve(
            stripe_subscription_id,
            { expand: ['latest_invoice'] }
          );

          const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;

          await supabaseServiceRole
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan_id: planId,
              stripe_subscription_id,
              status: 'active',
              // Use invoice period dates — the canonical source of truth in new SDK
              current_period_start: new Date((latestInvoice?.period_start ?? Date.now() / 1000) * 1000).toISOString(),
              current_period_end: new Date((latestInvoice?.period_end ?? Date.now() / 1000) * 1000).toISOString(),
            });

          logger.info('Subscription created via checkout', { userId, stripe_subscription_id });
        }
        break;
      }

      /**
       * Fired on every successful recurring payment.
       * In API version 2026-03-25.dahlia, `invoice.subscription` was replaced
       * by `invoice.parent.subscription_details.subscription`.
       * We use invoice.period_start / period_end directly — no need to
       * re-fetch the subscription just for dates.
       */
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const amount = invoice.amount_paid / 100;

        // New SDK: subscription ID lives under parent.subscription_details
        const stripe_subscription_id =
          typeof invoice.parent?.subscription_details?.subscription === 'string'
            ? invoice.parent.subscription_details.subscription
            : (invoice.parent?.subscription_details?.subscription as Stripe.Subscription | undefined)?.id;

        if (stripe_subscription_id) {
          // Fetch user for charity % calculation
          const { data: userSub } = await supabaseServiceRole
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', stripe_subscription_id)
            .single();

          if (userSub) {
            const { data: user } = await supabaseServiceRole
              .from('users')
              .select('charity_perc')
              .eq('id', userSub.user_id)
              .single();

            if (user) {
              const prize_pool = amount * 0.40;
              const charity = amount * (user.charity_perc / 100);
              logger.info('Financial Split Calculated', {
                stripe_subscription_id,
                total: amount,
                prize_pool,
                charity,
              });
            }
          }

          // invoice.period_start / period_end are the canonical billing dates
          await supabaseServiceRole
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_start: new Date(invoice.period_start * 1000).toISOString(),
              current_period_end: new Date(invoice.period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', stripe_subscription_id);

          logger.info('Subscription renewed', { stripe_subscription_id });
        }
        break;
      }

      /**
       * Fired when subscription status or plan changes.
       * We sync status only here — period dates come from invoice events.
       */
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseServiceRole
          .from('subscriptions')
          .update({ status: subscription.status })
          .eq('stripe_subscription_id', subscription.id);
        logger.info('Subscription updated', { id: subscription.id, status: subscription.status });
        break;
      }

      /**
       * Fired when a subscription is fully cancelled in Stripe.
       */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseServiceRole
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        logger.info('Subscription cancelled', { id: subscription.id });
        break;
      }

      /**
       * Fired when payment fails for a subscription invoice.
       * Also uses invoice.parent.subscription_details for subscription ID.
       */
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        const stripe_subscription_id =
          typeof invoice.parent?.subscription_details?.subscription === 'string'
            ? invoice.parent.subscription_details.subscription
            : (invoice.parent?.subscription_details?.subscription as Stripe.Subscription | undefined)?.id;

        if (stripe_subscription_id) {
          await supabaseServiceRole
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', stripe_subscription_id);

          logger.warn('Payment failed', { stripe_subscription_id });
        }
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error('Webhook processing failed', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
