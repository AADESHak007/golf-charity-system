import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const charity_id = searchParams.get('charity_id');

    let query = supabaseServiceRole.from("charity_events").select("*");
    if (charity_id) {
       query = query.eq('charity_id', charity_id);
    }
    query = query.order('event_date', { ascending: true });

    const { data: events, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error("Admin fetch charity events error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      charity_id, 
      title, 
      description, 
      event_date, 
      location, 
      event_type, 
      image_url, 
      registration_url 
    } = body;

    // Validation
    if (!charity_id || !title || !event_date || !event_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: event, error } = await supabaseServiceRole
      .from("charity_events")
      .insert({
        charity_id,
        title,
        description,
        event_date,
        location,
        event_type,
        image_url: image_url || null,
        registration_url: registration_url || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Charity event created successfully",
      data: event
    });

  } catch (error: any) {
    console.error("Admin create charity event error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
