'use client';

import { FaArrowRight, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

export default function ContactFooter() {
  return (
    <footer className="relative py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-[#1B8FAF] via-[#0C8695] to-[#1F93A7] text-white overflow-hidden shadow-inner">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
        <div className="w-[30rem] h-[30rem] bg-white/10 rounded-full absolute -top-10 -left-10 animate-pulse" />
        <div className="w-[40rem] h-[40rem] bg-white/10 rounded-full absolute -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-md">
          Let’s Build Something Great Together
        </h2>
        <p className="mb-10 text-lg text-white/90 max-w-xl mx-auto">
          Have an idea or want to collaborate? Let’s make something awesome.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="https://contact.ref.si"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-teal-600 bg-white hover:bg-gray-100 rounded-full transition shadow"
          >
            Contact Me
            <FaArrowRight className="text-sm" />
          </Link>

          <a
            href="/cv/CV - Refsi Gregorius Sangkay (April 2025).pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-white hover:bg-white/10 rounded-full transition shadow"
          >
            Download CV
            <FaDownload className="text-sm" />
          </a>
        </div>
      </div>
    </footer>
  );
}
