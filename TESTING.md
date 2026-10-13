# Testing record

Legend: **Tested** = actually run in the build sandbox (headless Chromium 1194 / Playwright, Node 22). **Stand-in** = exercised against a local fake of the external service, NOT the real service. **Not tested** = needs you.

## Tested
- `tsc --noEmit` clean; `npm test` 7/7 (contact schema, Calendly URL validator); `next build` succeeds; `npm audit --omit=dev` 0 vulnerabilities.
- **All 9 routes** at 320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1536 px: no element extends past the viewport (strict check that sees through the body's hidden overflow). Found and fixed: SOC lab grid stretched to 755 px on phones; career buttons overflowed at 320 px; ticket dropdown overflow.
- Visual review of every page at desktop / tablet / mobile (contact sheets). Fixed: empty grid cell and sparse hero on Home, workflow arrows misplaced, unreadable topology on phones (now scrolls in its own container), developer notes visible to visitors.
- **Accessibility (axe-core 4.10, WCAG 2.0/2.1 A+AA + best practices):** 0 violations on all 9 pages in dark and light, plus stateful views (project dialog, SOC feedback, email sim mid-run/finished, lead sim, topology ping, ticket step, form errors) in both themes. Fixed: invalid definition list, missing h1, light-mode contrast for amber and red text, dimmed-by-opacity text, focusable scroll region.
- Keyboard: skip link first; first 14 tab stops all show a >= 2 px focus ring; career tabs respond to arrow keys; topology devices selectable with Enter and show a focus outline; native dialogs trap focus and close with Esc; invalid form submit moves focus to the first bad field with aria-invalid and linked error text; every form control has a label.
- Reduced motion: animated dashed lines stop (verified computed duration).
- Theme: default dark, toggle, persistence after reload, first visit follows OS light preference.
- Interactions: career selector, project dialogs, back/forward, Resume button, SOC lab, email and lead demos, workflow explorer, topology ping + simulated fault + device panel, ticket simulation (wrong step explained), credential search/filters/dialog/empty state, mobile menu.
- Metadata: unique title, description, one h1 and canonical on every route; sitemap and robots; 11 internal link targets resolve; no external hrefs anywhere in the unconfigured build.
- Production config: drafts hidden by default with an honest empty state; resume/Calendly/profile fallbacks show visitor wording with no env var names or file paths; personal placeholder section hidden.
- **Configured-state build (temporary test fixtures, since removed):** portrait appears; both PDFs serve 200 `application/pdf`, View opens a new tab, Download has the correct filename, and a file deleted after build falls back gracefully; Calendly embed renders for a configured URL with a fallback link; profile cards become `_blank` + `noopener noreferrer` links, Gmail is `mailto:`; TryHackMe button becomes a link.

## Stand-in only (not real services)
- Contact API against a local fake of Resend: success only on 2xx; Resend 422 and network failure → "not delivered" (UI and API); invalid input 422 with field errors; malformed JSON 400; oversize 413; cross-origin 403; honeypot never calls Resend; CR/LF removed from subject; HTML escaped; recipient comes from env; rate limit trips on the 6th request; server log contains no message text or API key.

## NOT tested — needs you
- Real Resend delivery and domain verification; Turnstile.
- Real Calendly event: availability, Google Meet / Zoom choice, confirmation emails (the embed only ran with an example URL).
- Real resume PDFs rendering in a browser PDF viewer (headless Chromium has none) and the real portrait.
- Any real profile link, credential, certificate image or verification URL.
- Screen-reader listening pass (NVDA/VoiceOver), real-device phone/tablet testing, Lighthouse, cross-browser (Firefox/Safari).
- Vercel build and live deployment (not deployed).
- Pixel-level comparison against the mockups: pages follow their layout, palette and interactions but are not pixel-matched; hero illustrations and photos in the mockups are intentionally not reproduced.
