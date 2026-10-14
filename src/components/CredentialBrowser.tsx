"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, FileText, Search, X } from "lucide-react";
import { CREDENTIALS, type Credential } from "@/data/credentials";
import { Placeholder } from "./ui";

// Drafts are hidden in production builds unless NEXT_PUBLIC_SHOW_DRAFT_CREDENTIALS=true (e.g. for Preview deployments).
const hideDrafts = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_DRAFT_CREDENTIALS !== "true";

function Detail({ c, onClose }: { c: Credential; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="cred-h"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="w-[min(94vw,48rem)] max-h-[90vh] overflow-y-auto rounded-2xl border border-accent/50 bg-surface p-0 text-ink shadow-neon backdrop:bg-black/70"
    >
      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 id="cred-h" className="text-xl font-bold sm:text-2xl">
              {c.title}
            </h3>
            <p className="mt-1 text-muted">{c.issuer}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close credential details"
            className="shrink-0 rounded-lg p-2 hover:bg-surface2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Credential badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="chip">{c.type}</span>
          <span className="chip">{c.category}</span>

          {c.status === "draft" ? (
            <span className="badge border-warn/50 text-warn">
              Draft — details to confirm
            </span>
          ) : (
            <span className="badge border-good/50 text-good">
              Details confirmed
            </span>
          )}
        </div>

        {/* Metadata */}
        <dl className="mt-5 grid gap-4 rounded-xl border border-line bg-bg/40 p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Issue date</dt>
            <dd className="mt-1 font-medium">
              {c.issueDate ?? "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted">Skills</dt>
            <dd className="mt-1 font-medium">
              {c.skills.join(", ") || "Not specified"}
            </dd>
          </div>
        </dl>

        {/* Description */}
        {c.note && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
            {c.note}
          </p>
        )}

        {/* Certificate preview */}
        <div className="mt-5 overflow-hidden rounded-xl border border-line bg-bg/50 p-3 sm:p-4">
          {c.imageUrl ? (
            <a
              href={c.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full-size certificate image"
              className="block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.imageUrl}
                alt={`${c.title} certificate`}
                className="mx-auto max-h-[55vh] w-auto max-w-full rounded-lg object-contain"
              />
              <p className="mt-3 text-center text-xs text-muted">
                Click certificate to open full-size image
              </p>
            </a>
          ) : c.pdfUrl ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-accent" />
              <p className="mt-3 font-medium">PDF certificate available</p>
              <p className="mt-1 text-sm text-muted">
                Open the original document to view your certificate.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted">
              Certificate preview not available yet.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {c.verifyUrl && (
            <a
              href={c.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Verify credential
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}

          {c.pdfUrl && (
            <a
              href={c.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <FileText className="h-4 w-4" aria-hidden />
              View PDF
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}

          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default function CredentialBrowser() {
  const all = useMemo(() => CREDENTIALS.filter((c) => !(hideDrafts && c.status === "draft")), []);
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [iss, setIss] = useState("All"); const [type, setType] = useState("All");
  const [open, setOpen] = useState<Credential | null>(null);
  const cats = ["All", ...Array.from(new Set(all.map((c) => c.category)))];
  const issuers = ["All", ...Array.from(new Set(all.map((c) => c.issuer)))];
  const types = ["All", ...Array.from(new Set(all.map((c) => c.type)))];
  const list = all.filter((c) => {
    const hay = [c.title, c.issuer, c.category, c.type, ...c.skills].join(" ").toLowerCase();
    return hay.includes(q.trim().toLowerCase()) && (cat === "All" || c.category === cat) && (iss === "All" || c.issuer === iss) && (type === "All" || c.type === type);
  });
  const sel = "rounded-lg border border-line bg-bg px-3 py-2 text-sm";
  return (
    <div>
      {!hideDrafts && <p className="mb-4 rounded-lg border border-warn/40 bg-warn/10 p-3 text-sm text-warn" role="note">Draft mode: entries below were mentioned during planning but their exact title, date and proof are not confirmed yet. Do not treat them as verified credentials. They are hidden automatically in production builds.</p>}
      {all.length > 0 && <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden /><label htmlFor="cq" className="sr-only">Search credentials</label><input id="cq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, issuer, category or skill" className={`${sel} w-full pl-9`} /></div>
        {[["Category", cat, setCat, cats], ["Issuer", iss, setIss, issuers], ["Type", type, setType, types]].map(([l, v, set, opts]) => (
          <div key={l as string}><label className="sr-only" htmlFor={`f-${l}`}>{l as string}</label><select id={`f-${l}`} value={v as string} onChange={(e) => (set as (s: string) => void)(e.target.value)} className={`${sel} w-full`}>{(opts as string[]).map((o) => <option key={o} value={o}>{o === "All" ? `All ${(l as string).toLowerCase()}s`.replace("categorys", "categories").replace("issuers", "issuers") : o}</option>)}</select></div>
        ))}
      </div>}
      {all.length > 0 && <p className="mt-3 text-sm text-muted" aria-live="polite">{list.length} result{list.length === 1 ? "" : "s"}</p>}
      {all.length === 0 ? (
        <p className="card mt-6 p-8 text-center text-muted">Verified credentials are being added. Check back soon, or see my <a className="font-semibold text-accent underline" href="/resume">resume</a>.</p>
      ) : list.length === 0 ? (
        <p className="card mt-4 p-8 text-center text-muted">No credentials match your search. Clear a filter to see more.</p>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.id} className="card card-hover flex flex-col p-5">
              <div className="flex flex-wrap gap-2"><span className="chip">{c.type}</span>{c.status === "draft" && <span className="badge border-warn/50 text-warn">Draft</span>}</div>
              <h3 className="mt-3 font-semibold">{c.title}</h3>
              <p className="text-sm text-muted">{c.issuer}</p>
              <p className="mt-2 flex-1 text-xs text-muted">{c.skills.join(" · ")}</p>
              <button onClick={() => setOpen(c)} className="btn-ghost mt-4 self-start">View details</button>
            </li>
          ))}
        </ul>
      )}
      {open && <Detail c={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
