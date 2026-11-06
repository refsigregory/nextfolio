'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * The page content as a card that peeks over the bottom of the hero,
 * then opens to full width as it scrolls up to the top.
 * While peeking, it lifts on hover and opens on click.
 */
export default function ContentSheet({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [peeking, setPeeking] = useState(true);

  // 0 when the card's top edge is at the bottom of the screen, 1 once it's just under the header.
  // (Anchor links stop below the header because of scroll-padding, so "start start" is never reached.)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 80px'] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.85, 1], [32, 24, 0]);
  const handleOpacity = useTransform(scrollYProgress, [0.5, 0.9], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => setPeeking(progress < 0.2));

  const open = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.div
      ref={ref}
      style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius, transformOrigin: 'top center' }}
      whileHover={peeking && !reduceMotion ? { y: -10 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      onClick={peeking ? open : undefined}
      className={`relative z-10 -mt-28 bg-white shadow-[0_-12px_40px_-12px_rgb(0_0_0/0.2)] dark:bg-stone-950 ${
        peeking ? 'cursor-pointer' : ''
      }`}
    >
      {/* Grab handle, like a bottom sheet. Fades away as the card opens. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: handleOpacity }}
        className="absolute top-4 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-stone-300 dark:bg-stone-700"
      />
      {children}
    </motion.div>
  );
}
