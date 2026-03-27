import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(name, price, duration)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json<ApiResponse>({ success: true, data });
}
