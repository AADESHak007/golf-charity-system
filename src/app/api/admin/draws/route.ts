import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const { data: draws, count, error } = await supabaseServiceRole
      .from("draws")
      .select(`
        *,
        creator:users!created_by (
          name
        )
      `, { count: 'exact' })
      .order('draw_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    if (draws && draws.length > 0) {
      const drawIds = draws.map(d => d.id);
      const { data: winnersData } = await supabaseServiceRole
         .from("draw_entries")
         .select("draw_id")
         .in("draw_id", drawIds)
         .gt("prize_amount_pence", 0);
         
      draws.forEach(d => {
         d.winner_count = [{ count: winnersData?.filter(w => w.draw_id === d.id).length || 0 }];
      });
    }



    const { data: summaryData } = await supabaseServiceRole
      .from("draws")
      .select("total_prize_pool_pence")
      .eq("status", "published");

    const total_lifetime_payouts_pence = (summaryData || []).reduce((sum, d) => sum + (d.total_prize_pool_pence || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        draws,
        total: count,
        page,
        limit,
        stats: {
          total_lifetime_payouts_pence
        }
      }
    });

  } catch (error: any) {
    console.error("Admin fetch draws error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
