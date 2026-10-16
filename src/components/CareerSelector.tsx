"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AREAS, PROJECTS } from "@/data/projects";
import AreaIcon from "./AreaIcon";
import { StatusBadge } from "./ui";
import styles from "./CareerSelector.module.css";
import AbiqueMark from "./AbiqueMark";

const FEATURES: Record<string, string> = {
  cybersecurity: "security-lab",
  "ai-automation": "ai-email-operations-assistant",
  networking: "packet-tracer-device-setup",
  "it-support": "support-ticket-simulation",
};

export default function CareerSelector() {
  const [id, setId] = useState(AREAS[0].id);
  const active = AREAS.find((a) => a.id === id)!;
  const project = PROJECTS.find((p) => p.slug === FEATURES[id]) ?? PROJECTS.find((p) => p.href.startsWith(active.href)) ?? PROJECTS[0];

  return (
    <div className={styles.layout}>
      <div className={styles.hub} aria-label="Interactive technical paths">
        <svg className={styles.wires} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[[16, 18], [84, 18], [16, 82], [84, 82]].map(([x, y], i) => <line key={i} x1="50" y1="50" x2={x} y2={y} className={`${styles.wire} ${active.num === `0${i + 1}` ? styles.activeWire : ""}`} />)}
          <circle cx="50" cy="50" r="15" className={styles.ring} />
        </svg>
        <div className={styles.core}>
          <span className={styles.coreIcon}><AbiqueMark size={56} /></span>
          <span className={styles.coreName}>ABIQUE</span>
          <span className={styles.coreRole}>DIGITAL WORKSPACE</span>
        </div>
        {AREAS.map((area, index) => {
          const selected = area.id === id;
          return (
            <button key={area.id} type="button" className={`${styles.node} ${styles[`node${index}`]} ${selected ? styles.selected : ""}`} onClick={() => setId(area.id)} onMouseEnter={() => setId(area.id)} onFocus={() => setId(area.id)} aria-controls="area-panel" aria-pressed={selected}>
              <span className={styles.nodeIcon}><AreaIcon area={area.id} /></span>
              <span className={styles.nodeText}><span className={styles.nodeNum}>{area.num} / PATH</span><strong>{area.label}</strong><small>{area.topics.slice(0, 2).join(" · ")}</small></span>
            </button>
          );
        })}
        <span aria-hidden className={`${styles.spark} ${styles.sparkA}`} />
        <span aria-hidden className={`${styles.spark} ${styles.sparkB}`} />
        <span className={styles.note}>choose a signal ↗</span>
      </div>

        <section id="area-panel" className={styles.panel} role="region" aria-labelledby={`path-title-${active.id}`} aria-live="polite">
        <div className={styles.panelTop}><span className={styles.signal}><i /> SIGNAL SELECTED</span><span className="font-mono text-xs text-muted">{active.num} / 04</span></div>
        <p className="kicker mt-5">{active.label}</p>
        <h3 id={`path-title-${active.id}`} className={styles.panelTitle}>{active.focus}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{active.blurb}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[.14em] text-muted">Skills in this path</p>
        <ul className="mt-2 flex flex-wrap gap-2">{active.topics.map((topic) => <li key={topic} className="chip">{topic}</li>)}</ul>
        <div className={styles.feature}>
          <div className={styles.featureHeading}><span>FEATURED SIGNAL</span><StatusBadge status={project.status} /></div>
          <h4>{project.title}</h4>
          <p>{project.summary}</p>
          <Link href={project.href} className={styles.projectLink}>Open project <ArrowUpRight size={15} aria-hidden /></Link>
        </div>
        <Link href={active.href} className="btn-primary mt-5 w-full">Explore {active.label} <ArrowUpRight size={16} aria-hidden /></Link>
      </section>
    </div>
  );
}
