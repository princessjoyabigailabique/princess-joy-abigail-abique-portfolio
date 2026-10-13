import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 10_000; // bytes
const RESEND_URL = "https://api.resend.com/emails";

// Small in-memory rate limit (per server instance). For stricter limits use Upstash / Vercel KV.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory
  return recent.length > 5;
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
// Remove CR/LF and other control characters from values placed in email headers/subject.
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
const fail = (status: number, code: string, error: string) => NextResponse.json({ ok: false, code, error }, { status });

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return fail(503, "not_configured", "The contact form isn’t set up yet, so your message was not sent.");
  }

  // Same-origin check: browsers send Origin on cross-site POSTs.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin) {
    let ok = false;
    try { ok = new URL(origin).host === host; } catch {}
    if (!ok) return fail(403, "forbidden", "Request rejected.");
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return fail(429, "rate_limited", "Too many messages. Please try again in a few minutes.");

  const raw = await req.text().catch(() => "");
  if (raw.length > MAX_BODY) return fail(413, "too_large", "Message is too large.");
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return fail(400, "bad_request", "Invalid request."); }

  // Honeypot filled => silently pretend success without sending.
  if (body && typeof body === "object" && (body as { website?: unknown }).website) return NextResponse.json({ ok: true });

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "validation", error: "Please fix the highlighted fields.", errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;

  // Optional Cloudflare Turnstile — fails closed when a secret is configured.
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: d.turnstileToken ?? "", remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    }).then((x) => x.json()).catch(() => ({ success: false }));
    if (!r.success) return fail(400, "captcha", "Spam check failed. Please reload and try again.");
  }

  const extra = [["Business / team", d.business], ["Process to improve", d.process], ["Tools used", d.tools], ["Desired outcome", d.outcome]].filter(([, v]) => v);
  const html = `<h2>New portfolio inquiry</h2><p><b>Name:</b> ${esc(d.name)}<br><b>Email:</b> ${esc(d.email)}<br><b>Type:</b> ${esc(d.inquiryType)}</p><p><b>Subject:</b> ${esc(d.subject)}</p><p>${esc(d.message).replace(/\n/g, "<br>")}</p>${extra.map(([k, v]) => `<p><b>${k}:</b> ${esc(v as string)}</p>`).join("")}`;

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: oneLine(d.email), subject: oneLine(`[Portfolio] ${d.inquiryType}: ${d.subject}`).slice(0, 200), html }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  // Success is reported ONLY when Resend confirms acceptance (2xx).
  if (!res || !res.ok) {
    console.error("Contact delivery failed; resend status:", res?.status ?? "network_error"); // never log visitor content
    return fail(502, "delivery_failed", "Your message could not be delivered. Please try again or use another contact channel.");
  }
  return NextResponse.json({ ok: true });
}
