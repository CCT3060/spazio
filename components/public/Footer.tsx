import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NewsletterForm from "./NewsletterForm";
function SocialIcon({ type, size = 18 }: { type: "instagram" | "facebook" | "pinterest"; size?: number }) {
  const paths: Record<string, string> = {
    instagram: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8A3.6 3.6 0 007.6 20h8.8A3.6 3.6 0 0020 16.4V7.6A3.6 3.6 0 0016.4 4H7.6zM17.25 5.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6z",
    facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    pinterest: "M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.26-5.33 1.26-5.33s-.32-.64-.32-1.59c0-1.49.86-2.6 1.94-2.6.91 0 1.36.68 1.36 1.5 0 .92-.58 2.29-.89 3.56-.25 1.06.53 1.93 1.57 1.93 1.89 0 3.15-2.43 3.15-5.29 0-2.18-1.47-3.81-4.12-3.81-3.01 0-4.9 2.25-4.9 4.77 0 .87.26 1.47.66 1.95.18.22.21.3.14.56l-.21.79c-.07.25-.28.34-.51.25-1.43-.59-2.1-2.17-2.1-3.95 0-2.93 2.48-6.44 7.41-6.44 3.97 0 6.59 2.89 6.59 5.99 0 4.11-2.28 7.18-5.63 7.18-1.13 0-2.19-.61-2.55-1.3l-.72 2.76c-.26 1-.97 2.25-1.44 3.01C10.56 21.93 11.27 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
}

async function getSettings() {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {} as Record<string, string>;
  }
}

export default async function Footer() {
  const s = await getSettings();

  const footerLinks = [
    { label: "About Us", href: "/pages/about-us" },
    { label: "Trade Program", href: "/pages/trade-program" },
    { label: "Shipping & Returns", href: "/pages/shipping-returns" },
    { label: "Privacy Policy", href: "/pages/privacy-policy" },
    { label: "Terms & Conditions", href: "/pages/terms-conditions" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white/70 pt-16 pb-8">
      <div className="px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand */}
        <div>
          <h2
            className="text-white text-2xl font-semibold mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Spazio
          </h2>
          <p className="text-sm leading-relaxed mb-6">
            {s.footerText ?? s.brand_blurb ?? "Curating exceptional furniture & lighting for discerning interiors."}
          </p>
          {/* Social */}
          <div className="flex gap-4">
            {(s.instagram ?? s.instagram_url) && (
              <a href={s.instagram ?? s.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#b5964e] transition-colors">
                <SocialIcon type="instagram" />
              </a>
            )}
            {(s.facebook ?? s.facebook_url) && (
              <a href={s.facebook ?? s.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#b5964e] transition-colors">
                <SocialIcon type="facebook" />
              </a>
            )}
            {(s.pinterest ?? s.pinterest_url) && (
              <a href={s.pinterest ?? s.pinterest_url} target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-[#b5964e] transition-colors">
                <SocialIcon type="pinterest" />
              </a>
            )}
          </div>
        </div>

        {/* Showroom info + links */}
        <div>
          <h3 className="text-white text-xs uppercase tracking-widest font-medium mb-4">Visit Us</h3>
          {s.address && <p className="text-sm mb-1">{s.address}</p>}
          {(s.hours ?? s.showroom_hours) && <p className="text-sm mb-3 text-white/50 whitespace-pre-line">{s.hours ?? s.showroom_hours}</p>}
          {s.phone && (
            <p className="text-sm mb-1">
              <a href={`tel:${s.phone}`} className="hover:text-[#b5964e] transition-colors">{s.phone}</a>
            </p>
          )}
          {s.email && (
            <p className="text-sm">
              <a href={`mailto:${s.email}`} className="hover:text-[#b5964e] transition-colors">{s.email}</a>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            {footerLinks.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm hover:text-[#b5964e] transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-xs uppercase tracking-widest font-medium mb-4">Stay Inspired</h3>
          <p className="text-sm mb-5">
            New arrivals, exclusive events, and stories from the world of luxury design — delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 px-6 md:px-10 lg:px-16 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/30">
        <span>© {new Date().getFullYear()} Spazio. All rights reserved.</span>
        <span>Catalog only — no transactions processed on this site.</span>
      </div>
    </footer>
  );
}
