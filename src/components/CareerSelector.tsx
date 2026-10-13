"use client";
import Link from "next/link";
import { useState } from "react";
import { AREAS } from "@/data/projects";
import AreaIcon from "./AreaIcon";
import { StatusBadge } from "./ui";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CareerSelector() {
  const [id, setId] = useState(AREAS[0].id);
  const active = AREAS.find((a) => a.id === id)!;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div role="tablist" aria-label="Choose a technical area" className="relative grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-400 shadow-neon sm:flex">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        {AREAS.map((a) => {
          const selected = a.id === id;
          return (
            <button
              key={a.id}
              role="tab"
              id={`tab-${a.id}`}
              aria-selected={selected}
              aria-controls="area-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setId(a.id)}
              onKeyDown={(e) => {
                const i = AREAS.findIndex((x) => x.id === id);
                if (e.key === "ArrowRight" || e.key === "ArrowDown") setId(AREAS[(i + 1) % 4].id);
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") setId(AREAS[(i + 3) % 4].id);
              }}
              className={`card z-10 flex min-h-[9.5rem] min-w-0 flex-col items-center justify-center gap-2 p-3 text-center transition sm:p-4 ${
                selected ? "border-accent shadow-neon" : "hover:border-accent/50"
              }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-full border ${selected ? "border-accent text-accent" : "border-line text-ink/80"}`}>
                <AreaIcon area={a.id} />
              </span>
              <span className="font-semibold">{a.label}</span>
              <span className="break-words text-xs text-muted">{a.topics.slice(0, 2).join(" · ")}</span>
            </button>
          );
        })}
      </div>

      <div id="area-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="card p-6" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-3 text-xl font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent text-accent">
              <AreaIcon area={active.id} className="h-5 w-5" />
            </span>
            {active.label}
          </h3>
          <span className="chip border-accent/50 text-accent">Selected</span>
        </div>
        <p className="mt-4 text-muted">{active.blurb}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics and tools">
          {active.topics.map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Current focus:</span> <strong>{active.focus}</strong>
          <StatusBadge status={active.focusStatus} />
        </p>
        <div className="mt-6">
          <Link href={active.href} className="btn-primary">
            Explore {active.label} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
