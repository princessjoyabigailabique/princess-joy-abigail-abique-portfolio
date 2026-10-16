"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Flag, Mail, Play, RotateCcw, Send, Sparkles, Table2, Tags, Waypoints, Workflow, Terminal } from "lucide-react";

const steps = [
  { name: "Gmail", icon: Mail, result: "Email received", purpose: "The entry point. A new email lands in the inbox and starts the flow.", input: "An incoming email: sender, subject and body.", output: "The raw email, ready to be picked up.", next: "n8n" },
  { name: "n8n", icon: Workflow, result: "Workflow triggered", purpose: "The orchestrator. It receives the email and passes data between every other step.", input: "The raw email from Gmail.", output: "A structured item the next steps can read.", next: "AI Analysis" },
  { name: "AI Analysis", icon: Sparkles, result: "Email analyzed", purpose: "An AI model reads the message and works out what the sender wants and how it’s phrased.", input: "The email text.", output: "A summary of intent, whether a reply or a task is needed, and how urgent it sounds.", next: "Classification" },
  { name: "Classification", icon: Tags, result: "Customer Support", purpose: "Puts the email into a category so it can be handled by the right process.", input: "The AI’s analysis.", output: "A category label and a confidence score.", next: "Priority" },
  { name: "Priority", icon: Flag, result: "High", purpose: "Decides how soon the email needs attention.", input: "The category and the analysis.", output: "A priority level.", next: "Routing" },
  { name: "Routing", icon: Waypoints, result: "Support queue", purpose: "Sends the item to the queue or person who should deal with it.", input: "Category and priority.", output: "A destination.", next: "Google Sheets" },
  { name: "Google Sheets", icon: Table2, result: "Logged successfully", purpose: "Keeps a record. Every processed email becomes a row that can be searched and reviewed.", input: "The classified, prioritized and routed item.", output: "A new row in a log sheet.", next: "Telegram" },
  { name: "Telegram", icon: Send, result: "Notification sent", purpose: "Sends a short message so nothing important is missed.", input: "A summary of the logged item.", output: "A notification message.", next: "End of workflow" },
];

const outcomes = ["Logged to Google Sheets", "Telegram notification sent"];

export default function EmailOperationsProject() {
  const [selected, setSelected] = useState(0);
  const [subject, setSubject] = useState("My order arrived damaged — can you help?");
  const [message, setMessage] = useState("Hi, the package came today and the item is cracked. Order #10482. Please let me know what I can do.");
  const [states, setStates] = useState<Array<"idle" | "running" | "done">>(() => steps.map(() => "idle"));
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");
  const [log, setLog] = useState<Array<{ time: string; text: string; ok?: boolean }>>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const token = useRef(0);
  const completed = status === "complete";
  const combined = `${subject} ${message}`;
  const supportRequest = /\b(help|support|broken|damaged|issue|problem|refund|order|can't|unable)\b/i.test(combined);
  const urgentRequest = /\b(urgent|asap|immediately|emergency|today)\b/i.test(combined);
  const category = supportRequest ? "Customer Support" : "General Inquiry";
  const priority = urgentRequest ? "Urgent" : supportRequest ? "High" : "Normal";
  const flowSteps = steps.map((step, i) => ({ ...step, result: i === 3 ? category : i === 4 ? priority : i === 5 ? supportRequest ? "Support queue" : "General inbox" : step.result }));

  useEffect(() => () => { token.current++; if (timer.current) clearTimeout(timer.current); }, []);

  function reset() {
    token.current++;
    if (timer.current) clearTimeout(timer.current);
    setStatus("idle"); setStates(steps.map(() => "idle")); setLog([]);
  }

  function execute() {
    reset();
    const runToken = token.current + 1;
    token.current = runToken;
    const start = performance.now();
    setStatus("running");
    setLog([]);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const advance = (i: number) => {
      if (token.current !== runToken) return;
      if (i >= steps.length) { setStatus("complete"); return; }
      setStates((prev) => prev.map((state, index) => index === i ? "running" : state));
        setLog((prev) => [...prev, { time: ((performance.now() - start) / 1000).toFixed(1).padStart(4, "0"), text: `${steps[i].name} · running` }]);
      timer.current = setTimeout(() => {
        if (token.current !== runToken) return;
        setStates((prev) => prev.map((state, index) => index === i ? "done" : state));
        setLog((prev) => [...prev, { time: ((performance.now() - start) / 1000).toFixed(1).padStart(4, "0"), text: `${steps[i].name} · ${flowSteps[i].result}`, ok: true }]);
        timer.current = setTimeout(() => advance(i + 1), reduced ? 0 : 600);
      }, reduced ? 180 : 850);
    };
    advance(0);
  }

  const active = flowSteps[selected];
  const ActiveIcon = active.icon;
  const connectorBase = "absolute z-10 text-violet-500 dark:text-violet-300";
  const nodePositions = [
    "min-[761px]:col-start-1 min-[761px]:row-start-1", "min-[761px]:col-start-2 min-[761px]:row-start-1", "min-[761px]:col-start-3 min-[761px]:row-start-1", "min-[761px]:col-start-4 min-[761px]:row-start-1",
    "min-[761px]:col-start-4 min-[761px]:row-start-2", "min-[761px]:col-start-3 min-[761px]:row-start-2", "min-[761px]:col-start-2 min-[761px]:row-start-2", "min-[761px]:col-start-1 min-[761px]:row-start-2",
  ];
  return (
    <section id="email-assistant" className="container-page scroll-mt-24 py-6" aria-label="AI Email Operations Assistant featured project">
      <div className="mx-auto max-w-[900px] leading-relaxed text-ink">
        <p className="mb-1 font-mono text-xs font-medium text-muted">01 · Featured Project</p>
        <h1 className="mb-1 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">AI Email Operations Assistant</h1>
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted">Reads an incoming email, works out what it is and how urgent it is, routes it, logs it, and sends a notification. Run the demo to watch one email move through the flow.</p>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-[0_20px_60px_-30px_rgb(0,0,0,0.28)] dark:bg-gradient-to-b dark:from-surface/95 dark:to-surface2/90">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 font-mono text-xs text-muted">
            <span>workspace / automation / <b className="font-medium text-accent">ai-email-operations-assistant</b></span><span className="ml-auto flex flex-wrap gap-2"><span className="rounded-md border border-amber-700/25 bg-amber-100 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Demo data</span><span className="rounded-md border border-amber-700/25 bg-amber-100 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Demo execution</span></span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="mb-4 grid items-end gap-3 min-[761px]:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid gap-1 rounded-xl border border-dashed border-line bg-surface2/70 p-3.5 text-sm dark:border-white/20 dark:bg-black/20">
                <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted"><span>Incoming sample email</span><span>From: sample@example.com</span></div>
                <label htmlFor="demo-email-subject" className="mt-1 text-xs font-semibold text-ink">Subject</label><input id="demo-email-subject" className="w-full resize-y rounded-[.65rem] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/50 dark:border-violet-300/30 dark:bg-[#0c0914]/80 dark:text-[#eee5f8]" value={subject} maxLength={140} onChange={(e) => { setSubject(e.target.value); reset(); }} />
                <label htmlFor="demo-email-message" className="mt-1 text-xs font-semibold text-ink">Message</label><textarea id="demo-email-message" className="w-full resize-y rounded-[.65rem] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/50 dark:border-violet-300/30 dark:bg-[#0c0914]/80 dark:text-[#eee5f8]" rows={3} maxLength={800} value={message} onChange={(e) => { setMessage(e.target.value); reset(); }} />
                <span className="mt-1 text-xs text-muted">Keyword-based local simulation. No email is sent.</span>
              </div>
              <div className="flex flex-wrap gap-2"><button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-50" onClick={execute} disabled={status === "running"}><Play size={15} fill="currentColor" />{status === "running" ? "Running…" : completed ? "Run again" : "Execute workflow"}</button><button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface/80 px-3.5 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/5" onClick={reset}><RotateCcw size={15} />Reset</button></div>
            </div>
            <p className="mb-1.5 font-mono text-xs font-medium leading-relaxed text-muted">This runs entirely in your browser with sample data. It isn’t connected to Gmail, Sheets, Telegram or any real account.</p>
            <div className="relative mx-auto grid max-w-[850px] grid-cols-1 gap-y-[28px] px-1.5 py-3 min-[761px]:grid-cols-4 min-[761px]:gap-x-[30px] min-[761px]:gap-y-[30px]">
              {flowSteps.map((step, i) => {
                const Icon = step.icon; const state = states[i];
                const direction = i < 3 ? "right" : i === 3 ? "down" : i < 7 ? "left" : "";
                const horizontalRight = i < 3;
                const horizontalLeft = i >= 4 && i < 7;
                const connectorClass = horizontalRight
                  ? "left-1/2 top-full h-[28px] w-0.5 -translate-x-1/2 bg-line min-[761px]:left-full min-[761px]:top-1/2 min-[761px]:h-0.5 min-[761px]:w-[30px] min-[761px]:translate-x-0 min-[761px]:-translate-y-1/2"
                  : horizontalLeft
                    ? "left-1/2 top-full h-[28px] w-0.5 -translate-x-1/2 bg-line min-[761px]:left-auto min-[761px]:right-full min-[761px]:top-1/2 min-[761px]:h-0.5 min-[761px]:w-[30px] min-[761px]:translate-x-0 min-[761px]:-translate-y-1/2"
                    : "left-1/2 top-full h-[28px] w-0.5 -translate-x-1/2 bg-line min-[761px]:h-[30px]";
                return <div key={step.name} className={`relative min-w-0 ${nodePositions[i]}`}>
                  <button type="button" className={`relative grid min-h-[92px] w-full grid-cols-[auto_1fr] grid-rows-[auto_1fr] items-center gap-x-2.5 gap-y-1 rounded-[12px] border p-2.5 text-left text-ink transition duration-300 ${state === "running" ? "border-violet-500 bg-violet-100 shadow-[0_0_0_4px_rgb(139,92,246,0.15),0_0_28px_-8px_rgb(139,92,246,0.55)] dark:border-violet-400 dark:bg-violet-500/20 dark:text-violet-50" : state === "done" ? "border-violet-400/70 bg-violet-50 dark:border-violet-400/60 dark:bg-violet-500/10" : "border-line bg-surface2/80 hover:border-accent/60 hover:bg-surface dark:border-white/10 dark:bg-[#14101b] dark:hover:border-violet-400/60"} ${selected === i ? "outline outline-2 outline-violet-500/30 outline-offset-2" : ""}`} onClick={() => setSelected(i)} aria-pressed={selected === i}>
                    <span className={`grid size-8 place-items-center rounded-[10px] border border-line text-accent dark:border-white/20 dark:text-violet-200 ${state === "running" ? "border-transparent bg-gradient-to-br from-violet-700 to-fuchsia-500 text-white" : ""}`}><Icon size={18} /></span><span className="text-sm font-semibold leading-tight">{step.name}</span><span className={`col-span-2 flex min-h-[1.4em] items-center gap-2 self-end font-mono text-[11px] font-medium leading-snug ${state === "running" ? "text-violet-800 dark:text-violet-200" : state === "done" ? "text-emerald-800 dark:text-emerald-300" : "text-muted"}`}>{state === "running" ? <><span className="size-3 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-600 dark:border-t-violet-300 motion-reduce:animate-none" />RUNNING</> : state === "done" ? step.result : "Idle"}</span>{state === "done" && <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-emerald-500 text-white"><Check size={12} /></span>}
                  </button>
                  {direction && <span className={`absolute z-0 ${connectorClass} ${state === "done" && states[i + 1] !== "idle" ? "bg-violet-500 dark:bg-violet-400" : ""} ${state === "running" ? "motion-safe:animate-pulse bg-violet-500 dark:bg-violet-300" : ""}`} aria-hidden="true">{horizontalRight ? <><ArrowRight className={`${connectorBase} -right-2.5 top-1/2 hidden -translate-y-1/2 min-[761px]:block`} size={15} /><ArrowDown className={`${connectorBase} -bottom-2 left-1/2 -translate-x-1/2 min-[761px]:hidden`} size={15} /></> : horizontalLeft ? <><ArrowLeft className={`${connectorBase} -left-2.5 top-1/2 hidden -translate-y-1/2 min-[761px]:block`} size={15} /><ArrowDown className={`${connectorBase} -bottom-2 left-1/2 -translate-x-1/2 min-[761px]:hidden`} size={15} /></> : <ArrowDown className={`${connectorBase} -bottom-2 left-1/2 -translate-x-1/2`} size={15} />}</span>}
                </div>;
              })}
            </div>
            <div className="mt-5 grid gap-4 min-[761px]:grid-cols-2">
              <div className="min-w-0 rounded-[12px] border border-line bg-surface2/55 p-4 dark:border-white/10 dark:bg-white/[.035]">
                <h2 className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold"><ActiveIcon size={17} className="text-accent" />{active.name}<span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wide ${states[selected] === "done" ? "border-emerald-700/30 bg-emerald-100 text-emerald-900 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200" : states[selected] === "running" ? "border-violet-500/40 bg-violet-100 text-violet-900 dark:bg-violet-500/15 dark:text-violet-200" : "border-line bg-surface text-muted"}`}>{states[selected] === "idle" ? "Idle" : states[selected] === "running" ? "Running" : "Done"}</span></h2>
                <dl className="grid gap-3 text-sm"><div><dt className="mb-1 font-mono text-xs font-medium text-muted">Purpose</dt><dd>{active.purpose}</dd></div><div className="grid grid-cols-2 gap-3"><div><dt className="mb-1 font-mono text-xs font-medium text-muted">Input</dt><dd>{active.input}</dd></div><div><dt className="mb-1 font-mono text-xs font-medium text-muted">Output</dt><dd>{active.output}</dd></div></div><div><dt className="mb-1 font-mono text-xs font-medium text-muted">Next step</dt><dd>{active.next}</dd></div>{states[selected] === "done" && <div><dt className="mb-1 font-mono text-xs font-medium text-muted">Result in this demo</dt><dd className="font-medium text-emerald-800 dark:text-emerald-300">{active.result}</dd></div>}</dl>
              </div>
              <div className="min-w-0 rounded-[12px] border border-line bg-surface2/55 p-4 dark:border-white/10 dark:bg-white/[.035]"><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Terminal size={17} className="text-accent" />Execution log</h2><ol className="grid max-h-[200px] gap-0.5 overflow-auto font-mono text-xs leading-relaxed text-ink/90" aria-live="polite">{log.length ? log.map((item, i) => <li className="flex gap-3" key={`${item.time}-${i}`}><time className="shrink-0 text-muted">00:{item.time}</time><span className={item.ok ? "text-emerald-800 dark:text-emerald-300" : ""}>{item.text}</span></li>) : <li className="flex gap-3"><time className="shrink-0 text-muted">--:--.-</time><span>Press “Execute workflow” to run the demo.</span></li>}</ol>
                {completed && <div className="mt-4 rounded-[14px] border border-emerald-700/25 bg-emerald-50/80 p-4 dark:border-emerald-300/40 dark:bg-emerald-300/[.06]"><h3 className="mb-3.5 flex flex-wrap items-center gap-2 text-base font-semibold"><span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/30 bg-emerald-100 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-emerald-900 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200"><Check size={12} />Execution complete</span><span className="inline-flex items-center rounded-md border border-amber-700/25 bg-amber-100 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Demo result</span></h3><div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-x-4 gap-y-3.5 text-sm">{[["Category", category], ["Priority", priority], ["Needs reply", "Yes"], ["Needs task", supportRequest ? "Yes" : "No"], ["Urgent", urgentRequest ? "Yes" : "No"], ["Routing", supportRequest ? "Support" : "General"]].map(([label, value]) => <div key={label}><small className="mb-1 block font-mono text-xs font-medium text-muted">{label}</small>{value}</div>)}</div><p className="mt-3 text-xs leading-relaxed text-muted">Rules-based simulation using simple keyword matches; no AI service is called.</p><ul className="mt-4 grid gap-1.5 text-sm text-emerald-800 dark:text-emerald-300">{outcomes.map((item) => <li className="flex items-center gap-2" key={item}><Check size={16} />{item}</li>)}</ul></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
