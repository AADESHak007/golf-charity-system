import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';

/**
 * GET - Charity directory with search and featured filters.
 * PUBLIC ROUTE - no auth required.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  let query = supabase
    .from('charities')
    .select(`
      id, 
      name, 
      slug, 
      description, 
      image_url, 
      is_featured,
      charity_events!left(count)
    `)
    .eq('is_active', true)
    .eq('charity_events.is_active', true)
    .gte('charity_events.event_date', today);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data: charities, error } = await query;

  if (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // Transform to flatten the count
  const transformedCharities = charities?.map(charity => ({
    ...charity,
    upcoming_events_count: (charity.charity_events?.[0] as any)?.count ?? 0,
    charity_events: undefined // Clean up the raw join field
  }));

  return NextResponse.json<ApiResponse>({
    success: true,
    data: transformedCharities,
  });
}
