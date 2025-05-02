import path from 'path';
import fs from 'fs/promises';

export type Job = {
  id: number;
  name: string;
};

export async function getJobs(): Promise<Job[]> {
  const filePath = path.join(process.cwd(), '/data/jobs.json');
  const file = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(file);
}