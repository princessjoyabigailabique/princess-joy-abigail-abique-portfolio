import Link from "next/link";
import { NAV, SITE } from "@/data/site";
import AbiqueMark from "./AbiqueMark";

export default function Footer() {
  return (
    <footer className="site-footer mt-16 border-t border-line">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-bold">
            <AbiqueMark size={28} /> ABIQUE
          </p>
          <p className="mt-2 text-sm text-muted">{SITE.name} — fourth-year BSIT student.</p>
          <p className="mt-1 text-sm text-muted">Building skills. Creating solutions. Growing every day.</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold">Quick navigation</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-accent">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/resume" className="hover:text-accent">
                Resume
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold">Open to</p>
          <p className="mt-2 text-sm text-muted">Internship opportunities, collaborative projects, and automation inquiries.</p>
          <Link href="/contact" className="btn-ghost mt-3">
            Contact me
          </Link>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
