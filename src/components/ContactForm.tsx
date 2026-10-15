"use client";
import { useRef, useState } from "react";
import Script from "next/script";
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import { contactSchema, INQUIRY_TYPES } from "@/lib/contact-schema";

type Errors = Record<string, string[] | undefined>;
type Values = { name: string; email: string; inquiryType: string; subject: string; message: string; business: string; tools: string; process: string; outcome: string };
const EMPTY: Values = { name: "", email: "", inquiryType: "", subject: "", message: "", business: "", tools: "", process: "", outcome: "" };
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const STEPS = ["Your details", "Your message", "Review"];

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const field = "mt-1 w-full rounded-xl border border-line bg-bg/70 px-3 py-2.5 text-sm transition focus:border-accent focus:ring-2 focus:ring-accent/20";
  const update = (key: keyof Values, value: string) => { setValues((v) => ({ ...v, [key]: value })); setErrors((e) => ({ ...e, [key]: undefined })); };
  const err = (key: keyof Values) => errors[key]?.[0] ? <p id={`${key}-err`} className="mt-1 text-xs text-bad" role="alert">{errors[key]![0]}</p> : null;
  const aria = (key: keyof Values) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `${key}-err` : undefined });
  const input = (key: keyof Values, props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} id={key} name={key} value={values[key]} onChange={(e) => update(key, e.target.value)} className={field} {...aria(key)} />;
  const textarea = (key: keyof Values, props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} id={key} name={key} value={values[key]} onChange={(e) => update(key, e.target.value)} className={field} {...aria(key)} />;

  function validate(keys: (keyof Values)[]) {
    const next: Errors = {};
    for (const key of keys) {
      const result = contactSchema.shape[key].safeParse(values[key]);
      if (!result.success) next[key] = result.error.issues.map((issue) => issue.message);
    }
    setErrors(next);
    const first = keys.find((key) => next[key]);
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
    return !first;
  }

  function nextStep() {
    const keys: (keyof Values)[] = step === 0 ? ["name", "email", "inquiryType", "subject"] : ["message"];
    if (validate(keys)) setStep((s) => s + 1);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 2) { nextStep(); return; }
    const formData = new FormData(e.currentTarget);
    const payload = { ...values, website: String(formData.get("website") ?? ""), turnstileToken: String(formData.get("cf-turnstile-response") ?? "") };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(fe);
      const first = Object.keys(fe)[0];
      requestAnimationFrame(() => { setStep(first === "message" ? 1 : 0); document.getElementById(first)?.focus(); });
      return;
    }
    setErrors({}); setState("sending"); setServerMsg("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) { setState("sent"); setValues(EMPTY); setStep(0); formRef.current?.reset(); return; }
      if (json.errors) setErrors(json.errors);
      setServerMsg(json.error || "Something went wrong. Please try again."); setState("failed");
    } catch { setServerMsg("Network error. Check your connection and try again."); setState("failed"); }
  }

  if (state === "sent") return <div role="status" className="rounded-2xl border border-good/40 bg-good/10 p-6"><span className="grid h-10 w-10 place-items-center rounded-full bg-good/15 text-good"><Check size={20} /></span><p className="mt-3 font-semibold">Message sent</p><p className="mt-1 text-sm text-muted">Thanks — your message was delivered. This was an inquiry, not a booked meeting; to schedule a call use the booking section below.</p><button className="btn-ghost mt-4" onClick={() => { setState("idle"); setStep(0); }}>Send another</button></div>;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="contact-flow">
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer strategy="lazyOnload" />}
      <ol className="contact-steps" aria-label="Message form progress">{STEPS.map((label, i) => <li key={label} className={i === step ? "current" : i < step ? "complete" : ""}><span>{i < step ? <Check size={14} aria-hidden /> : `0${i + 1}`}</span>{label}</li>)}</ol>
      {step === 0 && <fieldset className="grid gap-4 sm:grid-cols-2" aria-labelledby="contact-step-one"><legend id="contact-step-one" className="sr-only">Your details</legend>
        <div><label htmlFor="name" className="text-sm font-semibold">Full name <span className="text-accent">*</span></label>{input("name", { autoComplete: "name", required: true })}{err("name")}</div>
        <div><label htmlFor="email" className="text-sm font-semibold">Email address <span className="text-accent">*</span></label>{input("email", { type: "email", autoComplete: "email", required: true })}{err("email")}</div>
        <div><label htmlFor="inquiryType" className="text-sm font-semibold">Inquiry type <span className="text-accent">*</span></label><select id="inquiryType" name="inquiryType" value={values.inquiryType} onChange={(e) => update("inquiryType", e.target.value)} required className={field} {...aria("inquiryType")}><option value="">Select an option…</option>{INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>{err("inquiryType")}</div>
        <div><label htmlFor="subject" className="text-sm font-semibold">Subject <span className="text-accent">*</span></label>{input("subject", { required: true, maxLength: 150 })}{err("subject")}</div>
      </fieldset>}
      {step === 1 && <div className="space-y-4">
        <div><label htmlFor="message" className="text-sm font-semibold">Message <span className="text-accent">*</span></label>{textarea("message", { rows: 5, maxLength: 2000, required: true, placeholder: "Tell me what you have in mind…" })}<div className="mt-1 flex justify-between text-xs text-muted">{err("message")}<span>{values.message.length}/2000</span></div></div>
        <details className="rounded-xl border border-line p-4"><summary className="cursor-pointer text-sm font-semibold">Optional: automation project details</summary><div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="business" className="text-sm">Business or team</label>{input("business", { maxLength: 150 })}{err("business")}</div>
          <div><label htmlFor="tools" className="text-sm">Tools currently used</label>{input("tools", { maxLength: 300 })}{err("tools")}</div>
          <div><label htmlFor="process" className="text-sm">Process to improve</label>{textarea("process", { rows: 2, maxLength: 500 })}{err("process")}</div>
          <div><label htmlFor="outcome" className="text-sm">Desired outcome</label>{textarea("outcome", { rows: 2, maxLength: 500 })}{err("outcome")}</div>
        </div></details>
      </div>}
      {step === 2 && <section className="rounded-2xl border border-line bg-surface/40 p-4 sm:p-5" aria-labelledby="review-title"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="kicker">Final check</p><h3 id="review-title" className="text-lg font-bold">Review your message</h3></div><button type="button" onClick={() => setStep(0)} className="btn-ghost !px-3 !py-2 text-xs">Edit details</button></div><dl className="review-grid mt-4"><div><dt>Name</dt><dd>{values.name}</dd></div><div><dt>Email</dt><dd>{values.email}</dd></div><div><dt>Inquiry</dt><dd>{values.inquiryType}</dd></div><div><dt>Subject</dt><dd>{values.subject}</dd></div><div className="review-message"><dt>Message</dt><dd>{values.message}</dd></div>{(["business", "tools", "process", "outcome"] as const).filter((key) => values[key].trim()).map((key) => <div key={key}><dt>{({ business: "Business or team", tools: "Tools", process: "Process", outcome: "Desired outcome" })[key]}</dt><dd>{values[key]}</dd></div>)}</dl></section>}
      {siteKey && <div className="mt-4"><div className="cf-turnstile" data-sitekey={siteKey} /></div>}
      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div aria-live="polite">{state === "failed" && <p role="alert" className="mt-4 rounded-lg border border-bad/60 bg-bad/10 p-3 text-sm">{serverMsg}</p>}</div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted">Your message is emailed to me via Resend and not stored on this site.</p><div className="flex gap-2">{step > 0 && <button type="button" className="btn-ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft size={15} /> Back</button>}{step < 2 ? <button type="button" className="btn-primary" onClick={nextStep}>Continue <ArrowRight size={15} /></button> : <button type="submit" className="btn-primary" disabled={state === "sending"}>{state === "sending" ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={15} /> Send inquiry</>}</button>}</div></div>
    </form>
  );
}
