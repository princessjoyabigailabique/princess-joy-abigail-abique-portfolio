"use client";

import { useEffect, useRef } from "react";

const CLICKABLE_TARGETS = "a, button, select, summary, input[type='button'], input[type='submit'], input[type='reset'], input[type='checkbox'], input[type='radio'], [role='button'], [role='link'], [role='checkbox'], [role='switch'], [aria-pressed], [tabindex]:not([tabindex='-1']), [class~='cursor-pointer'], [data-cursor-heart]";
const TEXT_INPUTS = "textarea, input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio'])";

export default function MagicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const sparkleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const burstRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const body = document.body;
    const cursor = cursorRef.current;
    const layer = cursor?.parentElement as (HTMLDivElement & { showPopover?: () => void; hidePopover?: () => void }) | null;
    let sparkleIndex = 0;

    const canShow = () => finePointer.matches && !reducedMotion.matches;
    const showLayer = () => {
      try {
        if (layer?.showPopover && !layer.matches(":popover-open")) layer.showPopover();
      } catch { /* The high-z-index fallback remains available if the browser rejects the popover. */ }
    };
    const promoteLayerAboveDialog = () => {
      if (!layer?.showPopover || !layer.hidePopover || !layer.matches(":popover-open")) return;
      try {
        layer.hidePopover();
        layer.showPopover();
      } catch { /* Keep the cursor visible using its normal stacking context. */ }
    };
    const disable = () => {
      body.classList.remove("magic-cursor-active");
      cursor?.classList.remove("is-visible", "is-heart");
      try { if (layer?.matches(":popover-open")) layer.hidePopover?.(); } catch { /* Ignore unsupported popover state. */ }
    };

    const onMove = (event: PointerEvent) => {
      if (!canShow() || event.pointerType !== "mouse" || !cursor) return;
      showLayer();
      body.classList.add("magic-cursor-active");
      cursor.classList.add("is-visible");
      const target = event.target instanceof Element ? event.target.closest(CLICKABLE_TARGETS) : null;
      const useNativeCursor = event.target instanceof Element && Boolean(event.target.closest(TEXT_INPUTS));
      cursor.classList.toggle("is-heart", Boolean(target) && !useNativeCursor);
      cursor.classList.toggle("is-native", useNativeCursor);
      cursor.style.transform = `translate3d(${event.clientX - 5}px, ${event.clientY - 5}px, 0)`;

      if (!useNativeCursor) {
        const sparkle = sparkleRefs.current[sparkleIndex % sparkleRefs.current.length];
        sparkleIndex += 1;
        if (sparkle) {
          sparkle.style.left = `${event.clientX}px`;
          sparkle.style.top = `${event.clientY}px`;
          sparkle.classList.remove("is-trailing");
          void sparkle.offsetWidth;
          sparkle.classList.add("is-trailing");
        }
      }
    };

    const onDown = (event: PointerEvent) => {
      if (!canShow() || event.pointerType !== "mouse" || event.target instanceof Element && event.target.closest(TEXT_INPUTS)) return;
      const burst = burstRef.current;
      if (!burst) return;
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      burst.classList.remove("is-bursting");
      void burst.offsetWidth;
      burst.classList.add("is-bursting");
    };

    const onLeave = () => {
      body.classList.remove("magic-cursor-active");
      cursor?.classList.remove("is-visible", "is-heart", "is-native");
    };
    const onWindowBlur = onLeave;
    const onPreferenceChange = () => {
      if (!canShow()) disable();
    };

    const dialogs = new MutationObserver((records) => {
      const dialogChanged = records.some((record) => record.attributeName === "open"
        || Array.from(record.addedNodes).some((node) => node instanceof Element && (node.matches("dialog[open]") || node.querySelector("dialog[open]"))));
      if (dialogChanged && canShow() && document.querySelector("dialog[open]")) promoteLayerAboveDialog();
    });
    dialogs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
    if (canShow()) showLayer();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onWindowBlur);
    finePointer.addEventListener("change", onPreferenceChange);
    reducedMotion.addEventListener("change", onPreferenceChange);

    return () => {
      disable();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onWindowBlur);
      dialogs.disconnect();
      finePointer.removeEventListener("change", onPreferenceChange);
      reducedMotion.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div className="magic-cursor-layer" popover="manual" aria-hidden="true">
      <div className="magic-cursor" ref={cursorRef}>
        <svg viewBox="0 0 36 36" className="magic-wand" fill="none">
          <path d="M10 10 26 27" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M10 10 26 27" stroke="white" strokeOpacity=".72" strokeWidth="1" strokeLinecap="round" />
          <path d="M6 2.5v6M3 5.5h6M29 25v5M26.5 27.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m17 14 1-3 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" fill="white" />
          <circle cx="10" cy="10" r="2.2" fill="white" />
        </svg>
        <svg viewBox="0 0 36 36" className="magic-heart" aria-hidden="true">
          <defs>
            <linearGradient id="magic-heart-fill" x1="7" y1="5" x2="30" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--magic-heart-highlight)" />
              <stop offset=".48" stopColor="var(--magic-heart-mid)" />
              <stop offset="1" stopColor="var(--magic-heart-shadow)" />
            </linearGradient>
            <linearGradient id="magic-heart-edge" x1="5" y1="7" x2="31" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--magic-heart-edge)" />
              <stop offset="1" stopColor="var(--magic-heart-edge-deep)" />
            </linearGradient>
            <radialGradient id="magic-heart-gloss" cx="0" cy="0" r="1" gradientTransform="matrix(11 0 0 7 12 10)" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity=".82" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="magic-heart-inner" cx="0" cy="0" r="1" gradientTransform="matrix(0 12 -11 0 20 19)" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--magic-heart-core)" stopOpacity=".8" />
              <stop offset="1" stopColor="var(--magic-heart-core)" stopOpacity="0" />
            </radialGradient>
            <clipPath id="magic-heart-clip">
              <path d="M18 31s-12.5-7.8-12.5-16.2A6.4 6.4 0 0 1 18 11.5a6.4 6.4 0 0 1 12.5 3.3C30.5 23.2 18 31 18 31Z" />
            </clipPath>
          </defs>
          <path d="M18 31s-12.5-7.8-12.5-16.2A6.4 6.4 0 0 1 18 11.5a6.4 6.4 0 0 1 12.5 3.3C30.5 23.2 18 31 18 31Z" transform="translate(0 1.7)" fill="var(--magic-heart-shadow)" opacity=".9" />
          <path d="M18 31s-12.5-7.8-12.5-16.2A6.4 6.4 0 0 1 18 11.5a6.4 6.4 0 0 1 12.5 3.3C30.5 23.2 18 31 18 31Z" fill="url(#magic-heart-fill)" stroke="url(#magic-heart-edge)" strokeWidth="1.6" />
          <ellipse cx="20" cy="19" rx="11" ry="12" fill="url(#magic-heart-inner)" clipPath="url(#magic-heart-clip)" />
          <path d="M8.3 14.4c.3-4.8 4.8-6.2 8-3.8 1.2.9 1.9 2.5 1.8 4.1-3-2.2-6.8-1.8-9.8-.3Z" fill="url(#magic-heart-gloss)" />
          <path d="M8.4 15.5c.5-3.3 2.7-4.6 5-4.7" fill="none" stroke="white" strokeOpacity=".92" strokeWidth="1.2" strokeLinecap="round" />
          <path d="m22.2 17 .6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" fill="white" />
          <path d="m12.2 19 .4 1 .9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4.4-1Z" fill="white" fillOpacity=".92" />
        </svg>
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <span
          className={`magic-cursor-sparkle sparkle-${index + 1}`}
          key={index}
          ref={(element) => { sparkleRefs.current[index] = element; }}
        />
      ))}
      <span className="magic-cursor-burst" ref={burstRef} />
    </div>
  );
}
