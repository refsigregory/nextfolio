import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/projects';

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('[API] Failed to fetch tags:', error);
    return NextResponse.json({ error: 'Failed to load tags' }, { status: 500 });
  }
}
