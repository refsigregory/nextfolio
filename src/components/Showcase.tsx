'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import type { Project } from '@/lib/types';

type Filters = { platform: string; category: string; tag: string };

const FILTER_KEYS = ['platform', 'category', 'tag'] as const;
const NO_FILTERS: Filters = { platform: '', category: '', tag: '' };

const LABELS: Record<string, string> = {
  ml: 'Machine learning',
  iot: 'IoT',
  fullstack: 'Full-stack',
};

function label(value: string) {
  return LABELS[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

/** Only called for projects where hasScreenshots() is true. */
function imageFor(project: Project, index = 0) {
  return project.images[index];
}

function externalLink(url?: string) {
  if (!url || url === '#') return null;
  const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
  const text = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return { href, text };
}

/*
 * Privacy:
 * - public:     image card in the grid (and the thumbnail stack), screenshots in the dialog
 * - private:    listed under "More projects", screenshots only in the dialog
 * - restricted: listed under "More projects", no screenshots at all (stripped on the server)
 * Every project counts towards the totals.
 */

/** Public projects with screenshots get an image card; everything else goes in the compact list. */
function hasCard(project: Project) {
  return project.privacy === 'public' && project.images.length > 0;
}

/** Whether the dialog may show this project's screenshots. */
function hasScreenshots(project: Project) {
  return project.privacy !== 'restricted' && project.images.length > 0;
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort();
}

export default function Showcase({ projects }: { projects: Project[] }) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [selected, setSelected] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();

  // Apply filters from a shared link (e.g. ?platform=mobile) once the page is interactive.
  // The server always renders the full list so every project is in the initial HTML.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {
      platform: params.get('platform')?.toLowerCase() ?? '',
      category: params.get('category') ?? '',
      tag: params.get('tag') ?? '',
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    if (Object.values(fromUrl).some(Boolean)) setFilters(fromUrl);
  }, []);

  const options = useMemo(
    () => ({
      platform: unique(projects.flatMap((p) => p.platform.map((pl) => pl.trim().toLowerCase()))),
      category: unique(projects.flatMap((p) => p.category)),
      tag: unique(projects.flatMap((p) => p.tags)),
    }),
    [projects],
  );

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!filters.platform || p.platform.some((pl) => pl.trim().toLowerCase() === filters.platform)) &&
          (!filters.category || p.category.includes(filters.category)) &&
          (!filters.tag || p.tags.includes(filters.tag)),
      ),
    [projects, filters],
  );

  const featured = useMemo(() => projects.filter(hasCard).slice(0, 5), [projects]);
  const cards = filtered.filter(hasCard);
  const others = filtered.filter((p) => !hasCard(p));
  const hasFilters = FILTER_KEYS.some((key) => filters[key]);

  const applyFilters = (next: Filters) => {
    setFilters(next);
    const params = new URLSearchParams(window.location.search);
    for (const key of FILTER_KEYS) {
      if (next[key]) params.set(key, next[key]);
      else params.delete(key);
    }
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  };

  const setFilter = (key: keyof Filters, value: string) => applyFilters({ ...filters, [key]: value });

  return (
    <section id="work" className="mx-auto max-w-5xl px-5 pt-10 pb-16 sm:pb-20">
      {/* Sized to fit inside the strip of the card that peeks over the hero. */}
      <div className="flex items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Things I&apos;ve built</h2>
          <p className="mt-1 text-sm text-stone-500" aria-live="polite">
            {filtered.length === projects.length
              ? `${projects.length} projects`
              : `${filtered.length} of ${projects.length} projects`}
          </p>
        </div>
        <ThumbStack projects={featured} onOpen={setSelected} />
      </div>

      {/* Filters */}
      {/* mt-10 keeps the filters out of the peeking strip, even when the card lifts on hover. */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Platform">
          {['', ...options.platform].map((platform) => {
            const active = filters.platform === platform;
            return (
              <button
                key={platform || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter('platform', platform)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active
                    ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                    : 'border-stone-300 text-stone-700 hover:border-stone-500 dark:border-stone-700 dark:text-stone-300 dark:hover:border-stone-500'
                }`}
              >
                {platform ? label(platform) : 'All'}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <FilterSelect
            label="Type"
            allLabel="All types"
            value={filters.category}
            options={options.category}
            onChange={(value) => setFilter('category', value)}
          />
          <FilterSelect
            label="Technology"
            allLabel="All technologies"
            value={filters.tag}
            options={options.tag}
            onChange={(value) => setFilter('tag', value)}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={() => applyFilters(NO_FILTERS)}
              className="px-2 py-1.5 text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-stone-500">
          No projects match these filters.{' '}
          <button
            type="button"
            onClick={() => applyFilters(NO_FILTERS)}
            className="underline underline-offset-4 hover:text-stone-900 dark:hover:text-white"
          >
            Clear filters
          </button>
        </p>
      )}

      {/* Projects with screenshots */}
      {cards.length > 0 && (
        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((project, i) => (
            <motion.li
              key={project.id}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              // Stagger across each row of three.
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => setSelected(project)}
                className="group block w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900">
                  <Image
                    src={imageFor(project)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-medium underline-offset-4 group-hover:underline">{project.title}</h3>
                  {project.year && (
                    <span className="shrink-0 text-sm tabular-nums text-stone-500">{project.year}</span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600 dark:text-stone-400">{project.description}</p>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Projects without public screenshots */}
      {others.length > 0 && (
        <div className={cards.length > 0 ? 'mt-16' : 'mt-8'}>
          {cards.length > 0 && <h3 className="text-sm font-medium text-stone-500">More projects</h3>}
          <ul className="mt-3 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
            {others.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  className="grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 px-2 py-3 text-left transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-teal-600 sm:grid-cols-[1fr_12rem_3rem] dark:hover:bg-stone-900"
                >
                  <span className="font-medium">{project.title}</span>
                  <span className="hidden truncate text-sm text-stone-500 sm:block">
                    {project.category.map(label).join(', ')}
                  </span>
                  <span className="text-right text-sm tabular-nums text-stone-500">{project.year ?? ''}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && <ProjectDialog key={selected.id} project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

const TILTS = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6', '-rotate-3'];

/**
 * A small fanned stack of the latest project screenshots. Spreads out on hover;
 * clicking one opens that project straight away.
 */
function ThumbStack({ projects, onOpen }: { projects: Project[]; onOpen: (project: Project) => void }) {
  if (projects.length === 0) return null;

  return (
    <ul className="group/stack flex shrink-0 items-center py-2" aria-label="Latest projects">
      {projects.map((project, i) => (
        <li
          key={project.id}
          style={{ zIndex: projects.length - i }}
          className={`relative transition-[margin] duration-300 not-first:-ml-4 group-hover/stack:not-first:ml-1.5! ${
            i >= 3 ? 'hidden sm:block' : ''
          }`}
        >
          <button
            type="button"
            title={project.title}
            aria-label={`Open ${project.title}`}
            onClick={(e) => {
              // Don't also trigger the card's "open" click.
              e.stopPropagation();
              onOpen(project);
            }}
            className={`relative block h-10 w-14 overflow-hidden rounded-lg bg-stone-100 shadow-md ring-2 ring-white transition-transform duration-300 group-hover/stack:rotate-0 hover:z-10 hover:-translate-y-1 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:h-12 sm:w-[4.5rem] dark:ring-stone-950 ${TILTS[i % TILTS.length]}`}
          >
            <Image src={project.images[0]} alt="" fill sizes="72px" className="object-cover object-top" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function FilterSelect({
  label: name,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-900"
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {label(option)}
        </option>
      ))}
    </select>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const restricted = project.privacy === 'restricted';
  const showImage = hasScreenshots(project);
  const count = project.images.length;
  const hasGallery = showImage && count > 1;
  const link = externalLink(project.url);

  // showModal() gives us Escape-to-close, focus handling and the backdrop for free.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicking the dimmed area outside the panel closes the dialog.
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (!hasGallery) return;
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(48rem,calc(100vw-2rem))] overflow-y-auto rounded-xl bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-black/70 dark:bg-stone-900 dark:text-stone-100"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 text-stone-700 shadow transition-colors hover:bg-white hover:text-stone-900 dark:bg-stone-800/90 dark:text-stone-200 dark:hover:bg-stone-800"
      >
        <FiX className="size-5" />
      </button>

      {showImage && (
        <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-950">
          <Image
            src={imageFor(project, index)}
            alt={hasGallery ? `${project.title}, screenshot ${index + 1} of ${count}` : `${project.title} preview`}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-contain"
          />

          {hasGallery && (
            <>
              <GalleryButton side="left" label="Previous screenshot" onClick={() => step(-1)}>
                <FiChevronLeft className="size-5" />
              </GalleryButton>
              <GalleryButton side="right" label="Next screenshot" onClick={() => step(1)}>
                <FiChevronRight className="size-5" />
              </GalleryButton>
              <span className="absolute right-3 bottom-3 rounded bg-black/60 px-2 py-0.5 text-xs tabular-nums text-white">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
      )}

      <div className="p-6">
        <div className={`flex items-baseline justify-between gap-4 ${showImage ? '' : 'pr-10'}`}>
          <h2 id="project-title" className="text-xl font-semibold tracking-tight">
            {project.title}
          </h2>
          {project.year && <span className="shrink-0 text-sm tabular-nums text-stone-500">{project.year}</span>}
        </div>

        {restricted && (
          <p className="mt-1 text-sm text-stone-500">Screenshots for this project can&apos;t be shared publicly.</p>
        )}

        <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">{project.description}</p>

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {project.category.length > 0 && (
            <>
              <dt className="text-stone-500">Type</dt>
              <dd>{project.category.map(label).join(', ')}</dd>
            </>
          )}
          {project.platform.length > 0 && (
            <>
              <dt className="text-stone-500">Platform</dt>
              <dd>{project.platform.map((pl) => label(pl.trim().toLowerCase())).join(', ')}</dd>
            </>
          )}
          {link && (
            <>
              <dt className="text-stone-500">Link</dt>
              <dd className="min-w-0">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1 text-teal-700 underline underline-offset-4 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  <span className="truncate">{link.text}</span>
                  <FiArrowUpRight className="size-4 shrink-0" />
                </a>
              </dd>
            </>
          )}
        </dl>

        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded border border-stone-200 px-2 py-0.5 text-xs text-stone-600 dark:border-stone-700 dark:text-stone-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  );
}

function GalleryButton({
  side,
  label: name,
  onClick,
  children,
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={name}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3' : 'right-3'} rounded-full bg-white/90 p-2 text-stone-800 shadow transition-colors hover:bg-white dark:bg-stone-800/90 dark:text-stone-100 dark:hover:bg-stone-800`}
    >
      {children}
    </button>
  );
}
