import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const scoreId = params.scoreId;
    const body = await request.json();
    
    const { score, played_at } = body;

    const { error } = await supabaseServiceRole
      .from('golf_scores')
      .update({ score, played_at })
      .eq('id', scoreId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Score updated' });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Error updating score' },
      { status: 500 }
    );
  }
}
