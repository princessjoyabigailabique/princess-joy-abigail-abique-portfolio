"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { NAV } from "@/data/site";
import ThemeToggle from "./ThemeToggle";
import AbiqueMark from "./AbiqueMark";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="brand-signature flex items-center gap-2 font-bold tracking-wide" aria-label="Abique — home">
          <AbiqueMark size={36} priority />
          <span className="brand-word">ABIQUE<span className="brand-dot">.</span></span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 xl:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`border-b-2 py-1 text-sm transition ${
                isActive(n.href) ? "border-accent text-accent" : "border-transparent text-ink/80 hover:text-accent"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/resume"
            className="header-resume inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Resume
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-bg xl:hidden">
          <ul className="container-page flex flex-col py-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-base ${
                    isActive(n.href) ? "bg-accent/10 text-accent" : "text-ink/90 hover:bg-surface2"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
