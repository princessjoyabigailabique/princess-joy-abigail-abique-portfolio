"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Expand, Mail, Play, RotateCcw, Sparkles, Table2, Tags, Waypoints, Workflow, Terminal, X } from "lucide-react";
import Image from "next/image";
import type { KeyboardEvent as ReactKeyboardEvent, TouchEvent } from "react";
import { estimateEmailConfidence, getEmailPriority, getEmailWorkflowSequence } from "@/lib/email-workflow";

const steps = [
  { name: "Gmail Trigger", icon: Mail, result: "New email detected", purpose: "Starts the workflow when a new message arrives in Gmail.", input: "A newly received email.", output: "The message is picked up for processing.", next: "Retrieve Email" },
  { name: "Retrieve Email", icon: Mail, result: "Email details retrieved", purpose: "Gets the email details needed by the next steps.", input: "The new message trigger.", output: "Sender, subject and message body.", next: "Prepare Data" },
  { name: "Prepare Data", icon: Workflow, result: "Email prepared", purpose: "Cleans and formats the message content before analysis.", input: "The retrieved email fields.", output: "Prepared email text.", next: "AI Analysis" },
  { name: "AI Analysis", icon: Sparkles, result: "Email analyzed", purpose: "Classifies the email and recommends a category, priority and action with a confidence score.", input: "The prepared email text.", output: "Category, priority, action and confidence.", next: "Check Confidence" },
  { name: "Check Confidence", icon: Check, result: "Confidence checked", purpose: "Results at or above 0.80 continue. Lower confidence is sent to the Human Review branch.", input: "The AI analysis and confidence score.", output: "Continue automatically or request human review.", next: "Route by Priority or Human Review" },
  { name: "Route by Priority", icon: Waypoints, result: "Priority route selected", purpose: "Routes high-confidence email using its Critical, High, Medium or Low priority.", input: "A high-confidence AI priority.", output: "Priority-based processing.", next: "Normal Processing or Telegram Notification" },
  { name: "Normal Processing", icon: Tags, result: "Priority action prepared", purpose: "Critical email can send a Telegram alert; High, Medium and Low receive the matching Gmail label.", input: "A high-confidence priority route.", output: "Critical: Telegram alert. High, Medium or Low: matching Gmail label.", next: "Human Review" },
  { name: "Human Review", icon: Table2, result: "Review item logged", purpose: "The workflow ends with a review log. Low-confidence emails are flagged for manual checking; high-confidence emails reach this step after normal processing.", input: "A low-confidence analysis or a processed high-confidence email.", output: "Review status logged for follow-up.", next: "Manual review or workflow complete" },
];

export default function EmailOperationsProject() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [subject, setSubject] = useState("URGENT: Production Website Is Down");
  const [message, setMessage] = useState("Our production website is completely down. Customers cannot log in or place orders, and all online sales have stopped. Please investigate immediately.");
  const [states, setStates] = useState<Array<"idle" | "running" | "done">>(() => steps.map(() => "idle"));
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");
  const [log, setLog] = useState<Array<{ time: string; text: string; ok?: boolean }>>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const token = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const closeViewerRef = useRef<HTMLButtonElement>(null);
  const slideTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const completed = status === "complete";
  const combined = `${subject} ${message}`;
  const supportRequest = /\b(help|support|broken|damaged|issue|problem|refund|order|can't|unable)\b/i.test(combined);
  const confidence = estimateEmailConfidence(message);
  const lowConfidence = confidence < 0.8;
  const priority = getEmailPriority(combined);
  const isCritical = priority === "Critical";
  const category = supportRequest ? "Customer Support" : "General Inquiry";
  const flowSteps = steps.map((step, i) => ({ ...step, ...(i === 6 && isCritical ? { name: "Telegram Notification", purpose: "Sends a Telegram alert for a Critical email after the confidence and priority checks.", input: "A high-confidence Critical priority route.", output: "A simulated Telegram alert for the production outage.", next: "End of workflow" } : {}), result: i === 3 ? `${category} · ${priority} · ${confidence.toFixed(2)}` : i === 4 ? `${confidence.toFixed(2)} · ${lowConfidence ? "Human review" : "Continue"}` : i === 5 ? lowConfidence ? "Skipped · low confidence" : `${priority} · Normal processing` : i === 6 ? priority === "Critical" ? "Critical Telegram alert" : `${priority} Gmail label` : i === 7 ? "Needs Review · Google Sheets" : step.result }));
  const workflowSequence = getEmailWorkflowSequence(confidence, priority);
  const displayedSteps = workflowSequence.map((index) => ({ ...flowSteps[index], originalIndex: index }));
  const outcomes = lowConfidence
    ? ["Human Review route simulated", "Review item logged for manual checking"]
    : isCritical
      ? ["Critical priority identified", "Telegram notification simulated; Human Review skipped"]
      : [`${priority} Gmail label simulated`, "Human Review step completed"];

  useEffect(() => {
    if (!viewerOpen) return;
    const priorFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeViewerRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setViewerOpen(false);
      if (event.key === "Tab") {
        const focusable = document.querySelectorAll<HTMLElement>("[data-workflow-viewer] button:not(:disabled)");
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = priorOverflow; window.removeEventListener("keydown", onKeyDown); priorFocus?.focus(); };
  }, [viewerOpen]);

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
    const executionSequence = workflowSequence;
    const advance = (sequenceIndex: number) => {
      if (token.current !== runToken) return;
      if (sequenceIndex >= executionSequence.length) { setStatus("complete"); return; }
      const i = executionSequence[sequenceIndex];
      setStates((prev) => prev.map((state, index) => index === i ? "running" : state));
        setLog((prev) => [...prev, { time: ((performance.now() - start) / 1000).toFixed(1).padStart(4, "0"), text: `${steps[i].name} · running` }]);
      timer.current = setTimeout(() => {
        if (token.current !== runToken) return;
        setStates((prev) => prev.map((state, index) => index === i ? "done" : state));
        setLog((prev) => [...prev, { time: ((performance.now() - start) / 1000).toFixed(1).padStart(4, "0"), text: `${steps[i].name} · ${flowSteps[i].result}`, ok: true }]);
        timer.current = setTimeout(() => advance(sequenceIndex + 1), reduced ? 0 : 600);
      }, reduced ? 180 : 850);
    };
    advance(0);
  }

  const active = flowSteps[selected];
  const ActiveIcon = active.icon;
  const selectSlide = (slide: number) => setActiveSlide(slide);
  const handleSlideTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, current: number) => {
    const next = event.key === "ArrowRight" ? Math.min(1, current + 1) : event.key === "ArrowLeft" ? Math.max(0, current - 1) : event.key === "Home" ? 0 : event.key === "End" ? 1 : null;
    if (next === null) return;
    event.preventDefault();
    selectSlide(next);
    slideTabRefs.current[next]?.focus();
  };
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("input, textarea, button")) { touchStartX.current = null; return; }
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < 55) return;
    selectSlide(Math.max(0, Math.min(1, activeSlide + (end < start ? 1 : -1))));
  };
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
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted">Explore a simulated email-processing flow or inspect the actual n8n workflow diagram—all within this project.</p>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-[0_20px_60px_-30px_rgb(0,0,0,0.28)] dark:bg-gradient-to-b dark:from-surface/95 dark:to-surface2/90">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 font-mono text-xs text-muted">
            <span>workspace / automation / <b className="font-medium text-accent">ai-email-operations-assistant</b></span>
          </div>
          <nav className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between" aria-label="AI Email Operations Assistant slides">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project views">
              <button ref={(element) => { slideTabRefs.current[0] = element; }} id="email-demo-tab" type="button" role="tab" tabIndex={activeSlide === 0 ? 0 : -1} aria-selected={activeSlide === 0} aria-controls="email-demo-panel" onKeyDown={(event) => handleSlideTabKeyDown(event, 0)} onClick={() => selectSlide(0)} className={`min-h-10 rounded-lg border px-3.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${activeSlide === 0 ? "border-accent bg-accent/10 text-accent" : "border-line bg-surface/60 text-muted hover:border-accent/50 hover:text-ink"}`}>Interactive Demo</button>
              <button ref={(element) => { slideTabRefs.current[1] = element; }} id="email-workflow-tab" type="button" role="tab" tabIndex={activeSlide === 1 ? 0 : -1} aria-selected={activeSlide === 1} aria-controls="email-workflow-panel" onKeyDown={(event) => handleSlideTabKeyDown(event, 1)} onClick={() => selectSlide(1)} className={`min-h-10 rounded-lg border px-3.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${activeSlide === 1 ? "border-accent bg-accent/10 text-accent" : "border-line bg-surface/60 text-muted hover:border-accent/50 hover:text-ink"}`}>Actual n8n Workflow</button>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => selectSlide(Math.max(0, activeSlide - 1))} disabled={activeSlide === 0} aria-label="Previous project slide" className="grid size-9 place-items-center rounded-lg border border-line bg-surface/70 text-ink transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={18} /></button>
              <div className="flex items-center gap-1.5" aria-label={`Slide ${activeSlide + 1} of 2`}>
                {[0, 1].map((slide) => <button key={slide} type="button" onClick={() => selectSlide(slide)} aria-label={`Go to ${slide === 0 ? "Interactive Demo" : "Actual n8n Workflow"} slide`} aria-current={activeSlide === slide ? "step" : undefined} className={`grid size-7 place-items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${activeSlide === slide ? "text-accent" : "text-muted hover:text-ink"}`}><span className={`size-2 rounded-full ${activeSlide === slide ? "bg-accent" : "bg-line"}`} /></button>)}
              </div>
              <button type="button" onClick={() => selectSlide(Math.min(1, activeSlide + 1))} disabled={activeSlide === 1} aria-label="Next project slide" className="grid size-9 place-items-center rounded-lg border border-line bg-surface/70 text-ink transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={18} /></button>
            </div>
          </nav>
          <div className="touch-pan-y" onTouchStart={(event) => { touchStartX.current = event.target instanceof Element && event.target.closest("input, textarea, button") ? null : event.touches[0]?.clientX ?? null; }} onTouchEnd={handleTouchEnd}>
          <div id="email-demo-panel" role="tabpanel" aria-labelledby="email-demo-tab" hidden={activeSlide !== 0} className="motion-safe:animate-[fade-in_.18s_ease-out]">
          <div className="p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2"><span className="rounded-md border border-amber-700/25 bg-amber-100 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Simulated demo</span><span className="rounded-md border border-line bg-surface2/70 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-muted">No connected accounts</span></div>
            <div className="mb-4 grid items-end gap-3 min-[761px]:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid gap-1 rounded-xl border border-dashed border-line bg-surface2/70 p-3.5 text-sm dark:border-white/20 dark:bg-black/20">
                <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted"><span>Incoming sample email</span><span>From: sample@example.com</span></div>
                <label htmlFor="demo-email-subject" className="mt-1 text-xs font-semibold text-ink">Subject</label><input id="demo-email-subject" className="w-full resize-y rounded-[.65rem] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/50 dark:border-violet-300/30 dark:bg-[#0c0914]/80 dark:text-[#eee5f8]" value={subject} maxLength={140} onChange={(e) => { setSubject(e.target.value); reset(); }} />
                <label htmlFor="demo-email-message" className="mt-1 text-xs font-semibold text-ink">Message</label><textarea id="demo-email-message" className="w-full resize-y rounded-[.65rem] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/50 dark:border-violet-300/30 dark:bg-[#0c0914]/80 dark:text-[#eee5f8]" rows={3} maxLength={800} value={message} onChange={(e) => { setMessage(e.target.value); reset(); }} />
                <span className="mt-1 text-xs leading-relaxed text-muted">Rules-based simulation only. In this demo, messages under eight words follow the Human Review branch; longer messages continue through priority processing. Nothing is sent or changed in a real account.</span>
              </div>
              <div className="flex flex-wrap gap-2"><button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-50" onClick={execute} disabled={status === "running"}><Play size={15} fill="currentColor" />{status === "running" ? "Running…" : completed ? "Run again" : "Execute workflow"}</button><button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface/80 px-3.5 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/5" onClick={reset}><RotateCcw size={15} />Reset</button></div>
            </div>
            <p className="mb-1.5 font-mono text-xs font-medium leading-relaxed text-muted">This runs entirely in your browser with sample data. It isn’t connected to Gmail, Sheets, Telegram or any real account.</p>
            {lowConfidence && <p role="status" className="mx-auto mb-2 max-w-[850px] rounded-lg border border-sky-500/35 bg-sky-50/70 px-3 py-2 text-sm text-sky-950 dark:bg-sky-400/[.08] dark:text-sky-100"><strong className="font-semibold">Low-confidence route ({confidence.toFixed(2)}):</strong> Check Confidence → Human Review. Priority routing is skipped in this sample run.</p>}
            {!lowConfidence && isCritical && <p role="status" className="mx-auto mb-2 max-w-[850px] rounded-lg border border-rose-500/35 bg-rose-50/70 px-3 py-2 text-sm text-rose-950 dark:bg-rose-400/[.08] dark:text-rose-100"><strong className="font-semibold">Critical priority ({priority} · {confidence.toFixed(2)} confidence):</strong> Normal Processing sends a Telegram Notification. Human Review is skipped for this sample.</p>}
            <div className="relative mx-auto grid max-w-[850px] grid-cols-1 gap-y-[28px] px-1.5 py-3 min-[761px]:grid-cols-4 min-[761px]:gap-x-[30px] min-[761px]:gap-y-[30px]">
              {displayedSteps.map((step, displayIndex) => {
                const i = step.originalIndex;
                const Icon = step.icon; const state = states[i];
                const direction = displayIndex < 3 ? "right" : displayIndex === 3 ? "down" : displayIndex < displayedSteps.length - 1 ? "left" : "";
                const horizontalRight = displayIndex < 3;
                const horizontalLeft = displayIndex > 3 && displayIndex < displayedSteps.length - 1;
                const connectorClass = horizontalRight
                  ? "left-1/2 top-full h-[28px] w-0.5 -translate-x-1/2 bg-line min-[761px]:left-full min-[761px]:top-1/2 min-[761px]:h-0.5 min-[761px]:w-[30px] min-[761px]:translate-x-0 min-[761px]:-translate-y-1/2"
                  : horizontalLeft
                    ? "left-1/2 top-full h-[28px] w-0.5 -translate-x-1/2 bg-line min-[761px]:left-auto min-[761px]:right-full min-[761px]:top-1/2 min-[761px]:h-0.5 min-[761px]:w-[30px] min-[761px]:translate-x-0 min-[761px]:-translate-y-1/2"
                    : "left-1/2 top-full h-[28px] w-0.5 -translate-x-1/2 bg-line min-[761px]:h-[30px]";
                return <div key={step.name} className={`relative min-w-0 ${nodePositions[displayIndex]}`}>
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
                {completed && <div className="mt-4 rounded-[14px] border border-emerald-700/25 bg-emerald-50/80 p-4 dark:border-emerald-300/40 dark:bg-emerald-300/[.06]"><h3 className="mb-3.5 flex flex-wrap items-center gap-2 text-base font-semibold"><span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/30 bg-emerald-100 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-emerald-900 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200"><Check size={12} />Execution complete</span><span className="inline-flex items-center rounded-md border border-amber-700/25 bg-amber-100 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Demo result</span></h3><div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-x-4 gap-y-3.5 text-sm">{[["Category", category], ["Priority", priority], ["Confidence", confidence.toFixed(2)], ["Review required", lowConfidence || !isCritical ? "Yes" : "No"], ["Routing", lowConfidence ? "Human review" : isCritical ? "Telegram notification" : `${priority} label → Human Review`]].map(([label, value]) => <div key={label}><small className="mb-1 block font-mono text-xs font-medium text-muted">{label}</small>{value}</div>)}</div><p className="mt-3 text-xs leading-relaxed text-muted">Rules-based simulation for demonstration only. It does not call an AI service or connect to Gmail, Telegram, or Google Sheets.</p><ul className="mt-4 grid gap-1.5 text-sm text-emerald-800 dark:text-emerald-300">{outcomes.map((item) => <li className="flex items-center gap-2" key={item}><Check size={16} />{item}</li>)}</ul></div>}
              </div>
            </div>
          </div>
          </div>
          </div>
          <div id="email-workflow-panel" role="tabpanel" aria-labelledby="email-workflow-tab" hidden={activeSlide !== 1} className="p-4 motion-safe:animate-[fade-in_.18s_ease-out] sm:p-5">
            <div className="overflow-hidden rounded-xl border border-line bg-surface2/70 p-2 dark:bg-[#0b0912]">
              <Image src="/images/ai-email-operations-workflow.png" alt="Actual n8n workflow diagram for the AI Email Operations Assistant. It shows Gmail trigger and preparation, AI analysis, confidence checking, priority routing, normal processing, and a Human Review branch." width={1775} height={887} sizes="(max-width: 900px) 100vw, 850px" className="h-auto max-h-[70vh] w-full rounded-lg object-contain" priority={false} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted"><strong className="font-semibold text-ink">Actual workflow diagram.</strong> A visual overview of the email processing logic, priority routing, and Human Review branch.</p>
              <button type="button" onClick={() => setViewerOpen(true)} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-surface/80 px-3.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"><Expand size={16} />Expand workflow</button>
            </div>
          </div>
        </div>
      </div>
      {viewerOpen && <div className="fixed inset-0 z-[120] grid place-items-center bg-[#07050d]/90 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewerOpen(false); }}>
        <div data-workflow-viewer role="dialog" aria-modal="true" aria-labelledby="workflow-viewer-title" tabIndex={-1} className="relative flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-violet-400/50 bg-[#100c1a] p-3 text-white shadow-[0_25px_100px_rgba(0,0,0,.65)] sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3"><div><h2 id="workflow-viewer-title" className="font-semibold">AI Email Operations Assistant — Workflow 1</h2><p className="text-xs text-violet-200/75">Actual workflow diagram · Escape to close</p></div><button ref={closeViewerRef} type="button" onClick={() => setViewerOpen(false)} aria-label="Close workflow viewer" className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"><X size={19} /></button></div>
          <div className="min-h-0 overflow-auto rounded-xl bg-[#09080d] p-1 sm:p-2"><Image src="/images/ai-email-operations-workflow.png" alt="Expanded actual n8n workflow diagram, including normal priority processing and the low-confidence Human Review path." width={1775} height={887} sizes="96vw" className="mx-auto h-auto max-h-[82vh] w-auto max-w-full object-contain" /></div>
        </div>
      </div>}
    </section>
  );
}
