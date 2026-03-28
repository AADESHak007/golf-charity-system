import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { data: charities, error } = await supabaseServiceRole
      .from("charities")
      .select(`
        *,
        supporters:user_charities (
          count
        )
      `)
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: charities
    });

  } catch (error: any) {
    console.error("Admin fetch charities error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, image_url, website_url, is_featured } = body;

    if (!name || !slug || !description) {
      return NextResponse.json({ error: "Missing required fields: name, slug, description" }, { status: 400 });
    }

    const { data: charity, error } = await supabaseServiceRole
      .from("charities")
      .insert({
        name,
        slug,
        description,
        image_url: image_url || null,
        website_url: website_url || null,
        is_featured: is_featured || false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Charity created successfully",
      data: charity
    });

  } catch (error: any) {
    console.error("Admin create charity error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
