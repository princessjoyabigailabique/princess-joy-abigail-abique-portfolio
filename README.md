# Princess Joy Abigail Abique — Portfolio

Next.js 15.5 (App Router) · TypeScript · Tailwind CSS 3 · Lucide icons · Zod · fonts self-hosted via Fontsource. Targets Vercel (Node >= 20).

## Quick start
```bash
npm install
cp .env.example .env.local     # fill in what you have
npm run dev                    # http://localhost:3000
npm run preflight              # lists every missing env var / file / credential
npm run typecheck && npm test && npm run build
```
Development shows owner hints (e.g. "add the PDF to /public/resumes"). **Production builds show plain visitor-facing wording** and hide unfinished sections (see "Dev vs production").

## Where to edit
| What | File |
|---|---|
| Nav, resume file names, Calendly validation | `src/data/site.ts` |
| Contact links (LinkedIn, email, Viber, OnlineJobs, TryHackMe, Calendly) | env vars (`.env.local` / Vercel) |
| Project statuses & descriptions (used site-wide) | `src/data/projects.ts` |
| Credentials (every entry starts as `draft`) | `src/data/credentials.ts` |
| Simulated data (SOC alerts, tickets, workflow samples) | `src/data/soc.ts`, `tickets.ts`, `workflow.ts` |

Resume PDFs and the portrait are **detected automatically** from the file system at build time (no flags to flip).

## Remaining setup (what only you can supply)
1. **Portrait** → `public/images/portrait.jpg` (your own photo; never a stand-in).
2. **Resumes** → `public/resumes/Abigail-Abique-AI-Automation-Resume.pdf` and `public/resumes/Abigail-Abique-Cybersecurity-Resume.pdf`.
3. **Links (env vars):** `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_EMAIL_ADDRESS`, `NEXT_PUBLIC_VIBER_URL`, `NEXT_PUBLIC_ONLINEJOBS_URL`, `NEXT_PUBLIC_TRYHACKME_URL`, `NEXT_PUBLIC_SITE_URL` (your https domain).
4. **Calendly** (below) → `NEXT_PUBLIC_CALENDLY_URL` (must be an `https://calendly.com/...` link or it is refused).
5. **Contact form** (Resend, below).
6. **Credentials:** for each real one confirm exact title, issuer, type and date; add `issueDate`, `verifyUrl`, `imageUrl` (`public/images/certs/`) if you have them; set `status: "verified"`; delete any you cannot support.
7. **Facts to confirm:** tech stack and your contribution for ITRACKIT, DOUGH DELIGHT CAFE POS and ExamEase; "Philippines" location and "open to internship opportunities" wording; the personal "A little more about me" content (section is hidden in production until you write it — edit `src/components/Collapsible.tsx`).

## Contact form (Resend)
1. Create a Resend account, verify a sending domain, create an API key.
2. Set server-only vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (sender on the verified domain). Never prefix with `NEXT_PUBLIC_`.
3. Optional spam check: Cloudflare Turnstile — set **both** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` (a secret alone blocks every submission; preflight warns about this).

Behaviour: success is shown **only** when Resend returns 2xx. Missing config → HTTP 503 "not sent"; Resend/network failure → 502 "not delivered". Protections: server-side Zod validation, honeypot, same-origin check, 10 KB body cap, CR/LF stripped from header fields, HTML-escaped body, in-memory rate limit (5 / 10 min / IP per server instance — add Upstash/Vercel KV for stronger limits), 8–10 s upstream timeouts, no visitor content or keys in logs. Data flow: browser → `/api/contact` → Resend → your inbox; nothing is stored by the site. Mention Resend in a privacy notice if you add one.

## Calendly
1. Create an event type (e.g. "Discovery Call"): duration, availability, timezone.
2. Connect your calendar. Under **Location**, connect Google Meet and/or Zoom and add them; adding several lets invitees choose (available choices depend on your Calendly plan/integrations).
3. Add booking questions (process, tools, desired outcome) and confirmation/reminder emails.
4. Set `NEXT_PUBLIC_CALENDLY_URL`. The page embeds it and always shows a new-tab fallback link. A booking is real only when Calendly confirms it.

## Dev vs production
| Item | Development | Production build |
|---|---|---|
| Draft credentials | shown with a draft banner | **hidden** → "Verified credentials are being added" (override for private previews with `NEXT_PUBLIC_SHOW_DRAFT_CREDENTIALS=true`) |
| Missing resume / Calendly / link | owner hint | plain visitor message; no env names or paths |
| Personal "outside the tech" section | placeholder | hidden until written |
| Portrait | placeholder with path hint | placeholder without path hint (until you add the photo) |

## Deploy to Vercel
1. Push to GitHub (`.env*` is git-ignored; never commit secrets). 2. Vercel → Add New Project → import the repo (Next.js auto-detected).
3. Add every variable from `.env.example` under Settings → Environment Variables (Production; add to Preview too if you test there).
4. Deploy. 5. Set `NEXT_PUBLIC_SITE_URL` to the final https domain and redeploy (canonical URLs, sitemap, robots, Open Graph use it). 6. Add the custom domain if you have one.
7. Run the checklist below on the live URL.

## Pre-deployment checklist
- [ ] `npm run preflight` shows no MISSING you care about
- [ ] Portrait + both resume PDFs added; View and Download work on the live site
- [ ] All profile links set and each opens the right profile
- [ ] Resend configured; send a real test inquiry on the live site and confirm it reaches your inbox (also test with the key removed to see the honest "not sent" state)
- [ ] Calendly URL set; book a test slot, confirm Google Meet / Zoom choice and the confirmation email, then cancel it
- [ ] Credentials verified one by one (or left hidden); no placeholder shown as real
- [ ] Project statuses re-read against reality in `src/data/projects.ts`
- [ ] `NEXT_PUBLIC_SITE_URL` is your https domain; share the URL in a link previewer to check the social card
- [ ] Look at every page at phone, tablet and desktop widths in your own browser; run Lighthouse; do a quick screen-reader pass
- [ ] `npm audit --omit=dev` is clean (it is as of this build)

## Honesty rules built in
Simulations (SOC lab, workflow demos, support tickets, topology/ping) are labelled **simulated**, use fictional data and run only in the browser. Learning goals (Intune, Entra ID, patching, Microsoft 365, Windows troubleshooting, command line) are labelled "Learning goal". Nothing about metrics, clients, credential IDs or profile URLs is invented.

## Known limits
- Rate limiting is per server instance (serverless may reset it).
- No Content-Security-Policy header yet (Next.js inline scripts and the Calendly/Turnstile embeds need a tuned policy; add after testing on your real domain).
- No analytics, cookie banner or privacy page; add if your integrations/regulations require them.
- `npm audit` (including dev tools) still reports dev-only advisories in Tailwind 3's build-time dependencies; they do not ship to visitors.
