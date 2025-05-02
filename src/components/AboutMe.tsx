'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section id="me" className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-br from-green-600 via-[#acdd9a] to-yellow-300">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-black mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Hi, I&apos;m <span className="text-teal-800">Refsi Gregorius Sangkay</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-800 max-w-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        I&apos;m a passionate software engineer with a focus to building things and make something.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <a
          href="#projects"
          className="bg-teal-800 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg transition"
        >
          View My Work
        </a>
      </motion.div>
    </section>
  );
}
