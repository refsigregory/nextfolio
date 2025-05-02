import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/projects';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API] Failed to load jobs:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
