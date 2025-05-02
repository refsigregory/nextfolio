import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js';

const renderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    const highlighted =
      lang && hljs.getLanguage(lang)
        ? hljs.highlight(text, { language: lang }).value
        : hljs.highlightAuto(text).value;

    return `<pre><code class="hljs ${lang ?? ''}">${highlighted}</code></pre>`;
  },
};

marked.use({ renderer });

type Props = {
  params: { slug: string };
};

export default async function SinglePostPage({ params }: Props) {
  const filePath = path.join(process.cwd(), 'posts', `${params.slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(fileContent);
  const html = marked(content);

  return (
    <article className="max-w-3xl mx-auto py-16 px-4">
      <div className="mb-10">
        <Link
          href="/"
          className="inline-block mb-4 text-sm text-teal-600 hover:underline"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{data.title}</h1>
        <p className="text-sm text-gray-500">{data.date}</p>
      </div>

      <div
        className="prose dark:prose-invert max-w-none prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-1 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
