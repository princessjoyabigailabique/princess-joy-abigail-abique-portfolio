"use client";
import { useState } from "react";
import { SOC_SCENARIOS } from "@/data/soc";
import { SimBanner } from "./ui";

const sev = { Low: "text-info border-info/50", Medium: "text-warn border-warn/50", High: "text-bad border-bad/50" } as const;
const verdictStyle = { best: "border-good/60 bg-good/10", partial: "border-warn/60 bg-warn/10", weak: "border-bad/60 bg-bad/10" } as const;
const verdictText = { best: "Strong triage decision", partial: "Partly right", weak: "Needs rethinking" } as const;

export default function SocLab() {
  const [id, setId] = useState(SOC_SCENARIOS[0].id);
  const [choice, setChoice] = useState<number | null>(null);
  const s = SOC_SCENARIOS.find((x) => x.id === id)!;
  const picked = choice === null ? null : s.options[choice];

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 font-mono text-xs text-muted">
        <span>workspace / security-lab / simulated-soc</span>
        <span className="flex gap-2"><span className="badge border-warn/50 text-warn">SIMULATED DATA</span><span className="badge border-warn/50 text-warn">NOT A REAL ENVIRONMENT</span></span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
        <ul aria-label="Simulated alerts" className="border-b border-line p-3 lg:border-b-0 lg:border-r">
          {SOC_SCENARIOS.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => { setId(x.id); setChoice(null); }}
                aria-pressed={x.id === id}
                className={`mb-2 w-full rounded-xl border p-3 text-left transition ${x.id === id ? "border-accent bg-accent/10" : "border-line hover:border-accent/50"}`}
              >
                <span className="block text-sm font-semibold">{x.title}</span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted"><span className={`badge ${sev[x.severity]}`}>{x.severity}</span>{x.time}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="min-w-0 space-y-5 p-5">
          <div>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted">{s.summary}</p>
            <p className="mt-2 text-xs text-muted">Source: {s.source} · MITRE ATT&CK: {s.mitre}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-accent">Fictional log excerpt</p>
            <pre className="overflow-x-auto rounded-xl border border-line bg-bg p-3 font-mono text-xs leading-relaxed" tabIndex={0} aria-label="Fictional log excerpt">{s.logs.join("\n")}</pre>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">What is your triage decision?</legend>
            <div className="grid gap-2">
              {s.options.map((o, i) => (
                <label key={o.label} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${choice === i ? "border-accent bg-accent/10" : "border-line hover:border-accent/50"}`}>
                  <input type="radio" name={`triage-${s.id}`} checked={choice === i} onChange={() => setChoice(i)} className="mt-1 accent-purple-500" />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div aria-live="polite">
            {picked && (
              <div className={`rounded-xl border p-4 text-sm ${verdictStyle[picked.verdict]}`}>
                <p className="font-semibold">{verdictText[picked.verdict]}</p>
                <p className="mt-1">{picked.feedback}</p>
                <p className="mt-3 font-semibold">Evidence to check next</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">{s.nextEvidence.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
            )}
          </div>
          <SimBanner>Educational simulation with fictional events, running entirely in your browser. It is not connected to a SIEM, does not monitor systems or detect real threats, and is not a real investigation I performed.</SimBanner>
        </div>
      </div>
    </div>
  );
}
