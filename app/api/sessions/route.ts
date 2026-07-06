import { supabase } from "@/lib/supabase";
import { classifySession } from "@/lib/classifier";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionsError) throw sessionsError;

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('timestamp', { ascending: true });

    if (eventsError) throw eventsError;

    const sessionsWithEvents = sessions.map(session => ({
      id: session.id,
      visitorId: session.visitor_id,
      isReturningCustomer: session.is_returning_customer || false,
      startedAt: session.created_at,  // ✅ maps to frontend expected field
      events: events
        .filter(e => e.session_id === session.id)
        .map(e => ({
          id: e.id,
          type: e.type,
          timestamp: e.timestamp,
          metadata: e.metadata || {}
        }))
    }));

    const classifiedSessions = sessionsWithEvents.map(session => ({
      ...session,
      classification: classifySession(session.events)
    }));

    return NextResponse.json(classifiedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitor_id } = body;

    if (!visitor_id) {
      return NextResponse.json(
        { error: 'visitor_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({ visitor_id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
