import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Valid name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name: name.trim() })
      .eq('id', authUser.id)
      .select('id, name, email, role')
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Also update auth.users metadata to keep them in sync
    await supabase.auth.updateUser({
      data: { full_name: name.trim(), name: name.trim() }
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API /api/user/profile error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
