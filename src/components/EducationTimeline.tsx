"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, School, X } from "lucide-react";
import { EDUCATION, type EducationEntry } from "@/data/education";

const LEVEL_ICON = [GraduationCap, School, BookOpen, BookOpen];

export default function EducationTimeline() {
  const [active, setActive] = useState<EducationEntry | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (active.photos.length > 1 && event.key === "ArrowRight") setPhotoIndex((index) => (index + 1) % active.photos.length);
      if (active.photos.length > 1 && event.key === "ArrowLeft") setPhotoIndex((index) => (index - 1 + active.photos.length) % active.photos.length);
      if (event.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [active]);

  const openGallery = (entry: EducationEntry) => {
    setPhotoIndex(0);
    setActive(entry);
  };

  const movePhoto = (step: number) => {
    if (!active || active.photos.length < 2) return;
    setPhotoIndex((index) => (index + step + active.photos.length) % active.photos.length);
  };

  return (
    <>
      <ol className="education-timeline" aria-label="Education history">
        {EDUCATION.map((entry, index) => {
          const Icon = LEVEL_ICON[index] ?? School;
          return <li className="education-timeline-item" key={entry.id}>
            <span className="education-marker" aria-hidden><Icon size={18} /></span>
            <button type="button" className="education-card" onClick={() => openGallery(entry)} aria-label={`Open photo gallery for ${entry.school}, ${entry.level}, ${entry.years}. ${entry.course ? `${entry.course}. ` : ""}${entry.highlights.join(". ")}. ${entry.chapter}`}>
              <span className={`education-preview education-preview-${index + 1}`} aria-hidden>
                <span className="education-preview-grid" />
                <Icon className="education-preview-icon" size={42} strokeWidth={1.2} />
                <span className="education-preview-code">EDU / 0{index + 1}</span>
              </span>
              <span className="education-card-content">
                <span className="education-card-top"><span className="education-level">{entry.level}</span><span className="education-years">{entry.years}</span></span>
                <span className="education-school">{entry.school}</span>
                {entry.course && <span className="education-course">{entry.course}</span>}
                <span className="education-achievements">{entry.highlights.map((highlight) => <span className="education-highlight" key={highlight}>{highlight}</span>)}</span>
                <span className="education-overlay" aria-hidden="true"><span className="education-overlay-label">THIS CHAPTER</span><span>{entry.chapter}</span><span className="education-open-label">Open memories <ChevronRight size={15} /></span></span>
              </span>
            </button>
          </li>;
        })}
      </ol>

      {active && <div className="education-lightbox" onMouseDown={(event) => { if (event.target === event.currentTarget) setActive(null); }}>
        <section ref={dialogRef} className="education-dialog" role="dialog" aria-modal="true" aria-labelledby="education-dialog-title" aria-describedby="education-dialog-caption" tabIndex={-1}>
          <div className="education-dialog-header">
            <div><p className="kicker">{active.level} · {active.years}</p><h3 id="education-dialog-title" className="mt-1 text-lg font-bold sm:text-xl">{active.school}</h3></div>
            <button ref={closeRef} type="button" className="education-close" onClick={() => setActive(null)} aria-label="Close school photo gallery"><X size={20} aria-hidden /></button>
          </div>
          {active.photos.length > 0 ? <>
            <div className="education-photo-frame">
              <Image key={active.photos[photoIndex].src} src={active.photos[photoIndex].src} alt={active.photos[photoIndex].alt ?? active.photos[photoIndex].caption} width={1400} height={1000} className="education-photo" priority />
              {active.photos.length > 1 && <><button type="button" className="education-nav education-nav-prev" onClick={() => movePhoto(-1)} aria-label="Previous photo"><ChevronLeft size={22} /></button><button type="button" className="education-nav education-nav-next" onClick={() => movePhoto(1)} aria-label="Next photo"><ChevronRight size={22} /></button></>}
            </div>
            <div id="education-dialog-caption" className="education-caption"><p>{active.photos[photoIndex].caption}</p><span>{photoIndex + 1} / {active.photos.length}</span></div>
            {active.photos.length > 1 && <div className="education-thumbnails" aria-label="Choose a photo">{active.photos.map((photo, index) => <button key={photo.src} className={`education-thumbnail ${photoIndex === index ? "is-active" : ""}`} onClick={() => setPhotoIndex(index)} aria-label={`Show photo ${index + 1}: ${photo.caption}`} aria-current={photoIndex === index}><Image src={photo.src} alt="" width={100} height={72} /></button>)}</div>}
          </> : <div className="education-empty" id="education-dialog-caption"><span className="education-empty-icon"><School size={30} aria-hidden /></span><p className="font-semibold">Memories coming soon</p><p className="mt-2 max-w-sm text-sm text-muted">School photos will appear here when they’re added.</p><p className="mt-4 font-mono text-xs text-accent">{active.photoDirectory}</p></div>}
        </section>
      </div>}
    </>
  );
}
