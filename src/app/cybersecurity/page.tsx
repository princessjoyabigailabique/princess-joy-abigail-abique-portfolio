import type { Metadata } from "next";
import { ExternalLink, FileText, Mail, FlaskConical } from "lucide-react";
import { CtaBand, LinkButton, PageHero, SectionHeader, StatusBadge } from "@/components/ui";
import SocLab from "@/components/SocLab";
import TryHackMeRooms from "@/components/TryHackMeRooms";
import { LINKS } from "@/data/site";
import type { Status } from "@/data/projects";

export const metadata: Metadata = { title: "Cybersecurity", description: "My cybersecurity learning journey: TryHackMe paths, SIEM and log analysis topics, and an interactive simulated SOC alert-triage lab.", alternates: { canonical: "/cybersecurity" } };

const PATHS: { title: string; status: Status; desc: string }[] = [
  { title: "Pre Security", status: "completed", desc: "A beginner-friendly path covering cybersecurity essentials, Linux, networking and system fundamentals." },
  { title: "Cybersecurity 101", status: "in-progress", desc: "A guided path building core cybersecurity knowledge: threats, networks, systems and defensive security." },
  { title: "SOC Level 1", status: "in-progress", desc: "Learning security operations: log analysis, alert triage, incident handling and SIEM tools." },
];
const TOPICS = ["Security monitoring", "SIEM fundamentals", "Log analysis", "Threat analysis", "Phishing analysis", "MITRE ATT&CK", "KQL", "Elastic Stack", "Splunk fundamentals", "Endpoint detection & response concepts", "Security alert investigation", "Incident response fundamentals"];

export default function Cyber() {
  return (
    <>
      <PageHero kicker="Cybersecurity" tag="Learning & building" title="Learn. Investigate." accent="Defend."
        body="I’m building my cybersecurity foundation through hands-on labs, guided learning paths and security-monitoring concepts. Everything below is labelled with its true status.">
        {LINKS.tryhackme ? (
          <LinkButton href={LINKS.tryhackme} external>View TryHackMe Profile <ExternalLink className="h-4 w-4" aria-hidden /></LinkButton>
        ) : (
          <button className="btn-ghost" disabled aria-label="TryHackMe profile link not connected yet">TryHackMe profile — not connected yet</button>
        )}
        <LinkButton href="/contact" variant="ghost"><Mail className="h-4 w-4" aria-hidden /> Contact Me</LinkButton>
      </PageHero>

      <section className="container-page py-10" aria-labelledby="paths-h">
        <SectionHeader kicker="TryHackMe learning journey" id="paths-h" title="My learning paths" intro="Path progress is shown separately from room completion. Completed rooms below are verified against my public profile." />
        <ul className="grid gap-4 md:grid-cols-3">
          {PATHS.map((p) => (
            <li key={p.title} className="card card-hover p-5">
              <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold">{p.title}</h3><StatusBadge status={p.status} /></div>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-10" aria-labelledby="rooms-h">
        <SectionHeader kicker="TryHackMe · completed rooms" id="rooms-h" title="Security learning library" intro="Completed rooms from my public TryHackMe profile, grouped by the security topic they teach. Individual room completion is separate from learning path progress." />
        <TryHackMeRooms perspective="Cybersecurity" />
      </section>

      <section className="container-page py-10" aria-labelledby="labs-h">
        <SectionHeader kicker="Evidence" id="labs-h" title="Lab & write-up library" intro="Technical write-ups will be added when I can include the steps, evidence, findings and lessons from my own work." />
        <div className="card flex flex-col items-center gap-3 border-dashed p-10 text-center">
          <FlaskConical className="h-8 w-8 text-accent" aria-hidden />
          <p className="font-semibold">No verified write-ups published yet</p>
          <p className="max-w-xl text-sm text-muted">Each write-up will include the objective, environment and tools, the steps I personally performed, sanitized evidence, findings, conclusion, limitations and lessons learned. I only add a room after I can supply those details.</p>
        </div>
      </section>

      <section id="lab-h" className="container-page scroll-mt-24 py-10">
        <SocLab />
      </section>

      <section className="container-page py-10" aria-labelledby="skills-h">
        <SectionHeader kicker="Skills & tools" id="skills-h" title="Topics I’m learning" intro="These are learning topics — not claims of professional mastery." />
        <div className="group overflow-hidden rounded-2xl border border-line bg-surface/60 py-4" aria-label="Cybersecurity topics I’m learning">
          <div className="flex w-max motion-safe:animate-[tools-marquee-right_36s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused] motion-safe:group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} aria-label={copy === 0 ? "Topics I’m learning" : undefined} className="flex shrink-0 gap-2 pr-2">
                {TOPICS.map((topic) => <li key={topic} className="chip px-4 py-2 text-sm">{topic}</li>)}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="See the credentials behind the learning" body="Courses and activities are listed with their verification status.">
        <LinkButton href="/certifications">View Certifications</LinkButton>
        <LinkButton href="/resume" variant="ghost"><FileText className="h-4 w-4" aria-hidden /> Cybersecurity Resume</LinkButton>
      </CtaBand>
    </>
  );
}
