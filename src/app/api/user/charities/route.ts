import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AddCharitySchema } from '@/lib/validators/charity';
import { ApiResponse } from '@/types';

/**
 * GET - Fetch all user's selected charities with their allocation.
 * PROTECTED ROUTE
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data: userCharities, error } = await supabase
    .from('user_charities')
    .select(`
      id,
      user_id,
      charity_id,
      allocation_perc,
      charity:charities (*)
    `)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  const total_allocation = (userCharities || []).reduce(
    (acc, curr) => acc + curr.allocation_perc,
    0
  );

  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      charities: userCharities,
      total_allocation,
      remaining_allocation: 50 - total_allocation,
    },
  });
}

/**
 * POST - Add a new charity to user's selections.
 * PROTECTED ROUTE + Subscription check.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 1. Subscription check
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Active subscription required to support charities' },
      { status: 403 }
    );
  }

  // 2. Validate body
  const body = await request.json();
  const result = AddCharitySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { charityId, allocation_perc } = result.data;

  // 3. Fetch current user_charities
  const { data: existingCharities, error: fetchError } = await supabase
    .from('user_charities')
    .select('charity_id, allocation_perc')
    .eq('user_id', user.id);

  if (fetchError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: fetchError.message },
      { status: 500 }
    );
  }

  // 4. Count check
  if (existingCharities && existingCharities.length >= 2) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Maximum 2 charities allowed' },
      { status: 400 }
    );
  }

  // 5. Duplicate check
  if (existingCharities?.find(c => c.charity_id === charityId)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Charity already selected' },
      { status: 400 }
    );
  }

  // 6. Charity existence and active status
  const { data: charity } = await supabase
    .from('charities')
    .select('id, is_active')
    .eq('id', charityId)
    .maybeSingle();

  if (!charity || !charity.is_active) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Charity not found or inactive' },
      { status: 404 }
    );
  }

  // 7. Total allocation check (<= 50%)
  const currentTotal = (existingCharities || []).reduce(
    (acc, curr) => acc + curr.allocation_perc,
    0
  );

  if (currentTotal + allocation_perc > 50) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Total allocation cannot exceed 50%' },
      { status: 400 }
    );
  }

  // 8. INSERT into user_charities
  const { error: insertError } = await supabase
    .from('user_charities')
    .insert({
      user_id: user.id,
      charity_id: charityId,
      allocation_perc
    });

  if (insertError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: insertError.message },
      { status: 500 }
    );
  }

  // Return updated list
  const { data: updatedCharities } = await supabase
    .from('user_charities')
    .select(`
      id,
      user_id,
      charity_id,
      allocation_perc,
      charity:charities (*)
    `)
    .eq('user_id', user.id);

  const updatedTotal = (updatedCharities || []).reduce(
    (acc, curr) => acc + curr.allocation_perc,
    0
  );

  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      charities: updatedCharities,
      total_allocation: updatedTotal,
      remaining_allocation: 50 - updatedTotal,
    },
  });
}
