import { supabase } from "@/lib/supabase";
import { MOCK_SESSIONS } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear existing data
    await supabase.from("events").delete().neq("id", "");
    await supabase.from("sessions").delete().neq("id", "");

    let insertedCount = 0;

    for (const session of MOCK_SESSIONS) {
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          id: session.id,
          visitor_id: session.customerName || `visitor_${session.id.slice(0, 8)}`,
          created_at: session.startedAt
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Session insert error:", sessionError);
        continue;
      }

      for (const event of session.events) {
        const { error: eventError } = await supabase
          .from("events")
          .insert({
            session_id: sessionData.id,
            type: event.type,
            timestamp: event.timestamp,
            metadata: { label: event.label || "" }
          });

        if (eventError) {
          console.error("Event insert error:", eventError);
        }
      }
      insertedCount++;
    }

    return NextResponse.json({
      message: `Seeded ${insertedCount} sessions successfully`
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
