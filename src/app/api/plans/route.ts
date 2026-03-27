import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subscription_plans')
    .select('id, name, price, duration, features, stripe_price_id, stripe_prod_id, minimal_charity_fee')
    .eq('is_active', true)
    .order('price', { ascending: true });

  console.log(`[API] Plans fetched from DB: ${data?.length || 0}`);

  if (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json<ApiResponse>({ success: true, data });
}
