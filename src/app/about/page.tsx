import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, Search, TrendingUp, GraduationCap, MapPin, User, Briefcase, ArrowRight, FileText, Mail } from "lucide-react";
import Portrait from "@/components/Portrait";
import PersonalSection from "@/components/Collapsible";
import AreaIcon from "@/components/AreaIcon";
import { SectionHeader } from "@/components/ui";
import ProjectCards from "@/components/ProjectCards";
import { AREAS } from "@/data/projects";

export const metadata: Metadata = { title: "About", description: "About Princess Joy Abigail Abique — a fourth-year BSIT student who learns by building and troubleshooting.", alternates: { canonical: "/about" } };

const FACTS = [
  { I: User, k: "Full name", v: "Princess Joy Abigail Abique" },
  { I: MapPin, k: "Location", v: "Philippines" },
  { I: GraduationCap, k: "Education", v: "BSIT — 4th year" },
  { I: Briefcase, k: "Availability", v: "Open for internship opportunities" },
];
const STEPS = [
  { I: BookOpen, t: "Learn", d: "Understand the concepts and see the bigger picture." },
  { I: Code2, t: "Build", d: "Turn what I learn into practical projects or labs." },
  { I: Search, t: "Test", d: "Check if it works, troubleshoot errors, and learn from mistakes." },
  { I: TrendingUp, t: "Improve", d: "Document what I learned and find ways to do it better." },
];

export default function About() {
  return (
    <>
      <section className="container-page py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto]">
          <Portrait className="h-72 w-56" />
          <div>
            <p className="kicker">About me</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight sm:text-5xl">I learn by building, and grow by <span className="grad-text">troubleshooting.</span></h1>
            <p className="mt-5 max-w-2xl text-muted sm:text-lg">
              I’m Princess Joy Abigail Abique, a fourth-year BSIT student from the Philippines. I enjoy exploring cybersecurity, AI and automation, networking, and IT support/system administration. I like turning what I learn into practical projects, documenting the process, and improving through hands-on practice. I’m always happy to learn from experienced IT professionals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/resume" className="btn-primary"><FileText className="h-4 w-4" aria-hidden /> View Resume</Link>
              <Link href="/contact" className="btn-ghost"><Mail className="h-4 w-4" aria-hidden /> Contact Me</Link>
            </div>
          </div>
          <ul aria-label="Quick facts" className="card grid content-start gap-4 p-5 lg:w-72">
            {FACTS.map(({ I, k, v }) => (
              <li key={k} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent"><I className="h-5 w-5" aria-hidden /></span>
                <div><p className="text-xs text-accent">{k}</p><p className="text-sm">{v}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-8" aria-labelledby="how-h">
        <SectionHeader kicker="My approach" id="how-h" title="How I work" intro="I like understanding the “how” and “why” behind things. I learn by doing, ask questions, and improve through practice and troubleshooting." />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ I, t, d }, i) => (
            <li key={t} className="card card-hover p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><I className="h-5 w-5" aria-hidden /></span>
              <p className="mt-3 flex items-baseline gap-2"><span className="font-mono text-sm text-accent">0{i + 1}</span><span className="text-lg font-semibold">{t}</span></p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page py-8" aria-labelledby="explore-h">
        <SectionHeader kicker="Technical interests" id="explore-h" title="What I’m exploring" intro="A quick overview of what I’m currently learning and building." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <li key={a.id} className="card card-hover flex flex-col p-5">
              <span className="flex items-center gap-3 font-semibold"><span className="text-accent"><AreaIcon area={a.id} /></span>{a.label}</span>
              <p className="mt-2 flex-1 text-sm text-muted">{a.blurb}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">{a.topics.slice(0, 3).map((t) => <li key={t} className="chip">{t}</li>)}</ul>
              <Link href={a.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">Explore <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-8" aria-labelledby="journey-h">
        <SectionHeader kicker="Education & learning journey" id="journey-h" title="My journey so far" intro="A combination of formal education, hands-on practice, online courses and personal projects." />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["BS Information Technology (BSIT)", "Philippines — currently in 4th year."],
            ["Certifications & online learning", "Courses from providers such as LinkedIn Learning, Cisco Networking Academy, IBM and TryHackMe. See the Certifications page for verification status."],
            ["Academic & personal projects", "School projects, automation workflows and hands-on labs."],
          ].map(([t, d]) => (
            <li key={t} className="card border-l-2 border-l-accent p-5"><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-muted">{d}</p></li>
          ))}
        </ol>
      </section>

      <section id="academic" className="container-page scroll-mt-24 py-8" aria-labelledby="acad-h">
        <SectionHeader kicker="School work" id="acad-h" title="Academic projects" intro="Projects from my BSIT program. I only list details I can confirm." />
        <ProjectCards slugs={["itrackit", "dough-delight-pos", "examease"]} />
      </section>

      <PersonalSection />
    </>
  );
}
