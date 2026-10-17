"use client";

import { useEffect, useRef } from "react";

/** A passive pointer light: the browser's native cursor remains visible and fully functional. */
export default function MagicCursor() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const light = lightRef.current;
    if (!light || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let visible = false;
    let x = -100;
    let y = -100;
    let targetX = x;
    let targetY = y;
    const animate = () => {
      frame = 0;
      if (document.hidden || !visible) return;
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      light.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.4) frame = requestAnimationFrame(animate);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      visible = true;
      light.classList.add("is-visible");
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => { visible = false; light.classList.remove("is-visible"); };
    const visibility = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        leave();
      }
    };
    const preference = () => {
      if (reducedMotion.matches || !finePointer.matches) leave();
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    finePointer.addEventListener("change", preference);
    reducedMotion.addEventListener("change", preference);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      finePointer.removeEventListener("change", preference);
      reducedMotion.removeEventListener("change", preference);
    };
  }, []);

  return (
    <div className="pointer-ambience" aria-hidden="true">
      <div className="pointer-ambience-light" ref={lightRef} />
    </div>
  );
}
