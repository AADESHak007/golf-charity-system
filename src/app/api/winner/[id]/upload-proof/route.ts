import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service";

export async function POST(req: NextRequest, context: any) {
  try {
    const supabase = await createClient();
    const params = await context.params;
    const verification_id = params.id;

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch verification to check ownership and status
    const { data: verification, error: fetchError } = await supabaseServiceRole
      .from("winner_verifications")
      .select("*")
      .eq("id", verification_id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !verification) {
      return NextResponse.json({ error: "Verification record not found" }, { status: 404 });
    }

    // 3. Check status is eligible for upload
    if (verification.status !== 'awaiting_proof' && verification.status !== 'rejected') {
      return NextResponse.json({ 
        error: "Cannot upload proof for a verification in status: " + verification.status 
      }, { status: 400 });
    }

    // 4. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 5. Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG and WEBP images are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // 6. Upload to Supabase Storage
    // winner-proofs/{user_id}/{verification_id}.{ext}
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/${verification_id}.${ext}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use service role for storage upload to ensure bypass RLS problems
    const { data: uploadData, error: uploadError } = await supabaseServiceRole
      .storage
      .from("winner-proofs")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseServiceRole
      .storage
      .from("winner-proofs")
      .getPublicUrl(filePath);

    // 7. Update verification record
    const { error: updateError } = await supabaseServiceRole
      .from("winner_verifications")
      .update({
        proof_url: publicUrl,
        proof_uploaded_at: new Date().toISOString(),
        status: 'proof_submitted',
        updated_at: new Date().toISOString()
      })
      .eq("id", verification_id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "Proof submitted successfully",
      data: { proof_url: publicUrl }
    });

  } catch (error: any) {
    console.error("Proof upload error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
