// Run: npm run preflight   — reports what is still missing before deployment. Never prints secret values.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
for (const f of [".env.local", ".env"]) {
  if (fs.existsSync(f)) for (const l of fs.readFileSync(f, "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const set = (k) => !!process.env[k];
const file = (p) => fs.existsSync(path.join("public", p));
const rows = [];
const add = (level, msg) => rows.push([level, msg]);
for (const [k, why] of [["NEXT_PUBLIC_SITE_URL", "canonical URLs, sitemap, social previews"], ["NEXT_PUBLIC_CALENDLY_URL", "discovery-call booking"], ["NEXT_PUBLIC_LINKEDIN_URL", "LinkedIn card"], ["NEXT_PUBLIC_EMAIL_ADDRESS", "Gmail card"], ["NEXT_PUBLIC_VIBER_URL", "Viber card"], ["NEXT_PUBLIC_ONLINEJOBS_URL", "OnlineJobs.ph card"], ["NEXT_PUBLIC_TRYHACKME_URL", "TryHackMe profile button"], ["RESEND_API_KEY", "contact form delivery"], ["CONTACT_TO_EMAIL", "contact form destination"], ["CONTACT_FROM_EMAIL", "contact form sender (verified in Resend)"]])
  add(set(k) ? "ok" : "MISSING", `${k} — ${why}`);
if (set("NEXT_PUBLIC_SITE_URL") && !process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://")) add("WARN", "NEXT_PUBLIC_SITE_URL should start with https:// in production");
if (set("NEXT_PUBLIC_CALENDLY_URL") && !/^https:\/\/(www\.)?calendly\.com\//.test(process.env.NEXT_PUBLIC_CALENDLY_URL)) add("WARN", "NEXT_PUBLIC_CALENDLY_URL is not an https://calendly.com/ link; it will not be embedded");
if (set("TURNSTILE_SECRET_KEY") !== set("NEXT_PUBLIC_TURNSTILE_SITE_KEY")) add("WARN", "Turnstile needs BOTH NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY (a secret without a site key blocks every submission)");
if (set("NEXT_PUBLIC_SHOW_DRAFT_CREDENTIALS") && process.env.NEXT_PUBLIC_SHOW_DRAFT_CREDENTIALS === "true") add("WARN", "NEXT_PUBLIC_SHOW_DRAFT_CREDENTIALS=true — draft credentials will be PUBLIC");
for (const p of ["images/portrait.jpg", "resumes/Abigail-Abique-AI-Automation-Resume.pdf", "resumes/Abigail-Abique-Cybersecurity-Resume.pdf"]) add(file(p) ? "ok" : "MISSING", `public/${p}`);
const creds = fs.readFileSync("src/data/credentials.ts", "utf8");
const draft = (creds.match(/status: "draft",/g) || []).length, ver = (creds.match(/status: "verified",/g) || []).length;
add(ver ? "ok" : "MISSING", `credentials: ${ver} verified, ${draft} draft (drafts are hidden in production)`);
let missing = 0;
for (const [l, m] of rows) { if (l !== "ok") missing++; console.log(`${l.padEnd(8)} ${m}`); }
console.log(`\n${missing} item(s) need attention. The site still builds; unconfigured items show honest "not connected" states.`);
