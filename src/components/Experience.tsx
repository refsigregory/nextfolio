'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

type ExperienceData = {
  totalYears: number;
  byTag: Record<string, number>;
};

const colors = [
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

export default function ExperienceSection() {
  const [data, setData] = useState<ExperienceData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const chartData = data
    ? Object.entries(data.byTag).map(([tag, years], i) => ({
        name: tag,
        years,
        color: colors[i % colors.length],
      }))
    : [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto rounded-xl shadow-xl bg-white/70 dark:bg-gray-900/80 backdrop-blur p-8 ring-1 ring-gray-200 dark:ring-gray-800">
        <motion.h2
          className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Experience
        </motion.h2>

        {data ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              I’ve accumulated <strong>{data.totalYears} years</strong> of experience across the
              following technologies:
            </p>

            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 40, bottom: 10, left: 100 }}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <XAxis type="number" domain={[0, 'dataMax + 1']} tickLine={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} width={120} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="years" radius={[0, 8, 8, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={activeIndex === index ? '#000' : entry.color}
                        onMouseEnter={() => setActiveIndex(index)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Loading experience...</p>
        )}
      </div>
    </section>
  );
}
