import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir);

  return files.map((file) => {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const slug = file.replace('.md', '');

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: content.substring(0, 160) + '...',
    };
  });
}

export default function BlogPreview() {
  const posts = getPosts();

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">📝 Blog Posts</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{post.date}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-block text-teal-600 hover:text-teal-400 font-medium transition"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
