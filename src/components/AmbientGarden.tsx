"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LEAVES = [
  { className: "garden-vine garden-vine-left", flip: false },
  { className: "garden-vine garden-vine-right", flip: true },
];

export default function AmbientGarden() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      "main > section:not(.home-hero):not(.page-atmosphere)",
    ));
    const cards = Array.from(document.querySelectorAll<HTMLElement>("main section .card-hover"));
    const targets = [...sections, ...cards];
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("scroll-reveal-visible");
        entry.target.classList.remove("scroll-reveal-pending");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

    targets.forEach((target, index) => {
      if (target.getBoundingClientRect().top > window.innerHeight * 0.88) {
        target.classList.add("scroll-reveal-pending");
        if (cards.includes(target)) target.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
      }
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="ambient-garden" data-page={pathname.split("/")[1] || "home"} aria-hidden="true">
      <div className="garden-haze" />
      {LEAVES.map(({ className, flip }) => (
        <svg className={className} viewBox="0 0 180 380" key={className} focusable="false">
          {flip && <g transform="translate(180 0) scale(-1 1)"><Vine /></g>}
          {!flip && <Vine />}
        </svg>
      ))}
      <div className="garden-fireflies">
        {Array.from({ length: 8 }, (_, i) => <i className={`firefly firefly-${i + 1}`} key={i} />)}
      </div>
    </div>
  );
}

function Vine() {
  return (
    <>
      <path className="vine-stem" d="M153 379C135 326 155 287 123 242s-13-82 5-115 4-69-8-103" />
      <path className="vine-stem vine-stem-fine" d="M131 305c-22-26-48-31-79-29m84-21c27-20 45-28 72-25m-80-77c-27-17-44-35-52-58m69 4c17-14 30-32 38-53" />
      <path className="vine-leaf" d="M55 276c12-22 36-26 59-3-18 18-40 23-59 3Z" />
      <path className="vine-leaf" d="M171 249c-19-19-43-18-66 4 18 15 42 17 66-4Z" />
      <path className="vine-leaf" d="M49 121c13-21 36-24 57-2-17 17-39 21-57 2Z" />
      <path className="vine-leaf" d="M169 96c-18-18-40-16-61 5 17 14 39 16 61-5Z" />
      <path className="vine-vein" d="m57 275 48-1m58-18 36-7m-147-128 45-1m32-23 39-9" />
      <circle className="vine-node" cx="126" cy="128" r="2.5" />
    </>
  );
}
