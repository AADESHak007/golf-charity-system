import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UpdateAllocationSchema } from '@/lib/validators/charity';
import { ApiResponse } from '@/types';

/**
 * PATCH - Update allocation percentage for a charity.
 * PROTECTED ROUTE
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 1. Validate body
  const body = await request.json();
  const result = UpdateAllocationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { allocation_perc: new_allocation } = result.data;

  // 2. Verify user_charity ownership
  const { data: userCharity, error: fetchOneError } = await supabase
    .from('user_charities')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (fetchOneError || !userCharity || userCharity.user_id !== user.id) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized or not found' },
      { status: 403 }
    );
  }

  // 3. Fetch OTHER charities to calculate new total
  const { data: otherCharities, error: fetchOthersError } = await supabase
    .from('user_charities')
    .select('id, allocation_perc')
    .eq('user_id', user.id)
    .neq('id', id);

  if (fetchOthersError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: fetchOthersError.message },
      { status: 500 }
    );
  }

  const otherTotal = (otherCharities || []).reduce(
    (acc, curr) => acc + curr.allocation_perc,
    0
  );

  if (otherTotal + new_allocation > 50) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Total allocation cannot exceed 50%' },
      { status: 400 }
    );
  }

  // 4. Update allocation_perc
  const { error: updateError } = await supabase
    .from('user_charities')
    .update({ allocation_perc: new_allocation, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: updateError.message },
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

/**
 * DELETE - Remove a charity from user's selections.
 * PROTECTED ROUTE
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Verify ownership
  const { data: userCharity, error: fetchOneError } = await supabase
    .from('user_charities')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (fetchOneError || !userCharity || userCharity.user_id !== user.id) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized or not found' },
      { status: 403 }
    );
  }

  const { error: deleteError } = await supabase
    .from('user_charities')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    message: 'Charity removed',
  });
}
