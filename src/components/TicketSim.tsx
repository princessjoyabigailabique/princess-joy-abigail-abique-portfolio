"use client";
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { TICKETS } from "@/data/tickets";
import { SimBanner } from "./ui";

export default function TicketSim() {
  const [tid, setTid] = useState(TICKETS[0].id);
  const [stage, setStage] = useState(0);
  const [msg, setMsg] = useState<{ good: boolean; text: string } | null>(null);
  const t = TICKETS.find((x) => x.id === tid)!;
  const done = stage >= t.stages.length;
  const reset = (id = tid) => { setTid(id); setStage(0); setMsg(null); };

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="ticket" className="text-sm font-semibold">Sample ticket</label>
        <select id="ticket" value={tid} onChange={(e) => reset(e.target.value)} className="w-full max-w-full rounded-lg sm:w-auto border border-line bg-bg px-3 py-1.5 text-sm">{TICKETS.map((x) => <option key={x.id} value={x.id}>{x.id} — {x.issue}</option>)}</select>
        <span className="badge border-warn/50 text-warn">SIMULATED EXAMPLE</span>
      </div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <dl className="rounded-xl border border-line p-4 font-mono text-xs leading-7">
          {[["Ticket", t.id], ["Requester", t.requester], ["Department", t.dept], ["Issue", t.issue], ["Priority", t.priority], ["Device", t.device]].map(([k, v]) => (
            <div key={k} className="flex gap-3"><dt className="w-24 shrink-0 text-muted">{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <div>
          <ol className="mb-3 flex flex-wrap gap-1.5" aria-label="Progress">
            {t.stages.map((s, i) => <li key={s.name} className={`chip ${i < stage ? "border-good/60 text-good" : i === stage ? "border-accent text-accent" : "text-muted"}`}>{i < stage && <Check className="mr-1 h-3 w-3" aria-hidden />}{i + 1}. {s.name}</li>)}
          </ol>
          {!done ? (
            <fieldset>
              <legend className="text-sm font-semibold">{t.stages[stage].name}: {t.stages[stage].prompt}</legend>
              <div className="mt-2 grid gap-2">
                {t.stages[stage].options.map((o) => (
                  <button key={o.label} onClick={() => { setMsg({ good: o.good, text: o.why }); if (o.good) setStage((s) => s + 1); }} className="rounded-xl border border-line p-3 text-left text-sm transition hover:border-accent">{o.label}</button>
                ))}
              </div>
            </fieldset>
          ) : (
            <div className="rounded-xl border border-good/50 bg-good/10 p-4 text-sm"><p className="font-semibold">Ticket documented (simulation)</p><p className="mt-1">{t.resolution}</p></div>
          )}
          <div aria-live="polite" className="mt-3 min-h-6 text-sm">{msg && <p className={msg.good ? "text-good" : "text-bad"}>{msg.good ? "Good step. " : "Not quite. "}{msg.text}</p>}</div>
          <button className="btn-ghost mt-2" onClick={() => reset()}><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
        </div>
      </div>
      <div className="mt-4"><SimBanner>These are fictional training tickets in your browser. They do not represent real client or workplace support work.</SimBanner></div>
    </div>
  );
}
