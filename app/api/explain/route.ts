import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, classification } = body;

    console.log("📨 Received:", { eventsCount: events?.length, classification });

    // Always return a fallback story (no OpenAI call)
    const fallback = `This shopper completed ${events?.length || 0} actions and was identified as a "${classification?.state?.replace("_", " ") || "unknown"}" with ${classification?.confidence ?? 0}% confidence. ${classification?.recommendedAction || "Consider engaging this shopper."}`;

    console.log("✅ Returning fallback:", fallback);
    return NextResponse.json({ story: fallback });

  } catch (error: any) {
    console.error("❌ Route error:", error.message);
    return NextResponse.json({ story: "We couldn't generate a story right now." });
  }
}
