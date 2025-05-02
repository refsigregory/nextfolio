// src/lib/projects.ts
import path from 'path';
import fs from 'fs/promises';

type Project = {
  id: number;
  name: string;
  tags: string[];
};

export async function getAllProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'data/projects.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function getAllTags(): Promise<string[]> {
  const projects = await getAllProjects();
  const tagSet = new Set<string>();

  for (const project of projects) {
    project.tags?.forEach(tag => tagSet.add(tag));
  }

  return Array.from(tagSet).sort(); // Optional: sorted alphabetically
}
