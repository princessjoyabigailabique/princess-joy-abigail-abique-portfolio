import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CtaBand, LinkButton, PageHero, Placeholder, SectionHeader, StatusBadge } from "@/components/ui";
import TicketSim from "@/components/TicketSim";
import type { Status } from "@/data/projects";

export const metadata: Metadata = { title: "IT Support / System", description: "Structured IT troubleshooting, support documentation and system administration learning, with an interactive simulated support ticket.", alternates: { canonical: "/it-support" } };

const TOOLS: { t: string; s: Status; d: string }[] = [
  { t: "Command line & basic network checks", s: "planned", d: "Learning goal — ping, ipconfig and similar tools." },
  { t: "Cisco Packet Tracer", s: "completed", d: "Device setup activity completed." },
  { t: "Windows troubleshooting", s: "planned", d: "Learning goal — not yet claimed as experience." },
  { t: "Documentation", s: "planned", d: "Learning goal — clear resolution notes (see the simulation above for my process)." },
  { t: "Active Directory / Microsoft Entra ID", s: "planned", d: "Learning goal — not yet claimed as experience." },
  { t: "Microsoft Intune", s: "planned", d: "Learning goal — not yet claimed as experience." },
  { t: "Endpoint patching", s: "planned", d: "Learning goal — not yet claimed as experience." },
  { t: "Microsoft 365 / remote support", s: "planned", d: "Learning goal — not yet claimed as experience." },
];
const FLOW = ["Understand the issue", "Identify the impact", "Isolate the problem", "Test likely causes", "Resolve or escalate", "Document the result"];

export default function ItSupport() {
  return (
    <>
      <PageHero kicker="IT Support / System" tag="Solving problems, keeping systems running" title="Support people. Maintain systems." accent="Keep it running."
        body="I’m learning IT support and system administration through structured troubleshooting, careful documentation and hands-on practice.">
        <LinkButton href="#ticket">Try the ticket simulation</LinkButton>
      </PageHero>

      <section id="ticket" className="container-page scroll-mt-24 py-10" aria-labelledby="t-h">
        <SectionHeader kicker="Interactive lab" id="t-h" title="IT support ticket simulation" intro="Work a fictional ticket from start to finish: choose the best troubleshooting step at each stage." />
        <TicketSim />
      </section>

      <section className="container-page py-10" aria-labelledby="flow-h">
        <SectionHeader kicker="My approach" id="flow-h" title="How I solve IT support issues" />
        <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">
          {FLOW.map((f, i) => (
            <li key={f} className="flex flex-1 items-center gap-2"><div className="card flex-1 p-3 text-sm"><span className="font-mono text-accent">0{i + 1}</span><p className="font-semibold">{f}</p></div>{i < FLOW.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-accent md:block" aria-hidden />}</li>
          ))}
        </ol>
      </section>

      <section className="container-page py-10" aria-labelledby="tools-h">
        <SectionHeader kicker="Skills & tools" id="tools-h" title="What I’m learning" intro="Only the Packet Tracer activity is a confirmed completed item. Everything else is a learning goal, not completed experience." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((x) => <li key={x.t} className="card p-4"><div className="flex items-start justify-between gap-2"><p className="font-semibold">{x.t}</p><StatusBadge status={x.s} label={x.s === "planned" ? "Learning goal" : undefined} /></div><p className="mt-1 text-sm text-muted">{x.d}</p></li>)}
        </ul>
      </section>

      <section className="container-page py-10" aria-labelledby="labs-h">
        <SectionHeader kicker="Verified activities" id="labs-h" title="Completed support activities" intro="Evidence will be added as I complete and document each activity." />
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card border-good/40 p-5"><div className="flex items-start justify-between"><h3 className="font-semibold">Cisco Packet Tracer — device setup</h3><StatusBadge status="completed" /></div><p className="mt-2 text-sm text-muted">Connected devices using different cables, installed a backup router, and configured a hostname.</p></article>
          <article className="card border-dashed p-5"><Placeholder label="future documented lab" className="h-24" /></article>
          <article className="card border-dashed p-5"><Placeholder label="future documented lab" className="h-24" /></article>
        </div>
      </section>

      <CtaBand title="Interested in working together?" body="I’m open to internship opportunities, IT support roles, collaborative projects, or just a conversation about tech.">
        <LinkButton href="/contact">Contact me</LinkButton><LinkButton href="/resume" variant="ghost">Resume</LinkButton>
      </CtaBand>
    </>
  );
}
