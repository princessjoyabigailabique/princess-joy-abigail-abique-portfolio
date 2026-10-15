import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ClipboardList, Command, Headphones, KeyRound, Laptop, LifeBuoy, MonitorCog, Network, RefreshCw, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { CtaBand, LinkButton, SectionHeader, StatusBadge } from "@/components/ui";
import TicketSim from "@/components/TicketSim";
import TryHackMeRooms from "@/components/TryHackMeRooms";
import type { Status } from "@/data/projects";

export const metadata: Metadata = { title: "IT Support / System", description: "Structured IT troubleshooting, support documentation and system administration learning, with an interactive simulated support ticket.", alternates: { canonical: "/it-support" } };

const TOOLS: { title: string; status: Status; text: string; icon: typeof Laptop }[] = [
  { title: "ServiceDesk Simulator", status: "completed", text: "Completed First Line Support simulation; 20+ tickets resolved.", icon: ClipboardList },
  { title: "Windows 10 / 11", status: "planned", text: "Operating system setup and troubleshooting are learning goals.", icon: Laptop },
  { title: "Active Directory / Entra ID", status: "planned", text: "Exploring identity and access management concepts.", icon: KeyRound },
  { title: "Microsoft Intune", status: "planned", text: "Learning about endpoint management.", icon: MonitorCog },
  { title: "Microsoft 365", status: "planned", text: "Interested in account and productivity administration.", icon: Sparkles },
  { title: "Remote support", status: "planned", text: "A tool category I want to learn and practice.", icon: Headphones },
  { title: "Command line", status: "planned", text: "Building familiarity with basic system and network checks.", icon: Command },
  { title: "Patching & updates", status: "planned", text: "An area I want to understand for keeping systems current.", icon: RefreshCw },
];

const AREAS = [
  { icon: Wrench, label: "Troubleshooting" },
  { icon: Laptop, label: "Operating systems" },
  { icon: KeyRound, label: "Identity & access" },
  { icon: Network, label: "Network fundamentals" },
  { icon: Headphones, label: "User support" },
  { icon: RefreshCw, label: "System updates" },
  { icon: ClipboardList, label: "Documentation" },
  { icon: ShieldCheck, label: "Endpoint security" },
];

const FLOW = [
  { title: "Understand", text: "Clarify the issue and its impact." },
  { title: "Identify", text: "Narrow down likely causes." },
  { title: "Isolate", text: "Check one layer at a time." },
  { title: "Test", text: "Try a focused, safe step." },
  { title: "Resolve", text: "Confirm the fix or escalate." },
  { title: "Document", text: "Record the outcome clearly." },
];

export default function ItSupport() {
  return (
    <>
      <section className="support-hero page-atmosphere atmosphere-support">
        <div className="container-page support-hero-inner">
          <div className="support-hero-copy">
            <div className="flex flex-wrap items-center gap-3"><p className="kicker">IT Support / System</p><span className="chip">Solving problems, keeping systems running</span></div>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">Support people.<br />Maintain systems.<br /><span className="grad-text">Keep it running.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">I’m exploring IT support, system administration, and endpoint management through hands-on learning and simulated scenarios. I enjoy troubleshooting issues, managing devices, and learning how to keep systems secure, updated, and reliable.</p>
            <ul className="support-focus-row" aria-label="Areas of focus">
              <li><span><Wrench size={18} aria-hidden /></span><div><b>Troubleshooting</b><small>Identify, resolve, document</small></div></li>
              <li><span><KeyRound size={18} aria-hidden /></span><div><b>System management</b><small>Endpoints, users, access</small></div></li>
              <li><span><LifeBuoy size={18} aria-hidden /></span><div><b>Practical learning</b><small>Labs and simulations</small></div></li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="#ticket" className="btn-primary">Try the support simulation <ArrowRight size={16} aria-hidden /></Link><Link href="#tools" className="btn-ghost">Explore learning areas</Link></div>
          </div>
          <div className="support-station" aria-hidden="true">
            <div className="support-screen"><div className="support-screen-bar"><i /><i /><i /><span>support / workspace</span></div><div className="support-screen-body"><span className="support-screen-kicker">SYSTEM STATUS</span><strong>IT Support<br />&amp; Systems</strong><span className="support-terminal-line">&gt; troubleshoot --step-by-step</span><div className="support-screen-pulse" /></div><div className="support-monitor-stand" /></div>
            <div className="support-checklist"><span className="support-screen-kicker">WORKING METHOD</span>{["Troubleshoot", "Check the details", "Test safely", "Document outcome"].map((item) => <span key={item}><Check size={13} aria-hidden />{item}</span>)}</div>
            <span className="support-station-caption">learning by doing ✦</span>
          </div>
        </div>
      </section>

      <section id="ticket" className="container-page scroll-mt-24 py-9 sm:py-12" aria-labelledby="ticket-heading">
        <SectionHeader kicker="01 · Interactive lab" id="ticket-heading" title="IT Support Ticket Simulation" intro="Handle a sample support ticket from start to finish. Read the issue, choose troubleshooting steps, and document the simulated outcome." />
        <TicketSim />
      </section>

      <section id="tools" className="support-section-band" aria-labelledby="tools-heading">
        <div className="container-page py-9 sm:py-12">
          <SectionHeader kicker="02 · Tools & platforms" id="tools-heading" title="Tools I’m Learning About" intro="These cards distinguish a completed activity from areas I’m interested in learning. They aren’t claims of professional experience." action={<Link href="/certifications" className="btn-ghost">View certifications <ArrowRight size={15} aria-hidden /></Link>} />
          <ul className="support-tools-grid">
            {TOOLS.map(({ title, status, text, icon: Icon }) => <li key={title} className="support-tool-card card card-hover"><span className="support-tool-icon"><Icon size={21} aria-hidden /></span><div className="support-tool-heading"><h3>{title}</h3><StatusBadge status={status} label={status === "planned" ? "Learning goal" : undefined} /></div><p>{text}</p></li>)}
          </ul>
        </div>
      </section>

      <section id="activity" className="container-page scroll-mt-24 py-9 sm:py-12" aria-labelledby="activity-heading">
        <SectionHeader kicker="03 · Verified hands-on activity" id="activity-heading" title="First Line Support — ServiceDesk Simulator" intro="A simulated service desk credential documenting ticket-handling practice." />
        <article className="support-activity card">
          <div className="support-activity-visual"><Image src="/images/certs/first-line-support.jpg" alt="Verified First Line Support certificate from ServiceDesk Simulator" width={1200} height={750} className="support-certificate-image" /></div>
          <div className="support-activity-copy"><div className="flex flex-wrap items-center gap-2"><StatusBadge status="completed" label="Verified certificate" /><span className="text-xs text-muted">ServiceDesk Simulator</span></div><h3 className="mt-3 text-lg font-bold">20+ simulated tickets resolved</h3><p className="mt-2 text-sm leading-relaxed text-muted">Completed the First Line Support simulation and resolved more than 20 tickets in the ServiceDesk Simulator. This is simulated practice, not workplace helpdesk experience.</p><dl className="support-certificate-details"><div><dt>Completed</dt><dd>August 17, 2026</dd></div><div><dt>Certificate ID</dt><dd>SDS-2026-0817-4561</dd></div></dl><Link href="/certifications" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">View certifications <ArrowRight size={15} aria-hidden /></Link></div>
        </article>
      </section>

      <section className="support-section-band" aria-label="Support topics and problem-solving approach">
        <div className="container-page grid gap-8 py-9 sm:py-12 lg:grid-cols-[.9fr_1.1fr]">
          <section aria-labelledby="areas-heading"><SectionHeader kicker="04 · Areas of interest" id="areas-heading" title="Support Skills & Knowledge" intro="Topics I’m building familiarity with through study and practice." /><ul className="support-areas-grid">{AREAS.map(({ icon: Icon, label }) => <li className="support-area-card" key={label}><Icon size={18} aria-hidden /><span>{label}</span></li>)}</ul></section>
          <section aria-labelledby="approach-heading"><SectionHeader kicker="05 · My approach" id="approach-heading" title="How I Solve Support Issues" intro="A structured path from the first report to a clear handoff or resolution." /><ol className="support-flow">{FLOW.map(({ title, text }, index) => <li key={title}><span className="support-flow-number">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol><p className="support-honesty-note"><Check size={15} aria-hidden /> Clear communication · Safe troubleshooting · Learn from each issue · Document the outcome</p></section>
        </div>
      </section>

      <section className="container-page py-9 sm:py-12" aria-labelledby="learning-heading">
        <SectionHeader kicker="06 · Current learning goals" id="learning-heading" title="Building My Systems Knowledge" intro="I’m interested in learning more about identity, endpoint management, operating systems, and the practices that keep devices reliable." />
        <div className="support-learning-row"><div className="support-learning-card card"><span className="support-tool-icon"><KeyRound size={20} aria-hidden /></span><div><h3>Identity & access</h3><p>Exploring Microsoft Entra ID and account access concepts.</p></div><span className="badge border-info/50 bg-info/10 text-info">Learning goal</span></div><div className="support-learning-card card"><span className="support-tool-icon"><MonitorCog size={20} aria-hidden /></span><div><h3>Endpoint management</h3><p>Interested in Microsoft Intune, device configuration, and updates.</p></div><span className="badge border-info/50 bg-info/10 text-info">Learning goal</span></div></div>
        <div className="support-cert-cta"><div><p className="kicker">07 · Courses & credentials</p><h3 className="mt-1 font-semibold">See the learning behind my interests</h3><p className="mt-1 text-sm text-muted">Courses and credentials are listed with their current verification status.</p></div><Link href="/certifications" className="btn-ghost">View Certifications <ArrowRight size={15} aria-hidden /></Link></div>
      </section>

      <section className="container-page py-9 sm:py-12" aria-labelledby="thm-it-h">
        <SectionHeader kicker="TryHackMe · completed rooms" id="thm-it-h" title="Operating systems & support learning" intro="Completed rooms related to practical operating systems, command-line use, virtualization, identity, and system fundamentals." />
        <TryHackMeRooms perspective="IT Support / System Administration" />
      </section>

      <CtaBand title="Interested in working together or have an opportunity?" body="I’m open to internship opportunities, IT support roles, collaborative projects, or a conversation about technology.">
        <LinkButton href="/contact">Contact me <ArrowRight size={16} aria-hidden /></LinkButton>
      </CtaBand>
    </>
  );
}
