"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { StatusBadge } from "./ui";

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
        <div className="mt-2"><StatusBadge status={project.status} /></div>
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
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold leading-snug">{p.title}</h3>
              <StatusBadge status={p.status} />
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
