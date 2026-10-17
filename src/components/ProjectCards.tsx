"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { StatusBadge } from "./ui";

function gardenStage(status: Project["status"]) {
  if (status === "completed") return "Bloomed · Completed";
  if (status === "in-progress") return "Growing · In progress";
  if (status === "planned") return "Seed · Planned";
  return undefined;
}

function ProjectVisual({ area }: { area: Project["area"] }) {
  if (area === "ai-automation") return <div className="project-preview preview-flow" aria-hidden><span className="preview-label">FLOW / LOCAL DEMO</span><div className="preview-nodes"><i>IN</i><b /><i>AI</i><b /><i>OUT</i></div><div className="preview-caption">parse <span>→</span> decide <span>→</span> route</div></div>;
  if (area === "networking") return <div className="project-preview preview-network" aria-hidden><span className="preview-label">TOPOLOGY / LAB</span><svg viewBox="0 0 300 92"><path d="M150 19 79 68M150 19 221 68M79 68 32 82M79 68 112 82M221 68 188 82M221 68 268 82"/><circle cx="150" cy="19" r="10"/><rect x="65" y="57" width="28" height="20" rx="4"/><rect x="207" y="57" width="28" height="20" rx="4"/><circle cx="32" cy="82" r="5"/><circle cx="112" cy="82" r="5"/><circle cx="188" cy="82" r="5"/><circle cx="268" cy="82" r="5"/></svg></div>;
  if (area === "cybersecurity") return <div className="project-preview preview-terminal" aria-hidden><span className="preview-label">SOC / SIMULATED</span><code><i>17:32:11</i> auth · MFA completed<br /><i>17:29:48</i> login · <b>review</b><br /><i>17:24:03</i> email · domain mismatch</code></div>;
  if (area === "it-support") return <div className="project-preview preview-ticket" aria-hidden><span className="preview-label">SUPPORT / TICKET</span><div className="ticket-line"><b>INC-2048</b><span>In progress</span></div><div className="ticket-line"><span>Wi-Fi connectivity</span><i>Priority: medium</i></div><div className="ticket-progress"><i /></div></div>;
  return <div className="project-preview preview-academic" aria-hidden><span className="preview-label">PROJECT / OVERVIEW</span><div className="preview-academic-title">{area === "academic" ? "DOCUMENTED PROJECT" : "TECHNICAL WORKSPACE"}</div><div className="preview-bars"><i /><i /><i /></div></div>;
}

function Dialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="proj-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="w-[min(92vw,38rem)] rounded-2xl border border-accent/50 bg-surface p-0 text-ink shadow-neon backdrop:bg-black/70"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 id="proj-title" className="text-xl font-bold">{project.title}</h3>
          <button onClick={onClose} aria-label="Close project details" className="rounded-lg p-1 hover:bg-surface2"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-2"><StatusBadge status={project.status} label={gardenStage(project.status)} /></div>
        <p className="mt-4 text-sm text-muted">{project.summary}</p>
        {project.tools.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">{project.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
        )}
        <h4 className="mt-5 text-sm font-semibold">Known details</h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">{project.confirmed.map((c) => <li key={c}>{c}</li>)}</ul>
        <h4 className="mt-4 text-sm font-semibold">Limits & honesty notes</h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">{project.limitations.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="mt-6 flex gap-3">
          <Link href={project.href} className="btn-primary">Open related page</Link>
          <button onClick={onClose} className="btn-ghost">Close</button>
        </div>
      </div>
    </dialog>
  );
}

export default function ProjectCards({ slugs, extra }: { slugs?: string[]; extra?: React.ReactNode }) {
  const [open, setOpen] = useState<Project | null>(null);
  const list = slugs ? PROJECTS.filter((p) => slugs.includes(p.slug)) : PROJECTS;
  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.slug} className="card card-hover flex flex-col p-5">
            <ProjectVisual area={p.area} />
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold leading-snug">{p.title}</h3>
              <StatusBadge status={p.status} label={gardenStage(p.status)} />
            </div>
            <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
            {p.tools.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">{p.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
            )}
            <button onClick={() => setOpen(p)} className="btn-ghost mt-4 self-start">View project details</button>
          </li>
        ))}
        {extra}
      </ul>
      {open && <Dialog project={open} onClose={() => setOpen(null)} />}
    </>
  );
}
