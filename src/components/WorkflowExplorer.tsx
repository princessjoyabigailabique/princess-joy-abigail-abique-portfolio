"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { WORKFLOW } from "@/data/workflow";

export default function WorkflowExplorer() {
  const [id, setId] = useState(WORKFLOW[0].id);
  const n = WORKFLOW.find((x) => x.id === id)!;
  return (
    <div>
      <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch" aria-label="Workflow steps">
        {WORKFLOW.map((w, i) => (
          <li key={w.id} className="flex flex-1 items-center gap-2">
            <button onClick={() => setId(w.id)} aria-pressed={w.id === id} className={`card flex-1 p-3 text-left transition ${w.id === id ? "border-accent shadow-neon" : "hover:border-accent/50"}`}>
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <span className="block font-semibold">{w.label}</span>
              <span className="text-xs text-muted">{w.short}</span>
            </button>
            {i < WORKFLOW.length - 1 && <ChevronRight className="hidden h-4 w-4 shrink-0 self-center text-accent lg:block" aria-hidden />}
          </li>
        ))}
      </ol>
      <div className="card mt-4 grid gap-5 p-5 md:grid-cols-2" aria-live="polite">
        <div>
          <h3 className="text-lg font-bold">{n.label}</h3>
          <p className="mt-1 text-sm text-muted">{n.does}</p>
          <h4 className="mt-4 text-sm font-semibold">Logic</h4><p className="text-sm text-muted">{n.logic}</p>
          <h4 className="mt-4 text-sm font-semibold">Place in the workflow</h4><p className="text-sm text-muted">{n.place}</p>
        </div>
        <div className="grid gap-4 text-sm">
          <div><h4 className="font-semibold">Inputs</h4><ul className="list-disc pl-5 text-muted">{n.inputs.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h4 className="font-semibold">Outputs</h4><ul className="list-disc pl-5 text-muted">{n.outputs.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h4 className="font-semibold">Error handling</h4><ul className="list-disc pl-5 text-muted">{n.errors.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">Generic workflow pattern used across my projects. It illustrates the design; it is not a live n8n execution.</p>
    </div>
  );
}
