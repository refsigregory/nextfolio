import { NextResponse } from 'next/server';
import { getExperienceStats } from '@/lib/experience';

export async function GET() {
  try {
    const data = await getExperienceStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Failed to calculate experience:', error);
    return NextResponse.json({ error: 'Failed to calculate experience' }, { status: 500 });
  }
}
