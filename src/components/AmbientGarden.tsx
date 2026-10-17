"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

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
    const garden = gardenRef.current;
    if (!garden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.hidden) return;
      const depth = Math.min(window.scrollY * 0.018, 32);
      const progress = Math.min(window.scrollY / 1400, 1);
      garden.style.setProperty("--scroll-left", `${-depth}px`);
      garden.style.setProperty("--scroll-right", `${depth * 0.72}px`);
      garden.style.setProperty("--flower-opacity", `${0.11 + progress * 0.1}`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onVisibility = () => { if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; } else onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    update();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
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
      <div className="garden-rays" />
      <div className="garden-pointer-glow" />
      <GardenClover className="garden-clover" />
      <div className="garden-florals">
        {[1, 2, 3, 4].map((flower) => <GardenFlower key={flower} className={`garden-flower garden-flower-${flower}`} />)}
      </div>
      <svg className="garden-trails" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
        <path d="M-80 590C180 510 245 715 480 620S790 415 1010 510s310 40 520-75" />
        <path d="M-90 250C160 330 270 190 500 290s365 180 570 70 335-30 470 55" />
        <path className="garden-circuit" d="M-40 755H175l44-44h132l38 38h176m302-792v112l-42 42v74l42 42h135l42 42h166" />
        <circle className="garden-circuit-node" cx="351" cy="711" r="3" />
        <circle className="garden-circuit-node" cx="874" cy="227" r="3" />
      </svg>
      <div className="garden-fireflies">
        {PARTICLES.map(({ className, style }, i) => <i className={className} style={style} key={i} />)}
        {[0, 1, 2, 3].map((i) => <i className={`garden-twinkle garden-twinkle-${i + 1}`} key={`twinkle-${i}`} />)}
      </div>
    </div>
  );
}

function GardenClover({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 560 520" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g transform="translate(280 0) scale(1.65 1) translate(-160 0)">
        <path className="clover-stem" d="M158 218C153 290 140 377 101 506m52-192c26 48 60 91 112 135m-126-88c-35 43-64 73-100 101" />
        <path className="clover-leaf" d="M160 231c-43-37-66-78-58-121 6-34 39-44 58-14 19-30 52-20 58 14 8 43-15 84-58 121Z" />
        <path className="clover-leaf" d="M151 239c-55-5-99-27-117-66-15-32 7-59 41-45-2-36 30-51 57-25 34 32 41 83 19 136Z" />
        <path className="clover-leaf" d="M169 239c55-5 99-27 117-66 15-32-7-59-41-45 2-36-30-51-57-25-34 32-41 83-19 136Z" />
        <path className="clover-vein" d="M160 224V105m-5 126-59-80m63 80 59-80m-68 81-89-39m97 39 89-39m-97 48-51 166m59-166 72 142m-85-105-77 107" />
        <circle className="clover-dewdrop" cx="160" cy="220" r="3" />
      </g>
    </svg>
  );
}

function GardenFlower({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" focusable="false">
      <g className="garden-flower-petals">
        {[0, 72, 144, 216, 288].map((angle) => <path key={angle} transform={`rotate(${angle} 50 50)`} d="M50 49C35 39 35 20 50 8c15 12 15 31 0 41Z" />)}
      </g>
      <circle className="garden-flower-center" cx="50" cy="50" r="8" />
      <circle className="garden-flower-core" cx="50" cy="50" r="3" />
    </svg>
  );
}
