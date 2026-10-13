import type { Metadata } from "next";
import { Check } from "lucide-react";
import { CtaBand, LinkButton, PageHero, Placeholder, SectionHeader, StatusBadge } from "@/components/ui";
import Topology from "@/components/Topology";

export const metadata: Metadata = { title: "Networking", description: "Networking fundamentals, a completed Cisco Packet Tracer device-setup activity, and an interactive simulated topology.", alternates: { canonical: "/networking" } };

const FUND = [
  ["TCP/IP", "How devices communicate across networks."], ["IP addressing", "Addresses and how they’re structured."], ["Subnetting", "Splitting networks into smaller ones."],
  ["Routers & switches", "Forwarding between and within networks."], ["Network topology", "How devices are arranged and linked."], ["Connectivity testing & troubleshooting", "Checking reachability and isolating faults."],
];
const NEXT = ["Static routing practice", "VLAN configuration practice", "Documenting a lab with screenshots and configs", "Subnetting exercises"];

export default function Networking() {
  return (
    <>
      <PageHero kicker="Networking" tag="Connecting the digital world" title="Understand. Configure." accent="Connect."
        body="I’m exploring how devices, networks and protocols work together through hands-on labs and simulations.">
        <LinkButton href="#labs">See my labs</LinkButton>
        <LinkButton href="#topology" variant="ghost">Try the topology</LinkButton>
      </PageHero>

      <section id="topology" className="container-page scroll-mt-24 py-10" aria-labelledby="topo-h">
        <SectionHeader kicker="Interactive lab" id="topo-h" title="Network topology explorer" intro="Select a router, switch or PC to see an example configuration, then run a simulated ping." />
        <Topology />
      </section>

      <section id="labs" className="container-page scroll-mt-24 py-10" aria-labelledby="labs-h">
        <SectionHeader kicker="Verified activity" id="labs-h" title="Networking labs & activities" intro="Only activities I can confirm are marked completed. Others are labelled as planned." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="card border-good/40 p-5">
            <div className="flex items-start justify-between gap-3"><h3 className="font-semibold">Cisco Packet Tracer — device setup</h3><StatusBadge status="completed" /></div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {["Connected devices using different cables", "Installed a backup router", "Configured a hostname on a networking device"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-good" aria-hidden />{t}</li>)}
            </ul>
            <div className="mt-4"><Placeholder label="screenshot / write-up not added yet" className="h-24" /></div>
          </article>
          {NEXT.slice(0, 2).map((n) => (
            <article key={n} className="card border-dashed p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{n}</h3><StatusBadge status="planned" /></div><p className="mt-2 text-sm text-muted">Learning goal. No evidence yet, so it isn’t listed as an accomplishment.</p></article>
          ))}
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="fund-h">
        <SectionHeader kicker="Key concepts" id="fund-h" title="Networking fundamentals" intro="Topics I’m studying — learning topics, not completed accomplishments." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{FUND.map(([t, d]) => <li key={t} className="card p-4"><p className="font-semibold">{t}</p><p className="text-sm text-muted">{d}</p></li>)}</ul>
      </section>

      <section className="container-page py-10" aria-labelledby="doc-h">
        <SectionHeader kicker="Documentation" id="doc-h" title="How I’ll document each lab" />
        <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{["Objective", "Topology", "Configuration", "Verification (ping, show commands)", "Troubleshooting notes", "Lessons learned"].map((s, i) => <li key={s} className="card p-3 text-sm"><span className="font-mono text-accent">0{i + 1}</span><p className="font-semibold">{s}</p></li>)}</ol>
      </section>

      <CtaBand title="Always learning, always exploring." body="More labs will be added with evidence as I complete them.">
        <LinkButton href="/certifications">View Certifications</LinkButton>
        <LinkButton href="/resume" variant="ghost">Resume</LinkButton>
        <LinkButton href="/contact" variant="ghost">Contact me</LinkButton>
      </CtaBand>
    </>
  );
}
