"use client";
import { useState } from "react";
import { Download, Eye, FileWarning } from "lucide-react";

export default function ResumeCard({ r, available }: { r: { title: string; blurb: string; file: string; downloadName: string }; available: boolean }) {
  const [missing, setMissing] = useState(false);
  const ok = available && !missing;
  async function view() {
    try {
      const res = await fetch(r.file, { method: "HEAD" });
      if (!res.ok) throw new Error();
      window.open(r.file, "_blank", "noopener,noreferrer");
    } catch { setMissing(true); }
  }
  return (
    <article className="card card-hover flex flex-col p-6">
      <h2 className="text-xl font-bold">{r.title}</h2>
      <p className="mt-2 flex-1 text-sm text-muted">{r.blurb}</p>
      {ok ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={view}><Eye className="h-4 w-4" aria-hidden /> View Resume</button>
          <a className="btn-ghost" href={r.file} download={r.downloadName}><Download className="h-4 w-4" aria-hidden /> Download PDF</a>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-warn/50 bg-warn/10 p-4 text-sm text-warn" role="status">
          <p className="flex items-center gap-2 font-semibold"><FileWarning className="h-4 w-4" aria-hidden /> PDF not connected yet</p>
          {process.env.NODE_ENV === "production" ? (
            <p className="mt-1">This resume isn’t available online yet. Please <a className="underline" href="/contact">contact me</a> to request a copy.</p>
          ) : (
            <p className="mt-1">Dev note: add <code className="font-mono">{r.downloadName}</code> to <code className="font-mono">/public/resumes</code>, then rebuild/redeploy.</p>
          )}
        </div>
      )}
    </article>
  );
}
