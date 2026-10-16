import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import CareerSelector from "@/components/CareerSelector";
import ProjectCards from "@/components/ProjectCards";
import Portrait from "@/components/Portrait";
import { SectionHeader, StatusBadge } from "@/components/ui";
import styles from "./home-how-work.module.css";

export default function Home() {
  return (
    <>
      <section className="home-hero relative isolate overflow-hidden border-b border-line py-10 sm:py-16">
        <div aria-hidden className="home-hero-orbit" />
        <div aria-hidden className="home-hero-scan" />
        <div className="container-page relative">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <p className="chip gap-2 border-accent/30"><span className="h-2 w-2 rounded-full bg-good shadow-[0_0_10px_rgb(var(--good)/.8)]" aria-hidden /> Welcome to my digital workspace <span className="font-mono text-[10px] text-muted">v.01</span></p>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <Portrait className="h-56 w-44 shrink-0" />
              <div>
                <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                  Princess Joy <span className="grad-text">Abigail Abique</span>
                </h1>
                <p className="mt-3 text-muted">4th Year BSIT Student · Philippines</p>
                <p className="mt-4 text-lg">
                  I explore technology through hands-on projects, labs, practical workflows, documentation and troubleshooting — and turn what I learn into things I can actually test.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#paths" className="btn-primary">Explore My Work <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/about" className="btn-ghost">About Me</Link>
              <Link href="/resume" className="btn-ghost"><FileText className="h-4 w-4" aria-hidden /> View Resume</Link>
              <Link href="/contact" className="btn-ghost">Contact Me</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="kicker">Current signal</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-good" aria-hidden /> Open to internship opportunities</p>
            </div>
            <div className="card p-5">
              <p className="kicker">My process</p>
              <p className={styles.flow} aria-label="Learn, Build, Test, Troubleshoot, Improve">
                {["Learn", "Build", "Test", "Troubleshoot", "Improve"].map((step, i) => (
                  <span className={styles.group} key={step} style={{ "--step-order": i } as React.CSSProperties}>
                    {i > 0 && <span className={styles.arrow} aria-hidden="true">→</span>}
                    <span className={styles.step}>{step}</span>
                  </span>
                ))}
              </p>
            </div>
            <nav aria-label="Jump to an area" className="card p-5 sm:col-span-2">
              <p className="kicker">Choose a destination</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {[["/cybersecurity", "Cybersecurity"], ["/ai-automation", "AI & Automation"], ["/networking", "Networking"], ["/it-support", "IT Support / System"]].map(([h, l]) => (
                  <li key={h}><Link href={h} className="chip px-4 py-2 text-sm transition hover:border-accent hover:text-accent">{l}</Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        </div>
      </section>

      <section id="paths" className="container-page scroll-mt-20 py-10" aria-labelledby="paths-h">
        <SectionHeader kicker="Connected disciplines" id="paths-h" title="Four paths. One curious mind." intro="Select a signal in the workspace to see its current focus, relevant skills and a featured project." />
        <CareerSelector />
      </section>

      <section className="container-page py-10" aria-labelledby="featured-h">
        <SectionHeader kicker="Featured work" id="featured-h" title="Selected projects and activities" intro="Statuses are shown exactly as they are — nothing here is presented as production work." />
        <ProjectCards slugs={["ai-email-operations-assistant", "security-lab-simulated", "packet-tracer-device-setup", "support-ticket-simulation", "securedesk-ai"]} extra={<li><Link href="/about#academic" className="card card-hover flex h-full min-h-[10rem] flex-col items-start justify-center gap-2 border-dashed p-5"><span className="font-semibold">More academic projects</span><span className="text-sm text-muted">DOUGH DELIGHT CAFE POS, ExamEase and ITRACKIT.</span><span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">See them <ArrowRight className="h-4 w-4" aria-hidden /></span></Link></li>} />
      </section>

      <section className="container-page py-10" aria-labelledby="progress-h">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <p className="kicker">Current learning</p>
            <h2 id="progress-h" className="section-title mt-1">Progress, not just promises.</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["TryHackMe Pre Security", "completed"],
                ["TryHackMe Cybersecurity 101", "in-progress"],
                ["TryHackMe SOC Level 1", "in-progress"],
                ["Cisco Packet Tracer device-setup activity", "completed"],
              ].map(([t, s]) => (
                <li key={t} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0">
                  <span>{t}</span><StatusBadge status={s as "completed" | "in-progress"} />
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <p className="kicker">Beyond the projects</p>
            <h2 className="section-title mt-1">The bigger picture.</h2>
            <ul className="mt-5 space-y-3">
              {[
                ["/certifications", "Certifications", "Courses, activities and credentials — with their verification status."],
                ["/about", "About me", "My background, interests and approach."],
                ["/resume", "Resume", "Choose the AI & Automation or Cybersecurity version."],
              ].map(([href, t, d]) => (
                <li key={href}>
                  <Link href={href} className="card card-hover flex items-center justify-between gap-4 p-4">
                    <span><span className="block font-semibold">{t}</span><span className="text-sm text-muted">{d}</span></span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
