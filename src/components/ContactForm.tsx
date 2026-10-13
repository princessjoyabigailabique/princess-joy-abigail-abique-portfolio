"use client";
import { useState } from "react";
import Script from "next/script";
import { Loader2, Send } from "lucide-react";
import { contactSchema, INQUIRY_TYPES } from "@/lib/contact-schema";

type Errors = Record<string, string[] | undefined>;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [serverMsg, setServerMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const token = data["cf-turnstile-response"];
    const parsed = contactSchema.safeParse({ ...data, turnstileToken: token });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(fe); setState("idle");
      const first = Object.keys(fe)[0];
      // Move focus to the first invalid field so keyboard / screen-reader users land on the problem.
      requestAnimationFrame(() => (form.elements.namedItem(first) as HTMLElement | null)?.focus());
      return;
    }
    setErrors({}); setState("sending"); setServerMsg("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) { setState("sent"); form.reset(); return; }
      if (json.errors) setErrors(json.errors);
      setServerMsg(json.error || "Something went wrong. Please try again.");
      setState("failed");
    } catch { setServerMsg("Network error. Check your connection and try again."); setState("failed"); }
  }

  const field = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm";
  const Err = ({ k }: { k: string }) => errors[k]?.[0] ? <p id={`${k}-err`} className="mt-1 text-xs text-bad" role="alert">{errors[k]![0]}</p> : null;
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  if (state === "sent") return <div role="status" className="rounded-xl border border-good/50 bg-good/10 p-6"><p className="font-semibold">Message sent</p><p className="mt-1 text-sm">Thanks — your message was delivered. This was an inquiry, not a booked meeting; to schedule a call use the booking section below.</p><button className="btn-ghost mt-4" onClick={() => setState("idle")}>Send another</button></div>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer strategy="lazyOnload" />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="name" className="text-sm font-semibold">Full name <span aria-hidden className="text-accent">*</span></label><input id="name" name="name" autoComplete="name" required className={field} {...aria("name")} /><Err k="name" /></div>
        <div><label htmlFor="email" className="text-sm font-semibold">Email address <span aria-hidden className="text-accent">*</span></label><input id="email" name="email" type="email" autoComplete="email" required className={field} {...aria("email")} /><Err k="email" /></div>
        <div><label htmlFor="inquiryType" className="text-sm font-semibold">Inquiry type <span aria-hidden className="text-accent">*</span></label><select id="inquiryType" name="inquiryType" required defaultValue="" className={field} {...aria("inquiryType")}><option value="" disabled>Select an option…</option>{INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select><Err k="inquiryType" /></div>
        <div><label htmlFor="subject" className="text-sm font-semibold">Subject <span aria-hidden className="text-accent">*</span></label><input id="subject" name="subject" required className={field} {...aria("subject")} /><Err k="subject" /></div>
      </div>
      <div><label htmlFor="message" className="text-sm font-semibold">Message <span aria-hidden className="text-accent">*</span></label><textarea id="message" name="message" rows={5} maxLength={2000} required className={field} {...aria("message")} /><Err k="message" /></div>
      <details className="rounded-xl border border-line p-4">
        <summary className="cursor-pointer text-sm font-semibold">Optional: automation project details</summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="business" className="text-sm">Business or team</label><input id="business" name="business" className={field} /></div>
          <div><label htmlFor="tools" className="text-sm">Tools currently used</label><input id="tools" name="tools" className={field} /></div>
          <div><label htmlFor="process" className="text-sm">Process to improve</label><textarea id="process" name="process" rows={2} className={field} /></div>
          <div><label htmlFor="outcome" className="text-sm">Desired outcome</label><textarea id="outcome" name="outcome" rows={2} className={field} /></div>
        </div>
      </details>
      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}
      <div aria-live="polite">{state === "failed" && <p role="alert" className="rounded-lg border border-bad/60 bg-bad/10 p-3 text-sm">{serverMsg}</p>}</div>
      <button type="submit" className="btn-primary" disabled={state === "sending"}>{state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</> : <><Send className="h-4 w-4" aria-hidden /> Send inquiry</>}</button>
      <p className="text-xs text-muted">Your message is emailed to me via Resend and not stored on this site.</p>
    </form>
  );
}
