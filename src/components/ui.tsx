import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STATUS_LABEL, type Status } from "@/data/projects";

const STATUS_STYLE: Record<Status, string> = {
  completed: "border-good/50 text-good bg-good/10",
  "in-progress": "border-info/50 text-info bg-info/10",
  prototype: "border-accent/50 text-accent bg-accent/10",
  simulated: "border-warn/50 text-warn bg-warn/10",
  planned: "border-warn/50 text-warn bg-warn/10",
  academic: "border-accent/50 text-accent bg-accent/10",
  placeholder: "border-line text-muted bg-surface2",
};

export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  return <span className={`badge ${STATUS_STYLE[status]}`}>{label ?? STATUS_LABEL[status]}</span>;
}

export function SectionHeader({
  kicker,
  title,
  intro,
  id,
  action,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  id?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id} className="section-title mt-1">
          {title}
        </h2>
        {intro && <p className="mt-2 text-sm text-muted sm:text-base">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const cls = variant === "primary" ? "btn-primary" : "btn-ghost";
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Arrow() {
  return <ArrowRight className="h-4 w-4" aria-hidden />;
}

/** Honest placeholder for media that has not been supplied yet. */
export function Placeholder({ label, className = "h-32" }: { label: string; className?: string }) {
  return (
    <div className={`placeholder-box ${className}`} role="img" aria-label={`Placeholder: ${label}`}>
      <span className="px-3">Placeholder — {label}</span>
    </div>
  );
}

export function SimBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-xs text-warn" role="note">
      {children}
    </p>
  );
}

/** Hero used by the four skill pages. */
export function PageHero({
  kicker,
  tag,
  title,
  accent,
  body,
  children,
}: {
  kicker: string;
  tag?: string;
  title: string;
  accent: string;
  body: string;
  children?: React.ReactNode;
}) {
  const atmosphere = kicker.toLowerCase().includes("cyber") ? "cybersecurity" : kicker.toLowerCase().includes("automation") ? "automation" : kicker.toLowerCase().includes("network") ? "networking" : "support";
  return (
    <section className={`page-atmosphere atmosphere-${atmosphere}`}>
      <div className="container-page relative py-14 sm:py-20">
        <div className="flex flex-wrap items-center gap-3">
          <p className="kicker">{kicker}</p>
          {tag && <span className="chip">{tag}</span>}
        </div>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          {title} <span className="grad-text">{accent}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">{body}</p>
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function CtaBand({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <section className="container-page py-12">
      <div className="card flex flex-wrap items-center justify-between gap-6 border-accent/40 p-6 sm:p-8">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-muted">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  );
}
