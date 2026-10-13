import type { Metadata } from "next";
import { Briefcase, ExternalLink, Mail, MessageCircle, Linkedin } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { SectionHeader } from "@/components/ui";
import { LINKS } from "@/data/site";

export const metadata: Metadata = { title: "Contact me", description: "Contact Princess Joy Abigail Abique: direct channels, an inquiry form, and a Calendly discovery-call booking.", alternates: { canonical: "/contact" } };

const CHANNELS = [
  { name: "LinkedIn", I: Linkedin, desc: "Connect professionally — job opportunities, internships and collaborations.", href: LINKS.linkedin, cta: "View Profile" },
  { name: "Gmail", I: Mail, desc: "Inquiries, project discussions and partnerships.", href: LINKS.email ? `mailto:${LINKS.email}` : "", cta: "Send Email" },
  { name: "Viber", I: MessageCircle, desc: "Quick messages and casual communication.", href: LINKS.viber, cta: "Message Me" },
  { name: "OnlineJobs.ph", I: Briefcase, desc: "Freelance opportunities, VA work and remote projects.", href: LINKS.onlinejobs, cta: "View Profile" },
];

export default function Contact() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-20">
          <p className="kicker">Contact me</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Have a project, opportunity, or just want to <span className="grad-text">connect?</span></h1>
          <p className="mt-4 max-w-2xl text-muted sm:text-lg">I’m open to discussing new opportunities, collaborations, academic projects, or connecting with fellow tech enthusiasts.</p>
          <ul className="mt-5 flex flex-wrap gap-2"><li className="chip">Open for internships</li><li className="chip">Open for freelance / VA</li><li className="chip">Open for collaboration</li></ul>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="ch-h">
        <SectionHeader kicker="Get in touch" id="ch-h" title="Contact methods" intro="Choose the best way to reach me." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ name, I, desc, href, cta }) => (
            <li key={name} className="card card-hover flex flex-col p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><I className="h-5 w-5" aria-hidden /></span>
              <h3 className="mt-3 text-lg font-bold">{name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{desc}</p>
              {href ? (
                <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn-ghost mt-4">{cta} <ExternalLink className="h-4 w-4" aria-hidden /></a>
              ) : (
                <button className="btn-ghost mt-4" disabled aria-label={`${name} link not connected yet`}>Not connected yet</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="inquiry" className="container-page scroll-mt-24 py-10" aria-labelledby="inq-h">
        <div className="card p-6 sm:p-8">
          <SectionHeader kicker="Send a message" id="inq-h" title="General inquiry" intro="Send a message and I’ll reply by email. This is separate from booking a call." />
          <ContactForm />
        </div>
      </section>

      <section id="discovery-call" className="container-page scroll-mt-24 py-10" aria-labelledby="dc-h">
        <div className="card p-6 sm:p-8">
          <SectionHeader kicker="Let’s talk" id="dc-h" title="Book a discovery call" intro="Pick an available time. Meeting platform options (such as Google Meet or Zoom) depend on how the Calendly event is configured. Great for talking through repetitive tasks, tools, desired outcomes and next steps." />
          <CalendlyEmbed />
        </div>
      </section>
    </>
  );
}
