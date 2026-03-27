import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';

/**
 * GET - Single charity profile by slug with upcoming events.
 * PUBLIC ROUTE - no auth required.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: charity, error: charityError } = await supabase
    .from('charities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (charityError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: charityError.message },
      { status: 500 }
    );
  }

  if (!charity) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Charity not found' },
      { status: 404 }
    );
  }

  // Fetch upcoming events for this charity
  const today = new Date().toISOString().split('T')[0];
  const { data: events, error: eventsError } = await supabase
    .from('charity_events')
    .select('*')
    .eq('charity_id', charity.id)
    .eq('is_active', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  if (eventsError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: eventsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      ...charity,
      events: events ?? [],
    },
  });
}
