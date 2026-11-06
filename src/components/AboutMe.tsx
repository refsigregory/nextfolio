'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import Typewriter from './Typewriter';

type Props = {
  projectCount: number;
  since: number | null;
  latestEmployer?: string;
};

/** Quick start, soft landing. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen intro. The section is sticky, so the content card (see ContentSheet) slides over it
 * while the intro drifts up and fades. pb-28 keeps it centred above the part of the card that peeks in.
 */
export default function AboutMe({ projectCount, since, latestEmployer }: Props) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : -140]);
  const opacity = useTransform(scrollY, [0, 500], [1, reduceMotion ? 1 : 0]);
  const scale = useTransform(scrollY, [0, 700], [1, reduceMotion ? 1 : 0.94]);

  const intro =
    "I'm a passionate software engineer focused on building things." +
    (since
      ? ` I've worked on ${projectCount} projects since ${since}` +
        (latestEmployer ? `, most recently at ${latestEmployer}.` : '.')
      : '');

  return (
    <section
      id="top"
      className="hero-gradient sticky top-0 z-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5 pb-28 text-center"
    >
      <motion.div style={{ y, opacity, scale }} className="flex flex-col items-center">
        <motion.h1
          className="mb-6 text-4xl font-extrabold tracking-tight text-black md:text-6xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Hi, I&apos;m <span className="text-teal-800">Refsi Gregorius Sangkay</span>
        </motion.h1>

        {/* Types itself out once the heading has landed. */}
        <p className="mb-8 max-w-2xl text-lg text-stone-800 md:text-xl">
          <Typewriter text={intro} startDelay={700} speed={18} />
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: EASE }}
        >
          {/* Scrolls to the work card below, which opens up as it rises. */}
          <a
            href="#work"
            className="group inline-flex items-center gap-3 rounded-full bg-teal-800 py-2 pr-2 pl-6 text-lg font-medium text-white shadow-lg shadow-teal-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/30 active:translate-y-0 active:scale-[0.98]"
          >
            View my work
            {/* Arrow drops out the bottom while a second one drops in from the top. */}
            <span className="relative size-9 overflow-hidden rounded-full bg-white text-teal-800">
              <FiArrowDown className="absolute inset-0 m-auto size-5 transition-transform duration-300 group-hover:translate-y-9" />
              <FiArrowDown className="absolute inset-0 m-auto size-5 -translate-y-9 transition-transform duration-300 group-hover:translate-y-0" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
