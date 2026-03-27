import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user details from public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', authUser.id)
      .single();

    if (userError || !userData) {
      console.error('User profile error:', userError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        data: userData
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
