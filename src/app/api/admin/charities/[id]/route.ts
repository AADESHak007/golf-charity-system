import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    const { data: charity, error } = await supabaseServiceRole
      .from("charities")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: charity
    });

  } catch (error: any) {
    console.error("Admin update charity error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const { id } = params;

    const { error } = await supabaseServiceRole
      .from("charities")
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Charity deactivated successfully"
    });

  } catch (error: any) {
    console.error("Admin deactivate charity error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
