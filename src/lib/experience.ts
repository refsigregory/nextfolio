import path from 'path';
import fs from 'fs/promises';

type Project = {
  id: number;
  name: string;
  tags: string[];
  year: number;
};

export type ExperienceStats = {
  totalYears: number;
  byTag: Record<string, number>;
};

export async function getExperienceStats(): Promise<ExperienceStats> {
  const filePath = path.join(process.cwd(), 'data/projects.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  const projects: Project[] = JSON.parse(raw);

  // const currentYear = new Date().getFullYear();
  const tagYears: Record<string, Set<number>> = {};

  for (const project of projects) {
    const yearsUsed = tagYears;
    for (const tag of project.tags || []) {
      if (!yearsUsed[tag]) {
        yearsUsed[tag] = new Set();
      }
      yearsUsed[tag].add(project.year);
    }
  }

  const byTag: Record<string, number> = {};
  for (const tag in tagYears) {
    const years = tagYears[tag];
    byTag[tag] = years.size;
  }

  const allYears = new Set(projects.map(p => p.year));
  const totalYears = allYears.size;

  return { totalYears, byTag };
}
