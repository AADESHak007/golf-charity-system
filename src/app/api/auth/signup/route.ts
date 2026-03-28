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

    const { email, password, name, role, charityId, contributionPercentage } = result.data;
    const supabase = await createClient();

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          charity_id: charityId,
          contribution_percentage: contributionPercentage,
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

    // Persist chosen charity & percentage to user_charities right away if userId is available
    // Note: If email confirmation is required, signUpData.user might not contain the ID yet
    // depending on Supabase settings. If auto-confirm is on, it's there.
    if (signUpData.user && charityId) {
       try {
         await supabase
           .from('user_charities')
           .insert({
             user_id: signUpData.user.id,
             charity_id: charityId,
             allocation_perc: contributionPercentage
           });
         logger.info('Charity selection saved for user', { userId: signUpData.user.id });
       } catch (err) {
         logger.error('Failed to save charity selection during signup', err);
       }
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
