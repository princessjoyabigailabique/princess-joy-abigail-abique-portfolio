"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

const LEAVES = [
  { className: "garden-vine garden-vine-left", flip: false },
  { className: "garden-vine garden-vine-right", flip: true },
];

const PARTICLES = Array.from({ length: 36 }, (_, index) => {
  const n = index + 1;
  const x = (n * 37 + 13) % 96;
  const y = (n * 61 + 19) % 93;
  const duration = 18 + ((n * 11) % 23);
  const driftX = ((n * 17) % 81) - 40;
  const driftY = -18 - ((n * 13) % 68);
  const size = 1.8 + ((n * 7) % 7) * 0.35;
  const delay = -((n * 9) % duration);
  return {
    className: `firefly firefly-tone-${n % 4} firefly-path-${n % 4}`,
    style: {
      left: `${x}%`,
      top: `${y}%`,
      "--particle-size": `${size}px`,
      "--duration": `${duration}s`,
      "--delay": `${delay}s`,
      "--drift-x": `${driftX}px`,
      "--drift-y": `${driftY}px`,
    } as CSSProperties,
  };
});

export default function AmbientGarden() {
  const pathname = usePathname();
  const gardenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const garden = gardenRef.current;
    if (!garden || !finePointer.matches || reducedMotion.matches) return;
    const fireflies = Array.from(garden.querySelectorAll<HTMLElement>(".firefly"));
    let frame = 0;
    let x = -180;
    let y = -180;
    let targetX = x;
    let targetY = y;
    let lastNearCheck = 0;

    const animate = (time: number) => {
      frame = 0;
      if (document.hidden) return;
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      garden.style.setProperty("--pointer-x", `${x}px`);
      garden.style.setProperty("--pointer-y", `${y}px`);
      if (time - lastNearCheck > 70) {
        lastNearCheck = time;
        fireflies.forEach((firefly) => {
          const rect = firefly.getBoundingClientRect();
          const distance = Math.hypot(rect.left + rect.width / 2 - targetX, rect.top + rect.height / 2 - targetY);
          firefly.classList.toggle("is-near-pointer", distance < 120);
        });
      }
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.4) frame = requestAnimationFrame(animate);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      garden.classList.add("has-pointer-light");
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => {
      garden.classList.remove("has-pointer-light");
      fireflies.forEach((firefly) => firefly.classList.remove("is-near-pointer"));
    };
    const visibility = () => {
      garden.classList.toggle("is-paused", document.hidden);
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        leave();
      }
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

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
    <div ref={gardenRef} className="ambient-garden" data-page={pathname.split("/")[1] || "home"} aria-hidden="true">
      <div className="garden-haze" />
      <div className="garden-bloom garden-bloom-one" />
      <div className="garden-bloom garden-bloom-two" />
      <div className="garden-dust" />
      <div className="garden-pointer-glow" />
      {LEAVES.map(({ className, flip }) => (
        <svg className={className} viewBox="0 0 180 380" key={className} focusable="false">
          {flip && <g transform="translate(180 0) scale(-1 1)"><Vine /></g>}
          {!flip && <Vine />}
        </svg>
      ))}
      <svg className="garden-trails" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
        <path d="M-80 590C180 510 245 715 480 620S790 415 1010 510s310 40 520-75" />
        <path d="M-90 250C160 330 270 190 500 290s365 180 570 70 335-30 470 55" />
      </svg>
      <div className="garden-fireflies">
        {PARTICLES.map(({ className, style }, i) => <i className={className} style={style} key={i} />)}
        {[0, 1, 2, 3].map((i) => <i className={`garden-twinkle garden-twinkle-${i + 1}`} key={`twinkle-${i}`} />)}
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
