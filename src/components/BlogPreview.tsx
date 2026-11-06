import type { Post } from '@/lib/types';

export default function BlogPreview({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Writing</h2>
          <span className="text-sm text-stone-500">Coming soon</span>
        </div>
        <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-baseline justify-between gap-4 py-3">
              <span className="text-stone-700 dark:text-stone-300">{post.title}</span>
              <span className="shrink-0 text-sm tabular-nums text-stone-500">{post.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
