import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();
    if (!planId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info('Creating checkout session', { userId: user.id, planId });

    // 1. Fetch Plan Details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      logger.error('Plan not found', { planId, error: planError });
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // 2. Manage User's Stripe Customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('name, email, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    let customerId = userData.stripe_customer_id;

    if (!customerId) {
        // Create new customer in Stripe if it doesn't already exist for this user
        const customer = await stripe.customers.create({
            email: userData.email,
            name: userData.name,
            metadata: {
                userId: user.id
            }
        });
        customerId = customer.id;

        // Update public.users with new stripe_customer_id
        await supabase
            .from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
        
        logger.info('Created new Stripe customer', { userId: user.id, customerId });
    }

    // 3. Create Checkout Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?cancelled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
      },
      // Ensure the checkout session links to the subscription creation
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: planId,
        }
      }
    });

    if (!session.url) {
      throw new Error('Failed to create stripe session url');
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { url: session.url } },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error('Stripe Checkout Error', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to initialize checkout' },
      { status: 500 }
    );
  }
}
