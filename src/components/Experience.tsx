import type { ExperienceStats } from '@/lib/experience';
import type { Job } from '@/lib/types';

const TOP_TOOLS = 12;

export default function ExperienceSection({ jobs, stats }: { jobs: Job[]; stats: ExperienceStats }) {
  const tools = Object.entries(stats.byTag);
  const top = tools.slice(0, TOP_TOOLS);
  const rest = tools.slice(TOP_TOOLS).map(([tag]) => tag);
  const max = top[0]?.[1] ?? 1;

  return (
    <section id="experience" className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-stone-500">Where I&apos;ve worked</h3>
            <ol className="mt-4 space-y-5">
              {jobs.map((job) => (
                <li key={job.id} className="grid grid-cols-[3.5rem_1fr] gap-4">
                  <span className="pt-0.5 text-sm tabular-nums text-stone-500">{job.year}</span>
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <p className="text-sm text-stone-500">{job.location}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-medium text-stone-500">What I&apos;ve worked with</h3>
            <p className="mt-1 text-sm text-stone-500">
              Number of years I&apos;ve shipped projects with each{stats.since && `, since ${stats.since}`}.
            </p>
            <ul className="mt-4 space-y-2.5">
              {top.map(([tag, years]) => (
                <li key={tag} className="grid grid-cols-[8rem_1fr_1.5rem] items-center gap-3 text-sm">
                  <span className="truncate">{tag}</span>
                  <span className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-800">
                    <span
                      className="block h-full rounded-full bg-teal-600 dark:bg-teal-500"
                      style={{ width: `${(years / max) * 100}%` }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-stone-500">{years}</span>
                </li>
              ))}
            </ul>
            {rest.length > 0 && (
              <p className="mt-5 text-sm leading-relaxed text-stone-500">Also: {rest.join(', ')}.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
