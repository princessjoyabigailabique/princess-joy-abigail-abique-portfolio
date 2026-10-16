"use client";

import { useEffect, useState } from "react";
import AbiqueMark from "./AbiqueMark";

const MINIMUM_SHOW_MS = 2_580;
const EXIT_MS = 420;

export default function LoadingIntro() {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-intro-pending")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.removeAttribute("data-intro-pending");
      return;
    }

    document.body.classList.add("has-intro-overlay");
    const introWindow = window as Window & { __abiqueIntroStartedAt?: number };
    const startedAt = introWindow.__abiqueIntroStartedAt ?? performance.now();
    let readyTimer: number | undefined;
    let exitTimer: number | undefined;
    let removed = false;

    const removeIntro = () => {
      if (removed) return;
      removed = true;
      setExiting(true);
      exitTimer = window.setTimeout(() => {
        root.removeAttribute("data-intro-pending");
        document.body.classList.remove("has-intro-overlay");
      }, EXIT_MS);
    };
    const whenReady = () => {
      const remaining = Math.max(0, MINIMUM_SHOW_MS - (performance.now() - startedAt));
      readyTimer = window.setTimeout(removeIntro, remaining);
    };

    if (document.readyState === "complete") whenReady();
    else window.addEventListener("load", whenReady, { once: true });

    const remaining = Math.max(0, MINIMUM_SHOW_MS - (performance.now() - startedAt));
    const failsafe = window.setTimeout(removeIntro, remaining);
    return () => {
      window.clearTimeout(failsafe);
      if (readyTimer) window.clearTimeout(readyTimer);
      if (exitTimer) window.clearTimeout(exitTimer);
      window.removeEventListener("load", whenReady);
      document.body.classList.remove("has-intro-overlay");
    };
  }, []);

  return (
    <div className={`loading-intro${exiting ? " is-exiting" : ""}`} role="status" aria-live="polite" aria-label="Initializing Abigail Abique’s portfolio">
      <div className="intro-atmosphere" aria-hidden="true">
        <i className="intro-star intro-star-one" />
        <i className="intro-star intro-star-two" />
        <i className="intro-star intro-star-three" />
      </div>
      <div className="intro-content">
        <div className="intro-emblem-wrap">
          <AbiqueMark size={96} priority />
          <span className="intro-orbit intro-orbit-one" aria-hidden="true" />
          <span className="intro-orbit intro-orbit-two" aria-hidden="true" />
        </div>
        <p className="intro-name">Abigail <span>Abique</span></p>
        <p className="intro-tagline">Cybersecurity <i>·</i> IT <i>·</i> Automation</p>
        <div className="intro-progress" aria-hidden="true"><span /></div>
        <p className="intro-status">Initializing experience<span className="intro-ellipsis">...</span></p>
      </div>
    </div>
  );
}
