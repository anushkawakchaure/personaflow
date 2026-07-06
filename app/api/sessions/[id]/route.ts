import { supabase } from "@/lib/supabase";
import { classifySession } from "@/lib/classifier";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (sessionError) throw sessionError;

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('session_id', id)
      .order('timestamp', { ascending: true });

    if (eventsError) throw eventsError;

    const sessionWithEvents = {
      id: session.id,
      visitorId: session.visitor_id,
      isReturningCustomer: session.is_returning_customer || false,
      createdAt: session.created_at,
      events: events.map(e => ({
        id: e.id,
        type: e.type,
        timestamp: e.timestamp,
        metadata: e.metadata || {}
      }))
    };

    return NextResponse.json({
      ...sessionWithEvents,
      classification: classifySession(events || [])
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { event } = body;

    if (!event || !event.type) {
      return NextResponse.json(
        { error: 'Event with type is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        session_id: id,
        type: event.type,
        metadata: event.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json(
      { error: 'Failed to add event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { event_id } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: 'event_id is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', event_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
