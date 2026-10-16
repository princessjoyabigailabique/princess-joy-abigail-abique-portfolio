"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Globe2, Mail, Pause, Play, Terminal, UserRound } from "lucide-react";

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
const filterButton = "inline-flex min-h-9 items-center rounded-full border border-line bg-[#e8e3ed] px-3 py-2 font-mono text-xs font-medium leading-tight text-[#393044] transition hover:border-accent hover:text-ink aria-pressed:border-accent aria-pressed:bg-[#dcd3e8] aria-pressed:text-[#342344] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-white/[.035] dark:text-violet-100 dark:aria-pressed:bg-violet-500/20";

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
  const shown = useMemo(() => feed.filter((event) => filter === "all" || event.type === filter).slice(0, 8), [feed, filter]);
  const active = feed.find((event) => event.id === selected) ?? null;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) setRunning(true);
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
    <section className="mx-auto max-w-5xl text-ink" aria-labelledby="security-lab-title">
      <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-accent">Interactive Lab</p>
      <h2 id="security-lab-title" className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Security Lab (Simulated)</h2>
      <p className="mb-5 max-w-[75ch] text-sm leading-relaxed text-muted">A hands-on style dashboard to practice reading logs, spotting patterns, and matching them to attacker techniques. This is a simulation built for demonstration — it is not connected to a real environment.</p>
      <div ref={root} className="overflow-hidden rounded-2xl border border-[#c8bfd3] bg-[#e4dfea] text-[#292334] shadow-[0_18px_48px_rgba(45,34,59,.12)] dark:border-white/10 dark:bg-gradient-to-b dark:from-[#17131f] dark:to-[#100d17] dark:text-[#f4f1ff] dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,.8)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#cbc3d4] bg-[#e9e5ee] px-4 py-3 font-mono text-xs text-[#51485d] dark:border-white/10 dark:bg-white/[.025] dark:text-[#b3abc5]">
          <span>workspace / security-lab / <b className="font-medium text-accent">simulated-soc</b></span>
          <span className="ml-auto flex flex-wrap gap-2"><span className="rounded-md border border-amber-700/30 bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Simulated data</span><span className="rounded-md border border-amber-700/30 bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200">Not a real environment</span></span>
        </div>
        <div className="grid grid-cols-2 gap-px border-b border-[#cbc3d4] bg-[#c8bfd3] sm:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          <div className="min-w-0 bg-[#eeeaf2] px-3 py-3 sm:px-4 dark:bg-[#14101b]"><span className="font-mono text-[11px] font-medium text-[#51485d] dark:text-[#b3abc5]">Simulation status</span><div className="mt-1 flex min-h-9 items-center gap-2 text-xl font-semibold tabular-nums sm:text-2xl"><span className={`relative size-2 shrink-0 rounded-full ${running ? "bg-emerald-700 after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-inherit motion-reduce:after:animate-none dark:bg-emerald-400" : "bg-amber-700 dark:bg-amber-300"}`} /><span className="text-base sm:text-lg">{running ? "Running" : "Paused"}</span></div></div>
          <div className="min-w-0 bg-[#eeeaf2] px-3 py-3 sm:px-4 dark:bg-[#14101b]"><span className="font-mono text-[11px] font-medium text-[#51485d] dark:text-[#b3abc5]">Events</span><div className="mt-1 flex min-h-9 items-center text-2xl font-semibold tabular-nums">{events.toLocaleString("en-US")}</div></div>
          <div className="min-w-0 bg-[#eeeaf2] px-3 py-3 sm:px-4 dark:bg-[#14101b]"><span className="font-mono text-[11px] font-medium text-[#51485d] dark:text-[#b3abc5]">Detections</span><div className="mt-1 flex min-h-9 items-center text-2xl font-semibold tabular-nums">{detections}</div></div>
          <div className="min-w-0 bg-[#eeeaf2] px-3 py-3 sm:px-4 dark:bg-[#14101b]"><span className="font-mono text-[11px] font-medium text-[#51485d] dark:text-[#b3abc5]">Log sources</span><div className="mt-1 flex min-h-9 items-center text-2xl font-semibold tabular-nums">{new Set(Object.values(TYPES).map((type) => type.source)).size}</div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="min-w-0 border-b border-[#cbc3d4] p-3 sm:p-4 lg:border-b-0 lg:border-r dark:border-white/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap gap-2" role="group" aria-label="Filter simulated security events">
                <button type="button" className={filterButton} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
                {(Object.keys(TYPES) as EventType[]).map((type) => <button type="button" key={type} className={filterButton} aria-pressed={filter === type} onClick={() => setFilter(type)}>{TYPES[type].label}</button>)}
              </div>
              <button type="button" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#bcb1ca] bg-[#f0edf4] px-3 text-sm font-semibold text-[#342b40] transition hover:border-accent hover:shadow-[0_0_0_3px_rgba(139,92,246,.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent dark:border-white/20 dark:bg-white/[.035] dark:text-[#f4f1ff]" onClick={() => setRunning((value) => !value)}>{running ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}{running ? "Pause feed" : "Resume feed"}</button>
            </div>
            <div className="grid min-h-[240px] content-start gap-2 sm:min-h-[320px]" role="region" aria-label="Simulated event feed">
              {shown.length ? shown.map((event) => {
                const info = TYPES[event.type]; const Icon = ICONS[event.type];
                const severity = info.severity === "high" ? "border-rose-700/30 bg-rose-100 text-rose-900 dark:border-rose-400/50 dark:bg-rose-400/10 dark:text-rose-300" : info.severity === "medium" ? "border-amber-700/30 bg-amber-100 text-amber-950 dark:border-amber-300/50 dark:bg-amber-300/10 dark:text-amber-200" : "border-[#c8bfd3] bg-[#f3f0f6] text-[#50465d] dark:border-white/15 dark:bg-white/[.035] dark:text-[#b3abc5]";
                return <button type="button" key={event.id} className={`grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2.5 gap-y-1 rounded-xl border px-3 py-2.5 text-left transition sm:grid-cols-[auto_minmax(0,1fr)_auto] ${selected === event.id ? "border-accent bg-[#ded4ea] shadow-[0_0_0_2px_rgba(139,92,246,.12)] dark:bg-violet-500/15" : "border-[#d0c8d8] bg-[#f0edf4] hover:border-accent/60 hover:bg-[#eae4f0] dark:border-white/10 dark:bg-white/[.035] dark:hover:bg-white/[.06]"}`} aria-pressed={selected === event.id} onClick={() => setSelected(event.id)}>
                  <span className={`grid size-9 place-items-center rounded-lg border ${severity}`}><Icon size={17} aria-hidden /></span>
                  <span className="min-w-0"><b className="block truncate text-sm font-semibold leading-snug text-[#292334] dark:text-[#f4f1ff]">{info.label}</b><small className="mt-0.5 block truncate font-mono text-xs leading-snug text-[#51485d] dark:text-[#c0b7ce]">{event.msg}</small></span>
                  <time className="col-start-2 font-mono text-xs text-[#51485d] sm:col-start-3 dark:text-[#b3abc5]">{event.time}</time>
                </button>;
              }) : <p className="py-3 text-sm text-[#51485d] dark:text-[#c0b7ce]">No events of this type yet.</p>}
            </div>
          </div>
          <div className="grid min-w-0 content-start gap-4 bg-[#eae6ef] p-3 sm:p-4 dark:bg-[#14101b]" aria-live="polite">
            {active ? (() => {
              const info = TYPES[active.type]; const Icon = ICONS[active.type];
              const severityClass = info.severity === "high" ? "border-rose-700/30 bg-rose-100 text-rose-900 dark:border-rose-400/50 dark:bg-rose-400/10 dark:text-rose-300" : info.severity === "medium" ? "border-amber-700/30 bg-amber-100 text-amber-950 dark:border-amber-300/50 dark:bg-amber-300/10 dark:text-amber-200" : "border-[#c8bfd3] bg-[#f3f0f6] text-[#50465d] dark:border-white/15 dark:bg-white/[.035] dark:text-[#b3abc5]";
              return <>
                <div><h3 className="flex flex-wrap items-center gap-2 text-base font-semibold text-[#292334] dark:text-[#f4f1ff]"><Icon size={18} aria-hidden />{info.label}<span className={`rounded-md border px-2 py-1 font-mono text-[11px] font-semibold uppercase ${severityClass}`}>{info.severity}</span></h3><p className="mt-2 text-sm leading-relaxed text-[#393044] dark:text-[#ded6e8]">{active.msg}</p></div>
                <dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="mb-1 font-mono text-xs font-semibold text-[#51485d] dark:text-[#b3abc5]">Source</dt><dd>{info.source}</dd></div><div><dt className="mb-1 font-mono text-xs font-semibold text-[#51485d] dark:text-[#b3abc5]">Time</dt><dd className="font-mono">{active.time}</dd></div><div className="col-span-2"><dt className="mb-1 font-mono text-xs font-semibold text-[#51485d] dark:text-[#b3abc5]">MITRE ATT&amp;CK</dt><dd>{info.mitre ? <><span className="font-mono">{info.mitre[0]}</span> · {info.mitre[1]}</> : <span className="text-[#51485d] dark:text-[#c0b7ce]">Baseline activity, no technique mapped</span>}</dd></div></dl>
                <p className="text-sm leading-relaxed text-[#393044] dark:text-[#ded6e8]">{info.explain}</p>
                <div><p className="mb-2 font-mono text-xs font-semibold text-[#51485d] dark:text-[#c0b7ce]">Example KQL · for illustration</p><pre className="overflow-x-auto rounded-xl border border-[#c8bfd3] bg-[#ddd7e5] p-3 font-mono text-xs leading-relaxed text-[#30283a] dark:border-white/10 dark:bg-[#0a0714] dark:text-[#d1c4e4]" tabIndex={0}><code>{info.query}</code></pre></div>
              </>;
            })() : <div><h3 className="text-base font-semibold">Event inspector</h3><p className="mt-2 text-sm leading-relaxed text-[#51485d] dark:text-[#c0b7ce]">Select an event to see what it means, which technique it maps to, and an example KQL query.</p></div>}
          </div>
        </div>
        <div className="border-t border-[#cbc3d4] bg-[#e9e5ee] p-4 sm:p-5 dark:border-white/10 dark:bg-white/[.02]">
          <h3 className="text-base font-semibold text-[#292334] dark:text-[#f4f1ff]">What I’m learning</h3><p className="mt-1 text-sm text-[#51485d] dark:text-[#c0b7ce]">Select a topic for a short definition.</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Security topics">
            {LEARN.map((item, index) => <button type="button" key={item.title} className={filterButton} aria-pressed={learning === index} onClick={() => setLearning(index)}>{item.title}</button>)}
          </div>
          <div className="mt-3 min-h-[4.5rem] rounded-xl border border-[#c8bfd3] bg-[#f0edf4] p-3.5 text-sm leading-relaxed text-[#393044] dark:border-white/10 dark:bg-white/[.035] dark:text-[#d1c4e4]" aria-live="polite"><b className="text-[#292334] dark:text-[#f4f1ff]">{LEARN[learning].title}.</b> {LEARN[learning].detail}</div>
        </div>
      </div>
    </section>
  );
}
