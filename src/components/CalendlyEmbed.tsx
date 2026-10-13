"use client";
import Script from "next/script";
import { CalendarCheck, ExternalLink } from "lucide-react";
import { LINKS, validCalendlyUrl } from "@/data/site";

export default function CalendlyEmbed() {
  const url = LINKS.calendly;
  if (url && !validCalendlyUrl(url)) {
    return (
      <div role="alert" className="rounded-xl border border-dashed border-bad/60 bg-bad/10 p-6 text-sm">
        <p className="font-semibold">Online booking is unavailable</p>
        <p className="mt-1">{process.env.NODE_ENV === "production" ? "Please send an inquiry using the form above." : "Dev note: NEXT_PUBLIC_CALENDLY_URL must be an https://calendly.com/… link. Nothing is embedded until it is fixed."}</p>
      </div>
    );
  }
  if (!url) {
    return (
      <div role="status" className="rounded-xl border border-dashed border-warn/50 bg-warn/10 p-6 text-sm text-warn">
        <p className="flex items-center gap-2 font-semibold"><CalendarCheck className="h-4 w-4" aria-hidden /> Booking is not connected yet</p>
        {process.env.NODE_ENV === "production" ? (
          <p className="mt-1">Online booking isn’t available yet. Please send an inquiry using the form above and I’ll reply by email.</p>
        ) : (
          <p className="mt-1">Dev note: set <code className="font-mono">NEXT_PUBLIC_CALENDLY_URL</code> to your real Calendly event link. No slots are shown until then — this page never fakes availability.</p>
        )}
      </div>
    );
  }
  return (
    <div>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <div className="calendly-inline-widget overflow-hidden rounded-xl border border-line" data-url={`${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1`} style={{ minWidth: "280px", height: "700px" }} />
      <p className="mt-3 text-sm text-muted">Scheduler not loading? <a className="font-semibold text-accent underline" href={url} target="_blank" rel="noopener noreferrer">Open the booking page in a new tab <ExternalLink className="inline h-3 w-3" aria-hidden /></a></p>
      <p className="mt-1 text-xs text-muted">A booking is only confirmed by Calendly’s own confirmation, not by anything on this page.</p>
    </div>
  );
}
