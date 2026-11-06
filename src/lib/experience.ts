import { getAllProjects } from './projects';

export type ExperienceStats = {
  /** Number of distinct years with at least one project. */
  totalYears: number;
  /** Year of the earliest project. */
  since: number | null;
  /** Tag -> number of distinct years it was used, sorted by most years first. */
  byTag: Record<string, number>;
};

export async function getExperienceStats(): Promise<ExperienceStats> {
  const projects = await getAllProjects();
  const tagYears: Record<string, Set<number>> = {};
  const allYears = new Set<number>();

  for (const project of projects) {
    // Projects without a year can't count towards years of experience.
    if (project.year == null) continue;

    allYears.add(project.year);
    for (const tag of project.tags ?? []) {
      (tagYears[tag] ??= new Set()).add(project.year);
    }
  }

  const byTag = Object.fromEntries(
    Object.entries(tagYears)
      .map(([tag, years]) => [tag, years.size] as const)
      .sort(([tagA, a], [tagB, b]) => b - a || tagA.localeCompare(tagB)),
  );

  return {
    totalYears: allYears.size,
    since: allYears.size ? Math.min(...allYears) : null,
    byTag,
  };
}
