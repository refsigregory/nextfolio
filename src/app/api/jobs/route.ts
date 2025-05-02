// src/app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/jobs';

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('[API] Failed to load jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
