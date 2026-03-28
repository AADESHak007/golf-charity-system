import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const userId = params.id;
    
    // FETCH SINGLE USER WITH RELATIONS
    const { data: user, error: userError } = await supabaseServiceRole
      .from("users")
      .select(`
        *,
        subscriptions (
          *,
          subscription_plans (*)
        ),
        golf_scores (*),
        draw_entries (
          *,
          draws (*),
          winner_verifications (*)
        ),
        user_charities (
          *,
          charities (*)
        )
      `)
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: `User not found with ID: ${userId}`,
        details: userError?.message || "No error details"
      }, { status: 404 });
    }

    // Flatten winner_verifications for UI if they exist in draw_entries
    const flattenedVerifications = user.draw_entries?.reduce((acc: any[], entry: any) => {
      if (entry.winner_verifications) {
        return [...acc, ...entry.winner_verifications];
      }
      return acc;
    }, []) || [];

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        winner_verifications: flattenedVerifications
      }
    });

  } catch (error: any) {
    console.error("Fetch individual user error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const userId = params.id;
    const body = await request.json();

    const { name, email, role } = body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    const { data: updatedUser, error: updateError } = await supabaseServiceRole
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
