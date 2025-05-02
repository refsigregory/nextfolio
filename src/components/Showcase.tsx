'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Types ---
type Project = {
  id: number;
  title: string;
  images: string[];
  description: string;
  tags: string[];
  category: string[];
  platform: string[];
  privacy: string;
};

export default function Showcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects([...data].reverse()); // get DESCENDING data
      } catch (error) {
        console.error('[Showcase] Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- URL Sync ---
  useEffect(() => {
    setSelectedTag(searchParams.get('tag'));
    setSelectedPlatform(searchParams.get('platform'));
    setSelectedCategory(searchParams.get('category'));
  }, [searchParams]);

  // --- Filter Options ---
  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const platformOptions = useMemo(() => {
    const platforms = new Set<string>();
  
    projects.forEach((p) => {
      p.platform?.forEach((pl) => {
        const normalized = pl.trim().toLowerCase();
        if (normalized) platforms.add(normalized);
      });
    });
  
    return Array.from(platforms).sort();
  }, [projects]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    projects.forEach((p) => p.category.forEach((c) => categories.add(c)));
    return Array.from(categories).sort();
  }, [projects]);

  // --- Filtering ---
  useEffect(() => {
    let result = projects;

    if (selectedTag) result = result.filter((p) => p.tags.includes(selectedTag));
    if (selectedPlatform) {
      result = result.filter((p) => p.platform?.includes(selectedPlatform));
    }
    if (selectedCategory) result = result.filter((p) => p.category.includes(selectedCategory));

    setFiltered(result);
  }, [projects, selectedTag, selectedPlatform, selectedCategory]);

  // --- Update URL when filters change ---
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}#projects`);
  };

  const resetFilters = () => {
    router.push('?#projects');
  }; 
  
  const ProjectImageURL = (project: Project, activeImage: number = 0) => {
    if (project.images?.length > 0) {
      if (project.privacy === "restricted") {
        return "/images/restricted-project.png";
      } else {
      return project.images[activeImage]
      }
    }
    return "/images/no-preview.png";
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Projects</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded text-sm text-gray-800 dark:text-white"
          value={selectedTag || ''}
          onChange={(e) => updateFilter('tag', e.target.value || null)}
        >
          <option value="">All Tags</option>
          {tagOptions.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded text-sm text-gray-800 dark:text-white"
          value={selectedPlatform || ''}
          onChange={(e) => updateFilter('platform', e.target.value || null)}
        >
          <option value="">All Platforms</option>
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded text-sm text-gray-800 dark:text-white"
          value={selectedCategory || ''}
          onChange={(e) => updateFilter('category', e.target.value || null)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category.toUpperCase()}</option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="text-sm px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white ml-auto"
        >
          Reset Filters
        </button>
      </div>

      {/* Grid */}
      <div id="projects" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <Skeleton height={180} />
                <Skeleton count={2} className="mt-2" />
              </div>
            ))
          : filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="cursor-pointer rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-900 transition-transform hover:scale-105"
                onClick={() => {
                  setSelected(project);
                  setActiveImage(0);
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="aspect-[4/3] relative w-full">
                  <Image
                    src={ProjectImageURL(project)}
                    alt={project.title}
                    fill
                    className="object-cover rounded-t-xl"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-xl w-full relative shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                {selected.title}
              </h2>

              <div className="relative w-full mb-4">
                <Image
                  src={ProjectImageURL(selected, activeImage)}
                  alt={`Slide ${activeImage + 1}`}
                  width={600}
                  height={400}
                  className="rounded-lg w-full object-cover"
                />
                {selected.images.length > 1 && (
                  <div className="flex justify-center mt-2 gap-2">
                    {selected.images.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-3 h-3 rounded-full ${
                          idx === activeImage
                            ? 'bg-indigo-500'
                            : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                        onClick={() => setActiveImage(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{selected.description}</p>

              <div className="flex flex-wrap gap-2 text-sm mb-2">
                {selected.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Category:</strong> {selected.category?.join(', ') || 'Uncategorized'}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Platform:</strong> {selected.platform || 'N/A'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
