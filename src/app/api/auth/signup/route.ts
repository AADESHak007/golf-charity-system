import { createClient } from '@/lib/supabase/server';
import { SignupSchema } from '@/lib/validators/auth';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    logger.info('Signup request received', { email: body.email });
    
    // Validate request body
    const result = SignupSchema.safeParse(body);
    if (!result.success) {
      logger.warn('Signup validation failed', result.error.issues);
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, role } = result.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      logger.error('Signup error:', error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    logger.info('Signup successful for', email);
    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Account created' },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Unhandled signup exception:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
