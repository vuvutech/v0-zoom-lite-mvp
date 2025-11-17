import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: booking, error: fetchError } = await supabase
    .from("co_host_bookings")
    .select("meeting_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const { data: meeting, error: meetingError } = await supabase
    .from("meetings")
    .select("host_id")
    .eq("id", booking.meeting_id)
    .single();

  if (meetingError || meeting?.host_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("co_host_bookings")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
