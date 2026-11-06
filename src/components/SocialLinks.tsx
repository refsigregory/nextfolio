import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { SOCIAL_LINKS } from '@/lib/site';

const links = [
  { href: SOCIAL_LINKS.facebook, label: 'Facebook', Icon: FaFacebookF },
  { href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp', Icon: FaWhatsapp },
  { href: SOCIAL_LINKS.twitter, label: 'Twitter', Icon: FaTwitter },
  { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: FaInstagram },
  { href: SOCIAL_LINKS.github, label: 'GitHub', Icon: FaGithub },
  { href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', Icon: FaLinkedinIn },
];

const tones = {
  /** On the light green hero. */
  dark: 'text-stone-800 hover:text-teal-800',
  /** On the teal footer. */
  light: 'text-white/90 hover:text-white',
};

export default function SocialLinks({ tone, className = '' }: { tone: keyof typeof tones; className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-5 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`block transition-colors ${tones[tone]}`}
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
