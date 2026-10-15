"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Globe2, Mail, Pause, Play, Terminal, UserRound } from "lucide-react";
import styles from "./SocLab.module.css";

type EventType = "auth" | "login" | "phish" | "endpoint" | "network";
type SimEvent = { id: number; type: EventType; msg: string; time: string };
type EventInfo = { label: string; severity: "info" | "high" | "medium" | "low"; source: string; messages: string[]; mitre: [string, string] | null; explain: string; query: string };

const TYPES: Record<EventType, EventInfo> = {
  auth: { label: "Authentication event", severity: "info", source: "Identity provider", messages: ["Interactive sign-in succeeded for user-07", "Password changed for user-12", "MFA challenge completed for user-03"], mitre: null, explain: "Normal sign-in activity. It matters because unusual patterns are only visible against a normal baseline.", query: "SigninLogs\n| where ResultType == 0\n| summarize Signins = count() by UserPrincipalName, bin(TimeGenerated, 1h)" },
  login: { label: "Suspicious login", severity: "high", source: "Identity provider", messages: ["Sign-in from an unfamiliar country, MFA prompt failed", "Sign-in from a new device followed by a mailbox rule change", "9 failed sign-ins then one success for user-05"], mitre: ["T1078", "Valid Accounts"], explain: "A valid account used in an unusual way. Analysts compare location, device and timing against the account’s normal behavior.", query: "SigninLogs\n| where ResultType != 0\n| summarize Failures = count() by UserPrincipalName, IPAddress, bin(TimeGenerated, 5m)\n| where Failures > 5" },
  phish: { label: "Phishing indicator", severity: "medium", source: "Email gateway", messages: ["Link text does not match its real destination", "Sender domain differs from the display name", "Urgent payment request with a lookalike domain"], mitre: ["T1566", "Phishing"], explain: "Signals that a message may be trying to trick someone into clicking a link or sharing credentials.", query: "EmailUrlInfo\n| where UrlDomain endswith \".example-lookalike.com\"\n| project Timestamp, NetworkMessageId, Url" },
  endpoint: { label: "Endpoint event", severity: "medium", source: "Endpoint", messages: ["Script host started from a user temp folder", "New scheduled task created by a standard user", "Unsigned binary launched from Downloads"], mitre: ["T1059", "Command and Scripting Interpreter"], explain: "Something ran on a device in a way that is worth a second look, such as a script starting from an unusual place.", query: "DeviceProcessEvents\n| where FolderPath has \"\\AppData\\Local\\Temp\"\n| where FileName in~ (\"wscript.exe\", \"powershell.exe\")" },
  network: { label: "Network event", severity: "low", source: "Network", messages: ["Burst of connection attempts across sequential ports", "Unusual outbound traffic volume at 02:00", "DNS query for a rarely seen domain"], mitre: ["T1046", "Network Service Discovery"], explain: "Traffic that doesn’t match the usual pattern, like one host quietly probing many ports.", query: "DeviceNetworkEvents\n| summarize Ports = dcount(RemotePort) by DeviceName, RemoteIP, bin(Timestamp, 5m)\n| where Ports > 20" },
};
const WEIGHTS: EventType[] = ["auth", "auth", "auth", "network", "network", "endpoint", "phish", "login"];
const ICONS = { auth: UserRound, login: AlertTriangle, phish: Mail, endpoint: Terminal, network: Globe2 };
const INITIAL_EVENTS: SimEvent[] = [
  { id: 5, type: "auth", msg: "MFA challenge completed for user-03", time: "17:32:11" },
  { id: 4, type: "login", msg: "9 failed sign-ins then one success for user-05", time: "17:29:48" },
  { id: 3, type: "phish", msg: "Sender domain differs from the display name", time: "17:24:03" },
  { id: 2, type: "network", msg: "DNS query for a rarely seen domain", time: "17:19:26" },
  { id: 1, type: "endpoint", msg: "Unsigned binary launched from Downloads", time: "17:15:40" },
];
const LEARN = [
  { title: "SIEM", detail: "A system that collects logs from many sources so they can be searched, correlated and alerted on." },
  { title: "Log analysis", detail: "Reading records of what happened on systems to reconstruct events and spot unusual behavior." },
  { title: "KQL", detail: "Kusto Query Language, used to query log data in tools such as Microsoft Sentinel and Defender." },
  { title: "MITRE ATT&CK", detail: "A public catalog of attacker tactics and techniques, used to describe and compare behavior." },
  { title: "Threat analysis", detail: "Working out what a signal could mean, how likely it is and what it could affect." },
  { title: "IAM", detail: "Identity and access management: who can sign in, and what they are allowed to reach." },
  { title: "Phishing detection", detail: "Recognizing messages designed to trick people into giving up credentials or running something." },
  { title: "Azure / Entra", detail: "Microsoft’s cloud platform and its identity service, where sign-ins and access are managed." },
];
const timeNow = () => new Date().toLocaleTimeString("en-GB");

export default function SocLab() {
  const [feed, setFeed] = useState(INITIAL_EVENTS);
  const [events, setEvents] = useState(1274);
  const [detections, setDetections] = useState(15);
  const [filter, setFilter] = useState<"all" | EventType>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [learning, setLearning] = useState(0);
  const nextId = useRef(6);
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);
  const shown = useMemo(() => feed.filter((event) => filter === "all" || event.type === filter).slice(0, 8), [feed, filter]);
  const active = feed.find((event) => event.id === selected) ?? null;

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion.current) setRunning(true);
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const type = WEIGHTS[Math.floor(Math.random() * WEIGHTS.length)];
      const info = TYPES[type];
      const next: SimEvent = { id: nextId.current++, type, msg: info.messages[Math.floor(Math.random() * info.messages.length)], time: timeNow() };
      setFeed((current) => [next, ...current].slice(0, 40));
      setEvents((current) => current + 1);
      if (info.severity === "high") setDetections((current) => current + 1);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [running, visible]);

  return (
    <section className={styles.wrap} aria-labelledby="security-lab-title">
      <p className={styles.eyebrow}>Interactive Lab</p>
      <h2 id="security-lab-title" className={styles.title}>Security Lab (Simulated)</h2>
      <p className={styles.intro}>A hands-on style dashboard to practice reading logs, spotting patterns, and matching them to attacker techniques. This is a simulation built for demonstration — it is not connected to a real environment.</p>
      <div ref={root} className={styles.window}>
        <div className={styles.bar}><span>workspace / security-lab / <b>simulated-soc</b></span><span className={styles.badges}><span className={`${styles.tag} ${styles.demo}`}>Simulated data</span><span className={`${styles.tag} ${styles.demo}`}>Not a real environment</span></span></div>
        <div className={styles.stats}>
          <div><span className={styles.label}>Simulation status</span><div className={styles.statNum}><span className={`${styles.dot} ${running ? styles.pulse : ""}`} /><span className={styles.online}>{running ? "Running" : "Paused"}</span></div></div>
          <div><span className={styles.label}>Events</span><div className={styles.statNum}>{events.toLocaleString("en-US")}</div></div>
          <div><span className={styles.label}>Detections</span><div className={styles.statNum}>{detections}</div></div>
          <div><span className={styles.label}>Log sources</span><div className={styles.statNum}>{new Set(Object.values(TYPES).map((type) => type.source)).size}</div></div>
        </div>
        <div className={styles.grid}>
          <div className={styles.feed}>
            <div className={styles.feedHead}>
              <div className={styles.filters} role="group" aria-label="Filter simulated security events">
                <button type="button" className={styles.chip} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
                {(Object.keys(TYPES) as EventType[]).map((type) => <button type="button" key={type} className={styles.chip} aria-pressed={filter === type} onClick={() => setFilter(type)}>{TYPES[type].label}</button>)}
              </div>
              <button type="button" className={styles.button} onClick={() => setRunning((value) => !value)}>{running ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}{running ? "Pause feed" : "Resume feed"}</button>
            </div>
            <div className={styles.eventList} role="region" aria-label="Simulated event feed">
              {shown.length ? shown.map((event) => {
                const info = TYPES[event.type]; const Icon = ICONS[event.type];
                return <button type="button" key={event.id} className={`${styles.event} ${styles[info.severity]} ${selected === event.id ? styles.selected : ""}`} aria-pressed={selected === event.id} onClick={() => setSelected(event.id)}>
                  <span className={styles.eventIcon}><Icon size={16} aria-hidden /></span><span className={styles.eventText}><b>{info.label}</b><small>{event.msg}</small></span><time>{event.time}</time>
                </button>;
              }) : <p className={styles.label}>No events of this type yet.</p>}
            </div>
          </div>
          <div className={styles.inspect} aria-live="polite">
            {active ? (() => {
              const info = TYPES[active.type]; const Icon = ICONS[active.type];
              return <>
                <div><h3 className={styles.inspectTitle}><Icon size={18} aria-hidden />{info.label}<span className={`${styles.tag} ${info.severity === "high" ? styles.warn : info.severity === "medium" ? styles.demo : ""}`}>{info.severity}</span></h3><p className={styles.eventSummary}>{active.msg}</p></div>
                <dl className={styles.details}><div><dt>Source</dt><dd>{info.source}</dd></div><div><dt>Time</dt><dd className={styles.mono}>{active.time}</dd></div><div className={styles.full}><dt>MITRE ATT&amp;CK</dt><dd>{info.mitre ? <><span className={styles.mono}>{info.mitre[0]}</span> · {info.mitre[1]}</> : <span className={styles.muted}>Baseline activity, no technique mapped</span>}</dd></div></dl>
                <p className={styles.explain}>{info.explain}</p>
                <div><p className={styles.label}>Example KQL · for illustration</p><pre className={styles.code} tabIndex={0}><code>{info.query}</code></pre></div>
              </>;
            })() : <div><h3 className={styles.inspectHeading}>Event inspector</h3><p className={styles.muted}>Select an event to see what it means, which technique it maps to, and an example KQL query.</p></div>}
          </div>
        </div>
        <div className={styles.learn}>
          <h3>What I’m learning</h3><p className={styles.learnIntro}>Select a topic for a short definition.</p>
          <div className={styles.chips} role="group" aria-label="Security topics">
            {LEARN.map((item, index) => <button type="button" key={item.title} className={styles.chip} aria-pressed={learning === index} onClick={() => setLearning(index)}>{item.title}</button>)}
          </div>
          <div className={styles.definition} aria-live="polite"><b>{LEARN[learning].title}.</b> {LEARN[learning].detail}</div>
        </div>
      </div>
    </section>
  );
}
