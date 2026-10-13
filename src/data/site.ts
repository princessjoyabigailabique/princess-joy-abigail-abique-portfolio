/**
 * Central site configuration.
 * Contact links come ONLY from environment variables — nothing is invented.
 * Empty value => the UI shows an honest "Not connected yet" state.
 */
export const SITE = {
  name: "Princess Joy Abigail Abique",
  shortName: "Abigail",
  title: "Princess Joy Abigail Abique — IT Student Portfolio",
  description:
    "Portfolio of Princess Joy Abigail Abique, a fourth-year BSIT student exploring cybersecurity, AI & automation, networking, and IT support through hands-on projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  location: "Manila, Philippines",
};

export const LINKS = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  email: process.env.NEXT_PUBLIC_EMAIL_ADDRESS || "",
  viber: process.env.NEXT_PUBLIC_VIBER_URL || "",
  onlinejobs: process.env.NEXT_PUBLIC_ONLINEJOBS_URL || "",
  tryhackme: process.env.NEXT_PUBLIC_TRYHACKME_URL || "",
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Cybersecurity", href: "/cybersecurity" },
  { label: "AI & Automation", href: "/ai-automation" },
  { label: "Networking", href: "/networking" },
  { label: "IT Support / System", href: "/it-support" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact me", href: "/contact" },
] as const;

/** Resume files. Drop real PDFs at these paths in /public/resumes. */
export const RESUMES = [
  {
    id: "ai-automation",
    title: "AI & Automation Resume",
    blurb:
      "Focuses on n8n workflows, integrations (Google Sheets, Gmail, OpenAI API, Telegram), technical documentation, and related tools.",
    file: "/resumes/Abigail-Abique-AI-Automation-Resume.pdf",
    downloadName: "Abigail-Abique-AI-Automation-Resume.pdf",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Resume",
    blurb:
      "Focuses on security learning, SIEM concepts, cybersecurity courses, relevant tools, and verified security labs.",
    file: "/resumes/Abigail-Abique-Cybersecurity-Resume.pdf",
    downloadName: "Abigail-Abique-Cybersecurity-Resume.pdf",
  },
] as const;

/** Portrait. Shown automatically when /public/images/portrait.jpg exists (your own photo). */
export const PORTRAIT = { src: "/images/portrait.jpg", alt: "Portrait of Princess Joy Abigail Abique" };

/** Calendly URLs are only accepted if they are https links on calendly.com. */
export function validCalendlyUrl(u: string): boolean {
  try {
    const x = new URL(u);
    return x.protocol === "https:" && (x.hostname === "calendly.com" || x.hostname === "www.calendly.com");
  } catch {
    return false;
  }
}
