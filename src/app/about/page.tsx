import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Mail, Network, Sparkles } from "lucide-react";
import Portrait from "@/components/Portrait";
import PersonalSection from "@/components/Collapsible";
import EducationTimeline from "@/components/EducationTimeline";
import AreaIcon from "@/components/AreaIcon";
import { SectionHeader } from "@/components/ui";
import { AREAS } from "@/data/projects";
import { LINKS } from "@/data/site";

export const metadata: Metadata = { title: "About", description: "Meet Princess Joy Abigail Abique, a fourth-year BSIT student exploring cybersecurity, AI automation, networking and IT systems.", alternates: { canonical: "/about" } };

const INTERESTS = [
  { id: "cybersecurity", description: "I’m interested in security monitoring, threat analysis, SIEM concepts, and learning through hands-on practice." },
  { id: "ai-automation", description: "I enjoy building workflows that simplify repetitive tasks with tools such as n8n, while exploring useful AI-powered solutions." },
  { id: "networking", description: "I’m learning how network infrastructure, connectivity, and device configuration fit together through practical exercises." },
  { id: "it-support", description: "I like troubleshooting and exploring system administration, identity and access management, and tools such as Microsoft Entra ID and Intune." },
] as const;

const APPROACH = [
  { title: "Understand", text: "Break down the problem and identify what needs to happen." },
  { title: "Build", text: "Apply what I know and research what I don't." },
  { title: "Test", text: "Check the result, identify errors, and troubleshoot." },
  { title: "Improve", text: "Document what I learned and refine the solution." },
];

export default function About() {
  return (
    <>
      <section className="page-atmosphere atmosphere-cybersecurity">
        <div className="container-page relative py-10 sm:py-16">
          <div className="about-intro">
            <Portrait className="about-portrait" />
            <div className="about-intro-copy">
              <p className="kicker">Meet Abique <span className="eyebrow-note ml-2 normal-case tracking-normal">currently learning, always curious ✦</span></p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">The person behind the <span className="grad-text">systems.</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">I'm Princess Joy Abigail Abique, a fourth-year BSIT student exploring the intersection of cybersecurity, AI automation, and practical IT solutions. I like understanding how things work, finding ways to make processes better, and turning what I learn into something I can actually use. I'm still growing, experimenting, and figuring out where my interests can take me—and that's part of the journey.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/resume" className="btn-primary"><FileText className="h-4 w-4" aria-hidden /> View Resume</Link>
                <Link href="/contact#inquiry" className="btn-ghost"><Mail className="h-4 w-4" aria-hidden /> Get in touch</Link>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Sparkles size={14} className="text-accent" aria-hidden /> Fourth-year BSIT student <span aria-hidden>·</span> Philippines</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14" aria-labelledby="interests-h">
        <SectionHeader kicker="What catches my curiosity" id="interests-h" title="How I Fit into Tech" intro="These are the areas I’m exploring and what draws me to them. Choose a path to see the related work elsewhere in my portfolio." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INTERESTS.map((interest, index) => {
            const area = AREAS.find((item) => item.id === interest.id)!;
            return <li key={area.id}><Link href={area.href} className="about-interest card card-hover flex h-full flex-col p-5">
              <span className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent"><AreaIcon area={area.id} /></span><span className="font-mono text-xs text-accent/75">0{index + 1}</span></span>
              <h3 className="mt-4 font-semibold">{area.label}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{interest.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">Explore this area <ArrowRight className="h-4 w-4" aria-hidden /></span>
            </Link></li>;
          })}
        </ul>
      </section>

      <section className="container-page py-8 sm:py-12" aria-labelledby="journey-h">
        <SectionHeader kicker="Learning as I go" id="journey-h" title="My Learning Journey" intro="The schools and milestones that shaped my path so far. Select a card to open its photo gallery." />
        <EducationTimeline />
      </section>

      <section className="container-page py-8 sm:py-12" aria-labelledby="approach-h">
        <SectionHeader kicker="A practical loop" id="approach-h" title="How I Approach a Problem" intro="A simple process I try to follow when I’m learning or building something." />
        <ol className="about-approach grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {APPROACH.map(({ title, text }, i) => <li key={title} className="about-approach-step card p-5"><span className="font-mono text-xs text-accent">0{i + 1} / 04</span><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></li>)}
        </ol>
      </section>

      <PersonalSection />

      <section className="container-page py-10 sm:py-14" aria-labelledby="headed-h">
        <div className="about-future card p-6 sm:p-9">
          <div className="max-w-2xl"><p className="kicker">Where I'm headed</p><h2 id="headed-h" className="section-title mt-2">Still learning. Ready to contribute.</h2><p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">I'm looking for opportunities to put my knowledge into practice, learn from real-world challenges, and grow alongside people who care about building useful technology.</p></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/resume" className="btn-primary"><FileText className="h-4 w-4" aria-hidden /> Resume</Link>
            {LINKS.linkedin ? <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost"><Network className="h-4 w-4" aria-hidden /> LinkedIn</a> : <span className="btn-ghost cursor-not-allowed opacity-65" aria-label="LinkedIn profile link is not connected yet"><Network className="h-4 w-4" aria-hidden /> LinkedIn · not connected</span>}
            <Link href="/contact#inquiry" className="btn-ghost"><Mail className="h-4 w-4" aria-hidden /> Contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
