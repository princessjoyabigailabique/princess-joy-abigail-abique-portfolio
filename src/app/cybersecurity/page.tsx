import type { Metadata } from "next";
import { ExternalLink, FileText, Mail, FlaskConical } from "lucide-react";
import { CtaBand, LinkButton, PageHero, SectionHeader, StatusBadge } from "@/components/ui";
import SocLab from "@/components/SocLab";
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
        <SectionHeader kicker="TryHackMe learning journey" id="paths-h" title="My learning paths" intro="Progress is shown as status only. I haven’t listed percentages or individual rooms I can’t yet back with evidence." />
        <ul className="grid gap-4 md:grid-cols-3">
          {PATHS.map((p) => (
            <li key={p.title} className="card card-hover p-5">
              <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold">{p.title}</h3><StatusBadge status={p.status} /></div>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-10" aria-labelledby="labs-h">
        <SectionHeader kicker="Evidence" id="labs-h" title="Lab & write-up library" intro="Verified TryHackMe rooms and technical write-ups will appear here." />
        <div className="card flex flex-col items-center gap-3 border-dashed p-10 text-center">
          <FlaskConical className="h-8 w-8 text-accent" aria-hidden />
          <p className="font-semibold">No verified write-ups published yet</p>
          <p className="max-w-xl text-sm text-muted">Each write-up will include the objective, environment and tools, the steps I personally performed, sanitized evidence, findings, conclusion, limitations and lessons learned. I only add a room after I can supply those details.</p>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="lab-h">
        <SectionHeader kicker="Interactive lab" id="lab-h" title="Security lab (simulated)" intro="Pick a fictional alert, inspect the sample logs, choose a triage decision, and see what evidence to check next." />
        <SocLab />
      </section>

      <section className="container-page py-10" aria-labelledby="skills-h">
        <SectionHeader kicker="Skills & tools" id="skills-h" title="Topics I’m learning" intro="These are learning topics — not claims of professional mastery." />
        <ul className="flex flex-wrap gap-2">{TOPICS.map((t) => <li key={t} className="chip px-4 py-2 text-sm">{t}</li>)}</ul>
      </section>

      <CtaBand title="See the credentials behind the learning" body="Courses and activities are listed with their verification status.">
        <LinkButton href="/certifications">View Certifications</LinkButton>
        <LinkButton href="/resume" variant="ghost"><FileText className="h-4 w-4" aria-hidden /> Cybersecurity Resume</LinkButton>
      </CtaBand>
    </>
  );
}
