import { FiArrowUpRight, FiDownload } from 'react-icons/fi';
import { CONTACT_URL, CV_PATH } from '@/lib/site';
import SocialLinks from './SocialLinks';

export default function ContactFooter() {
  return (
    <footer id="contact" className="footer-gradient text-white">
      <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:py-24">
        <h2 className="font-ref text-3xl font-light tracking-wide">Get in touch</h2>
        <p className="font-ref mx-auto mt-3 max-w-md font-light text-white/80">
          Have a project in mind or want to work together? Send me a message through my contact page.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-teal-800 transition-colors hover:bg-white/90"
          >
            Contact me
            <FiArrowUpRight className="size-4" />
          </a>
          <a
            href={CV_PATH}
            download
            className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Download CV
            <FiDownload className="size-4" />
          </a>
        </div>

        <SocialLinks tone="light" className="mt-10 justify-center" />

        <p className="font-ref mt-10 text-sm text-white/70">© {new Date().getFullYear()} Refsi Gregorius Sangkay</p>
      </div>
    </footer>
  );
}
