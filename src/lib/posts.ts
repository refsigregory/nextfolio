import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post } from './types';

/** Post titles and dates from /posts, newest first. */
export function getPosts(): Post[] {
  const postsDir = path.join(process.cwd(), 'posts');

  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(postsDir, file), 'utf-8'));
      return { slug: file.replace(/\.md$/, ''), title: data.title, date: data.date };
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
