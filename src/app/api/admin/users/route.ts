import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    console.log(`[DEBUG] GET /api/admin/users - Search: "${search}" Status: "${status}"`);

    const offset = (page - 1) * limit;

    let query = supabaseServiceRole
      .from('users')
      .select(`
        *,
        subscriptions (
          status,
          subscription_plans (
            name
          )
        ),
        golf_scores (
          count
        )
      `, { count: 'exact' });

    // Apply Filters - Force reassignment and order
    if (status && status !== 'all') {
      console.log(`[DEBUG] Filtering by role: ${status}`);
      query = query.eq('role', status);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data: users, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        users,
        total: count,
        page,
        limit
      }
    });

  } catch (error: any) {
    console.error("Admin user list error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
