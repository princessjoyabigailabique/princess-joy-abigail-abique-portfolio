import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { CtaBand, LinkButton, PageHero, SectionHeader, StatusBadge } from "@/components/ui";
import WorkflowExplorer from "@/components/WorkflowExplorer";
import { LeadDemo } from "@/components/AutomationDemos";
import EmailOperationsProject from "@/components/EmailOperationsProject";
import { PROJECTS } from "@/data/projects";
import TryHackMeRooms from "@/components/TryHackMeRooms";

export const metadata: Metadata = { title: "AI & Automation", description: "n8n workflow projects: AI Email Operations Assistant, VA Lead Management System and the SecureDesk AI prototype, with interactive simulated demos.", alternates: { canonical: "/ai-automation" } };

const proj = (s: string) => PROJECTS.find((p) => p.slug === s)!;

function Intro({ slug, id, n }: { slug: string; id: string; n: string }) {
  const p = proj(slug);
  return (
    <div id={id} className="scroll-mt-24">
      <p className="kicker">{n}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3"><h2 className="section-title">{p.title}</h2><StatusBadge status={p.status} /></div>
      <p className="mt-2 max-w-3xl text-muted">{p.summary}</p>
      <ul className="mt-3 flex flex-wrap gap-2">{p.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{p.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
    </div>
  );
}

export default function Automation() {
  return (
    <>
      <PageHero kicker="AI & Automation" tag="Building practical solutions" title="Less repetitive work." accent="More intelligent workflows."
        body="I build automations that connect tools, organize information and simplify everyday work — with a human reviewing anything the AI suggests.">
        <LinkButton href="#email-assistant">Explore my projects</LinkButton>
        <LinkButton href="#tools" variant="ghost">View my tools</LinkButton>
      </PageHero>

      <EmailOperationsProject />
      <section className="container-page space-y-6 py-10"><Intro slug="va-lead-management-system" id="lead-management" n="Featured project" /><LeadDemo /></section>
      <section className="container-page space-y-6 py-10">
        <Intro slug="securedesk-ai" id="securedesk" n="Another project" />
        <p className="rounded-xl border border-dashed border-accent/50 p-4 text-sm text-muted">No live demo yet. A demo will be added only when it reflects the real prototype.</p>
      </section>

      <section className="container-page py-10" aria-labelledby="wf-h">
        <SectionHeader kicker="Workflow explorer" id="wf-h" title="Explore the workflow" intro="Select a step to see what it does, its inputs and outputs, its logic and how errors are handled." />
        <WorkflowExplorer />
      </section>

      <section className="container-page py-10" aria-labelledby="thm-ai-h">
        <SectionHeader kicker="TryHackMe · completed rooms" id="thm-ai-h" title="AI & security automation learning" intro="Only completed rooms with a direct AI or security automation connection appear here. Security operations topics remain on the Cybersecurity page." />
        <TryHackMeRooms perspective="AI & Automation" />
      </section>

      <section id="tools" className="container-page scroll-mt-24 py-10" aria-labelledby="tools-h">
        <SectionHeader kicker="Tools & technologies" id="tools-h" title="Tools I work with" intro="Only tools used in the projects above are listed." />
        <ul className="flex flex-wrap gap-2">{["n8n", "Google Sheets", "Gmail", "OpenAI API", "Telegram", "Webhooks", "Next.js", "TypeScript", "Prisma", "Auth.js"].map((t) => <li key={t} className="chip px-4 py-2 text-sm">{t}</li>)}</ul>
      </section>

      <section className="container-page py-10" aria-labelledby="approach-h">
        <SectionHeader kicker="My approach" id="approach-h" title="From idea to automation" />
        <ol className="grid gap-3 sm:grid-cols-5">
          {["Understand the problem", "Map the current process", "Build the workflow", "Test and refine", "Document the result"].map((s, i) => (
            <li key={s} className="card p-4 text-sm"><span className="font-mono text-accent">0{i + 1}</span><p className="mt-1 font-semibold">{s}</p></li>
          ))}
        </ol>
      </section>

      <CtaBand title="Have a process you want to improve?" body="Book a discovery call to talk through repetitive tasks, tools and desired outcomes — or just send an inquiry.">
        <LinkButton href="/contact#discovery-call"><CalendarCheck className="h-4 w-4" aria-hidden /> Start a discovery call</LinkButton>
        <LinkButton href="/contact#inquiry" variant="ghost">Or contact me directly</LinkButton>
      </CtaBand>
    </>
  );
}
