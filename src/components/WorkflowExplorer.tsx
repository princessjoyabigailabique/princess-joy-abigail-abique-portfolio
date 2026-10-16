"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const processSteps = [
  {
    title: "Understand the problem",
    description: "Identify repetitive tasks, the information involved, and the outcome the workflow should achieve.",
    output: "Clear requirements and goals",
  },
  {
    title: "Plan the workflow",
    description: "Map the trigger, data flow, conditions, priorities, and actions before connecting the nodes in n8n.",
    output: "Workflow structure and decision logic",
  },
  {
    title: "Build and connect",
    description: "Configure nodes, prepare data, connect services, and define how each condition should be handled.",
    output: "An assembled automation workflow",
  },
  {
    title: "Test each branch",
    description: "Use sample data to check expected outputs, priority routing, confidence thresholds, and whether each branch behaves correctly.",
    output: "Test results and identified issues",
  },
  {
    title: "Refine and document",
    description: "Fix configuration issues, improve decision logic, review edge cases, and document the workflow's behavior and limitations.",
    output: "A refined workflow with documented behavior",
  },
];

export default function WorkflowExplorer() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="My workflow-building process">
        {processSteps.map((step, index) => (
          <li key={step.title} className="relative min-w-0">
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              className={`card flex h-full w-full flex-col p-4 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected === index ? "border-accent shadow-neon" : "hover:-translate-y-0.5 hover:border-accent/50"}`}
            >
              <span className="font-mono text-xs font-semibold text-accent">{String(index + 1).padStart(2, "0")} —</span>
              <span className="mt-1 text-base font-bold leading-snug">{step.title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{step.description}</span>
              <span className="mt-4 border-t border-line pt-3">
                <span className="block font-mono text-[10px] font-semibold tracking-wider text-accent">OUTPUT</span>
                <span className="mt-1 block text-sm font-medium leading-snug text-ink">{step.output}</span>
              </span>
            </button>
            {index < processSteps.length - 1 && <ChevronRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-accent xl:block" aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">Selected step {selected + 1} of {processSteps.length}: {processSteps[selected].title} — Output: {processSteps[selected].output}</p>
    </div>
  );
}
