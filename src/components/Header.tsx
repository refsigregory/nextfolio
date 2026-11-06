'use client';

import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#writing', label: 'Writing', hideOnMobile: true },
  { href: '#contact', label: 'Contact' },
];

/** Hidden over the hero; slides down once the visitor scrolls past most of it. */
export default function Header() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setVisible(y > window.innerHeight * 0.75);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? '0%' : '-100%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      inert={!visible}
      className="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur dark:bg-stone-950/90"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <a href="#top" className="font-ref pl-[0.18em] text-xl font-light tracking-[0.18em]" aria-label="Back to top">
          REF
        </a>
        <nav aria-label="Main">
          <ul className="flex gap-5 text-sm text-stone-600 dark:text-stone-400">
            {links.map((link) => (
              <li key={link.href} className={link.hideOnMobile ? 'hidden sm:block' : undefined}>
                <a href={link.href} className="transition-colors hover:text-stone-900 dark:hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Thin strip of the hero gradient ties the header to the intro. */}
      <div className="hero-gradient h-0.5" />
    </motion.header>
  );
}
