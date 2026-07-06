import { MOCK_SESSIONS } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    count: MOCK_SESSIONS.length,
    firstSession: MOCK_SESSIONS[0]?.id
  });
}
