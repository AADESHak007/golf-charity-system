import { createClient } from '@/lib/supabase/server';
import { SigninSchema } from '@/lib/validators/auth';
import { ApiResponse, User } from '@/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = SigninSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Fetch user details from public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        data: {
          user: userData,
          session: {
            access_token: authData.session?.access_token,
            refresh_token: authData.session?.refresh_token,
          }
        }
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
