"use client";
import { useState } from "react";
import { ChevronDown, Gamepad2 } from "lucide-react";

export default function PersonalSection() {
  const [open, setOpen] = useState(false);
  // No personal content has been written yet: hide the section in production rather than ship a placeholder.
  if (process.env.NODE_ENV === "production") return null;
  return (
    <section className="container-page py-8" aria-labelledby="personal-h">
      <div className="card border-accent/50 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent"><Gamepad2 className="h-6 w-6" aria-hidden /></span>
            <div>
              <p className="kicker">Outside the tech</p>
              <h2 id="personal-h" className="text-xl font-bold">A little more about me</h2>
            </div>
          </div>
          <button type="button" className="btn-ghost" aria-expanded={open} aria-controls="personal-body" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Click to view"} <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>
        {open && (
          <div id="personal-body" className="mt-5 rounded-xl border border-dashed border-accent/50 bg-surface2/60 p-4 text-sm text-muted">
            <p><strong className="text-ink">Placeholder — not written yet.</strong> This section is reserved for your own hobbies and interests. I haven’t invented any; add your real details in <code className="font-mono">src/app/about/page.tsx</code> (or a data file) when you’re ready.</p>
          </div>
        )}
      </div>
    </section>
  );
}
