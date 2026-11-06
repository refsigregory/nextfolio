import path from 'path';
import fs from 'fs/promises';
import type { Project } from './types';

/**
 * All projects, newest first. Projects without a year go last.
 * Screenshots of restricted projects are removed here, so their paths never reach
 * the page source or the API.
 */
export async function getAllProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'data/projects.json');
  const projects: Project[] = JSON.parse(await fs.readFile(filePath, 'utf-8'));

  return (
    projects
      .map((project) => (project.privacy === 'restricted' ? { ...project, images: [] } : project))
      // Reverse first so projects from the same year keep "last added first" order.
      .reverse()
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  );
}

export async function getAllTags(): Promise<string[]> {
  const projects = await getAllProjects();
  const tagSet = new Set<string>();

  for (const project of projects) {
    project.tags?.forEach((tag) => tagSet.add(tag));
  }

  return Array.from(tagSet).sort();
}
