import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Fetch Active Subscription
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subData) {
      logger.warn('No active subscription found for cancellation', { userId: user.id });
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // 2. Update Stripe: cancel_at_period_end: true
    // This allows them to keep access until the end of the period
    await stripe.subscriptions.update(
        subData.stripe_subscription_id,
        { cancel_at_period_end: true }
    );

    logger.info('Marked subscription for cancellation', { 
        userId: user.id, 
        stripe_subscription_id: subData.stripe_subscription_id 
    });

    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Subscription will cancel at period end' },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error('Stripe Cancellation Error', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to process cancellation' },
      { status: 500 }
    );
  }
}
