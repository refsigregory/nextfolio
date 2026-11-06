import path from 'path';
import fs from 'fs/promises';
import type { Job } from './types';

/** All jobs, most recent first. */
export async function getJobs(): Promise<Job[]> {
  const filePath = path.join(process.cwd(), 'data/jobs.json');
  const jobs: Job[] = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  return jobs.sort((a, b) => b.year - a.year || b.id - a.id);
}
