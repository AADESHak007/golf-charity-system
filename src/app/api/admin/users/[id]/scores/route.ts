import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";
import { ScoreSchema } from "@/lib/validators/scores";

export async function POST(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const userId = params.id;
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const validated = ScoreSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    // Rolling-5 Deletion Logic Note: Check how many scores current user has
    const { count, error: countError } = await supabaseServiceRole
      .from('golf_scores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw countError;

    if (count !== null && count >= 5) {
      // Find the oldest score (by played_at or created_at)
      const { data: oldest, error: findOldestError } = await supabaseServiceRole
        .from('golf_scores')
        .select('id')
        .eq('user_id', userId)
        .order('played_at', { ascending: true })
        .limit(1)
        .single();

      if (oldest && !findOldestError) {
        await supabaseServiceRole.from('golf_scores').delete().eq('id', oldest.id);
      }
    }

    // Insert new score
    const { error: insertError } = await supabaseServiceRole
      .from('golf_scores')
      .insert({
        user_id: userId,
        score: validated.data.score,
        played_at: validated.data.played_at,
      });

    if (insertError) throw insertError;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Score added manually',
    });

  } catch (error: any) {
    console.error("Admin add score error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: any) {
   // Used for updating a specific score
   // Wait, if the route is /api/admin/users/[id]/scores, patching would be for a specific score.
   // Let's create an endpoint in /api/admin/scores/[scoreId]/route.ts for that if we want Option 2.
}
