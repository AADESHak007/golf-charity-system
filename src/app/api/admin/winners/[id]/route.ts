import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const { id: verification_id } = params;
    const body = await request.json();
    const { action, rejection_reason, payout_reference } = body;

    let status = '';
    let payment_status = '';
    const updateData: any = {
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (action === 'approve') {
      status = 'approved';
      payment_status = 'pending';
    } else if (action === 'reject') {
      if (!rejection_reason) return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
      status = 'rejected';
      payment_status = 'unpaid';
      updateData.rejection_reason = rejection_reason;
    } else if (action === 'mark_paid') {
      if (!payout_reference) return NextResponse.json({ error: "Payout reference is required" }, { status: 400 });
      status = 'paid';
      payment_status = 'paid';
      updateData.payout_reference = payout_reference;
      updateData.paid_at = new Date().toISOString();
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    updateData.status = status;

    // 1. Fetch the verification to get draw_entry_id
    const { data: verification, error: fetchError } = await supabaseServiceRole
      .from("winner_verifications")
      .select("*")
      .eq("id", verification_id)
      .single();

    if (fetchError || !verification) throw fetchError || new Error("Record not found");

    // 2. Perform updates
    const { error: updateError } = await supabaseServiceRole
      .from("winner_verifications")
      .update(updateData)
      .eq("id", verification_id);

    if (updateError) throw updateError;

    // Update draw entry payment status
    const { error: drawEntryError } = await supabaseServiceRole
      .from("draw_entries")
      .update({ payment_status: payment_status as any, updated_at: new Date().toISOString() })
      .eq("id", verification.draw_entry_id);

    if (drawEntryError) throw drawEntryError;

    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed successfully`,
      data: { status, payment_status }
    });

  } catch (error: any) {
    console.error("Winner action error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
