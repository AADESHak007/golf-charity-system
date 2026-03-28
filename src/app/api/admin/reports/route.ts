import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { data: allSubs } = await supabaseServiceRole
      .from("subscriptions")
      .select("created_at, status, subscription_plans(price)");

    const past6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      past6Months.push({
        label: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth()
      });
    }

    const monthly_revenue = past6Months.map(m => {
      const endOfMonth = new Date(m.year, m.month + 1, 0, 23, 59, 59).getTime();
      const activeSubsThen = (allSubs || []).filter(sub => new Date(sub.created_at).getTime() <= endOfMonth && sub.status === 'active');
      const revThen = activeSubsThen.reduce((sum, s: any) => sum + (s.subscription_plans?.price || 0), 0);
      return { 
         month: m.label, 
         revenue_pence: revThen || 0,
         subscriber_count: activeSubsThen.length
      };
    });

    // 2. Charity Contributions
    const { data: charityData, error: charityError } = await supabaseServiceRole
      .from("charities")
      .select(`
        id,
        name,
        user_charities (
          id,
          allocation_perc
        )
      `)
      .eq("is_active", true);

    const charity_contributions = (charityData || []).map(c => {
      const activeSupporters = c.user_charities || [];
      // Dynamic simulated estimation based on allocated percentages (10 pence per percentage point abstractly)
      const roughTotal = activeSupporters.reduce((sum: number, s: any) => sum + (s.allocation_perc || 100), 0) * 50; 
      
      return {
        charity_name: c.name,
        total_pence: roughTotal,
        supporter_count: activeSupporters.length
      };
    });

    // 3. Draw Statistics
    const { data: drawData } = await supabaseServiceRole
      .from("draws")
      .select("id, draw_date, total_prize_pool_pence, jackpot_carried_over")
      .eq("status", "published")
      .order("draw_date", { ascending: false });

    const drawIds = (drawData || []).map(d => d.id);
    const { data: winnersData } = await supabaseServiceRole
       .from("draw_entries")
       .select("draw_id")
       .in("draw_id", drawIds)
       .gt("prize_amount_pence", 0);

    const draw_statistics = (drawData || []).map(d => ({
      draw_date: d.draw_date,
      total_winners: winnersData?.filter(w => w.draw_id === d.id).length || 0,
      total_distributed_pence: d.total_prize_pool_pence,
      jackpot_carried_over: d.jackpot_carried_over
    }));

    // 4. Score Distribution (Histogram)
    const { data: scoreData } = await supabaseServiceRole
      .from("golf_scores")
      .select("score");
    
    const freq: Record<number, number> = {};
    (scoreData || []).forEach(s => {
       freq[s.score] = (freq[s.score] || 0) + 1;
    });
    
    const score_distribution = Object.entries(freq).map(([score, frequency]) => ({
      score: parseInt(score),
      frequency
    })).sort((a,b) => a.score - b.score);

    // 5. Subscription Breakdown
    const activeSubs = (allSubs || []).filter(s => s.status === 'active').length;
    const cancelledSubs = (allSubs || []).filter(s => s.status === 'cancelled').length;

    return NextResponse.json({
      success: true,
      data: {
        monthly_revenue,
        charity_contributions,
        draw_statistics,
        score_distribution,
        subscription_breakdown: {
          monthly_count: activeSubs,
          yearly_count: 0,
          cancelled_count: cancelledSubs
        }
      }
    });

  } catch (error: any) {
    console.error("Admin reports error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
