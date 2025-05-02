'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Job = {
  id: number;
  title: string;
  name: string;
  year: number;
  location: string;
};

export default function CompanySlider() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  // Duplicate the data to fill the track
  const repeatedJobs = [...jobs, ...jobs, ...jobs];

  return (
    <div className="overflow-hidden w-full py-8 bg-transparent border-y border-gray-200 dark:border-gray-700 relative">
      <motion.div
        className="flex gap-10 px-4 whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          duration: 100,
          ease: 'linear',
        }}
      >
        {repeatedJobs.map((job, index) => (
          <div
            key={`${job.id}-${index}`}
            className="min-w-[160px] px-6 py-4 flex items-center justify-center text-center transition-transform hover:scale-105"
          >
            <span
              title={job.name}
              className={`
                text-xl font-extrabold tracking-wide uppercase
                text-gray-400 dark:text-gray-500
                hover:text-black dark:hover:text-white
                transition-colors duration-200
              `}
            >
              {job.title}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
