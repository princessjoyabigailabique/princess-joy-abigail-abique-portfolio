"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Play, RotateCcw } from "lucide-react";
import { EMAIL_SAMPLES, LEAD_SAMPLES } from "@/data/workflow";
import { SimBanner } from "./ui";

export function EmailDemo() {
  const [sel, setSel] = useState(EMAIL_SAMPLES[0].id);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const e = EMAIL_SAMPLES.find((x) => x.id === sel)!;
  const steps = [
    ["Email received", "Demo email loaded"],
    ["Workflow triggered", "Simulated n8n run started"],
    ["AI analysis", `Category: ${e.category}`],
    ["Priority", e.priority],
    ["Routing", e.route],
    ["Draft / notify", e.reply],
    ["Logged", "Row added to a sample table (not a real sheet)"],
  ];
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  function reset() { if (timer.current) clearInterval(timer.current); setRunning(false); setStep(0); }
  function run() {
    reset(); setRunning(true); let i = 0; setStep(1);
    timer.current = setInterval(() => { i++; setStep(i + 1); if (i >= steps.length - 1) { clearInterval(timer.current!); setRunning(false); } }, 650);
  }
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted"><span>workspace / automation / ai-email-operations-assistant</span><span className="flex gap-2"><span className="badge border-warn/50 text-warn">DEMO DATA</span><span className="badge border-warn/50 text-warn">SIMULATED EXECUTION</span></span></div>
      <label className="mt-4 block text-sm font-semibold" htmlFor="email-sample">Sample email</label>
      <select id="email-sample" value={sel} onChange={(ev) => { setSel(ev.target.value); reset(); }} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm">
        {EMAIL_SAMPLES.map((x) => <option key={x.id} value={x.id}>{x.subject}</option>)}
      </select>
      <div className="mt-3 rounded-xl border border-dashed border-line p-4 text-sm"><p className="text-xs text-muted">From: {e.from}</p><p className="font-semibold">{e.subject}</p><p className="mt-1 text-muted">{e.body}</p></div>
      <div className="mt-3 flex gap-2">
        <button className="btn-primary" onClick={run} disabled={running}><Play className="h-4 w-4" aria-hidden /> {step ? "Run again" : "Execute workflow (simulation)"}</button>
        <button className="btn-ghost" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2" aria-live="polite">
        {steps.map(([t, d], i) => (
          <li key={t} className={`rounded-xl border p-3 text-sm transition ${i < step ? "border-good/50 bg-good/5" : "border-line text-muted"}`}>
            <p className="flex items-center gap-2 font-semibold">{i < step && <Check className="h-4 w-4 text-good" aria-hidden />}{t}</p>
            <p className="text-xs text-muted">{i < step ? d : "Waiting…"}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3"><SimBanner>Runs entirely in your browser with sample data. It isn’t connected to Gmail, Google Sheets, Telegram, OpenAI or any real account, and AI replies are drafts for human approval.</SimBanner></div>
    </div>
  );
}

export function LeadDemo() {
  const [sel, setSel] = useState(LEAD_SAMPLES[0].id);
  const [done, setDone] = useState(false);
  const l = LEAD_SAMPLES.find((x) => x.id === sel)!;
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted"><span>workspace / automation / va-lead-management</span><span className="flex gap-2"><span className="badge border-warn/50 text-warn">DEMO DATA</span><span className="badge border-warn/50 text-warn">SIMULATED EXECUTION</span></span></div>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="lead-sample" className="text-sm font-semibold">Fictional lead</label>
          <select id="lead-sample" value={sel} onChange={(ev) => { setSel(ev.target.value); setDone(false); }} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm">
            {LEAD_SAMPLES.map((x) => <option key={x.id} value={x.id}>{x.name} — {x.service}</option>)}
          </select>
          <dl className="mt-3 space-y-1 text-sm"><div><dt className="inline text-muted">Name: </dt><dd className="inline">{l.name}</dd></div><div><dt className="inline text-muted">Email: </dt><dd className="inline">{l.email}</dd></div><div><dt className="inline text-muted">Service: </dt><dd className="inline">{l.service}</dd></div></dl>
          <div className="mt-4 flex gap-2"><button className="btn-primary" onClick={() => setDone(true)}>Submit demo lead</button><button className="btn-ghost" onClick={() => setDone(false)}><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button></div>
        </div>
        <div aria-live="polite" className="rounded-xl border border-line p-4 text-sm">
          <p className="font-semibold">Routing result (simulated)</p>
          {done ? (
            <dl className="mt-2 space-y-1"><div><dt className="inline text-muted">Summary: </dt><dd className="inline">{l.summary}</dd></div><div><dt className="inline text-muted">Priority: </dt><dd className="inline font-semibold">{l.priority}</dd></div><div><dt className="inline text-muted">Next step: </dt><dd className="inline">{l.next}</dd></div></dl>
          ) : <p className="mt-2 text-muted">Submit the demo lead to see how priority routing would work.</p>}
        </div>
      </div>
      <div className="mt-3"><SimBanner>Local simulation with fictional data. Priority here is determined by fixed sample values in this page, not by a live n8n run. No lead data is sent anywhere.</SimBanner></div>
    </div>
  );
}
