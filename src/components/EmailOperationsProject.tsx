"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Flag, Mail, Play, RotateCcw, Send, Sparkles, Table2, Tags, Waypoints, Workflow, Terminal } from "lucide-react";
import styles from "./EmailOperationsProject.module.css";

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
  return (
    <section id="email-assistant" className="container-page scroll-mt-24 py-10" aria-label="AI Email Operations Assistant featured project">
      <div className={styles.wrap}>
        <p className={styles.label}>01 · Featured Project</p>
        <h1 className={styles.title}>AI Email Operations Assistant</h1>
        <p className={styles.intro}>Reads an incoming email, works out what it is and how urgent it is, routes it, logs it, and sends a notification. Run the demo to watch one email move through the flow.</p>
        <div className={styles.window}>
          <div className={styles.bar}><span>workspace / automation / <b>ai-email-operations-assistant</b></span><span className={styles.badges}><span className={`${styles.tag} ${styles.demo}`}>Demo data</span><span className={`${styles.tag} ${styles.demo}`}>Demo execution</span></span></div>
          <div className={styles.body}>
            <div className={styles.top}>
              <div className={`${styles.mail} ${styles.sampleEditor}`}><div className={styles.mailMeta}><span>Incoming sample email</span><span>From: sample@example.com</span></div><label htmlFor="demo-email-subject">Subject</label><input id="demo-email-subject" value={subject} maxLength={140} onChange={(e) => { setSubject(e.target.value); reset(); }} /><label htmlFor="demo-email-message">Message</label><textarea id="demo-email-message" rows={3} maxLength={800} value={message} onChange={(e) => { setMessage(e.target.value); reset(); }} /><span className={styles.muted}>Keyword-based local simulation. No email is sent.</span></div>
              <div className={styles.controls}><button type="button" className={`${styles.button} ${styles.primary}`} onClick={execute} disabled={status === "running"}><Play size={16} fill="currentColor" />{status === "running" ? "Running…" : completed ? "Run again" : "Execute workflow"}</button><button type="button" className={styles.button} onClick={reset}><RotateCcw size={16} />Reset</button></div>
            </div>
            <p className={styles.label}>This runs entirely in your browser with sample data. It isn’t connected to Gmail, Sheets, Telegram or any real account.</p>
            <div className={styles.canvas}>
              {flowSteps.map((step, i) => {
                const Icon = step.icon; const state = states[i];
                const direction = i < 3 ? "right" : i === 3 ? "down" : i < 7 ? "left" : "";
                return <div key={step.name} className={`${styles.cell} ${styles[`cell${i}`]}`}>
                  <button type="button" className={`${styles.node} ${state === "running" ? styles.running : ""} ${state === "done" ? styles.done : ""}`} onClick={() => setSelected(i)} aria-pressed={selected === i}>
                    <span className={styles.nodeIcon}><Icon size={20} /></span><span className={styles.nodeName}>{step.name}</span><span className={styles.nodeStatus}>{state === "running" ? <><span className={styles.spinner} />RUNNING</> : state === "done" ? step.result : "Idle"}</span>{state === "done" && <span className={styles.check}><Check size={12} /></span>}
                  </button>
                  {direction && <span className={`${styles.link} ${state === "done" && states[i + 1] !== "idle" ? styles.linkDone : ""} ${state === "running" ? styles.linkFlow : ""}`} data-direction={direction} />}
                </div>;
              })}
            </div>
            <div className={styles.panels}>
              <div className={styles.panel}>
                <h2><ActiveIcon size={18} />{active.name}<span className={`${styles.tag} ${states[selected] === "done" ? styles.ok : states[selected] === "running" ? styles.violet : ""}`}>{states[selected] === "idle" ? "Idle" : states[selected] === "running" ? "Running" : "Done"}</span></h2>
                <dl className={styles.details}><div><dt>Purpose</dt><dd>{active.purpose}</dd></div><div className={styles.io}><div><dt>Input</dt><dd>{active.input}</dd></div><div><dt>Output</dt><dd>{active.output}</dd></div></div><div><dt>Next step</dt><dd>{active.next}</dd></div>{states[selected] === "done" && <div><dt>Result in this demo</dt><dd className={styles.green}>{active.result}</dd></div>}</dl>
              </div>
              <div className={styles.panel}><h2><Terminal size={18} />Execution log</h2><ol className={styles.log} aria-live="polite">{log.length ? log.map((item, i) => <li key={`${item.time}-${i}`}><time>00:{item.time}</time><span className={item.ok ? styles.green : ""}>{item.text}</span></li>) : <li><time>--:--.-</time><span>Press “Execute workflow” to run the demo.</span></li>}</ol>
                {completed && <div className={styles.result}><h3><span className={`${styles.tag} ${styles.ok}`}><Check size={12} />Execution complete</span><span className={`${styles.tag} ${styles.demo}`}>Demo result</span></h3><div className={styles.resultGrid}><div><small>Category</small>{category}</div><div><small>Priority</small>{priority}</div><div><small>Needs reply</small>Yes</div><div><small>Needs task</small>{supportRequest ? "Yes" : "No"}</div><div><small>Urgent</small>{urgentRequest ? "Yes" : "No"}</div><div><small>Routing</small>{supportRequest ? "Support" : "General"}</div></div><p className={styles.resultNote}>Rules-based simulation using simple keyword matches; no AI service is called.</p><ul className={styles.actions}>{outcomes.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
