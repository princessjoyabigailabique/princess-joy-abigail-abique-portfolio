export type CredType =
  | "Certification"
  | "Course completion"
  | "Virtual experience"
  | "Assessment"
  | "Academic award"
  | "Hands-on activity";

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  type: CredType;
  category: "Cybersecurity" | "Cloud" | "Networking" | "IT Foundations" | "AI & Automation" | "Academic";
  skills: string[];
  /** "verified" only after you confirm exact title/issuer/date from the real credential. */
  status: "verified" | "draft";
  issueDate?: string; // e.g. "2025-06"
  verifyUrl?: string;
  imageUrl?: string; // /images/certs/....
  note?: string;
}

/**
 * IMPORTANT: Entries below were mentioned during planning. None has an issue date,
 * credential ID, verification URL or image yet — so all are "draft".
 * To publish one: confirm exact title/issuer/type, add date (+ verifyUrl/imageUrl if you have them),
 * then change status to "verified". Delete entries you cannot support.
 */
export const CREDENTIALS: Credential[] = [
  {
    id: "security-monitoring-siem",
    title: "Security Monitoring and SIEM Fundamentals",
    issuer: "LinkedIn Learning",
    type: "Course completion",
    category: "Cybersecurity",
    skills: ["SIEM", "Security monitoring"],
    status: "draft",
    note: "Confirm exact title and completion date from the certificate.",
  },
  {
    id: "azure-essentials",
    title: "Microsoft Azure Essentials Professional Certificate",
    issuer: "LinkedIn Learning / Microsoft",
    type: "Certification",
    category: "Cloud",
    skills: ["Azure", "Cloud fundamentals"],
    status: "draft",
    note: "Use the exact issuer and title on the real credential; confirm whether it is a certificate or course completion.",
  },
  {
    id: "intro-cybersecurity-cisco",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    type: "Course completion",
    category: "Cybersecurity",
    skills: ["Cybersecurity basics"],
    status: "draft",
    note: "Confirm whether a Credly badge exists before adding a verification link.",
  },
  {
    id: "it-foundations-ibm",
    title: "IT Foundations",
    issuer: "IBM",
    type: "Course completion",
    category: "IT Foundations",
    skills: ["IT fundamentals"],
    status: "draft",
  },
  {
    id: "mastercard-forage",
    title: "Cybersecurity Virtual Experience",
    issuer: "Forage / Mastercard",
    type: "Virtual experience",
    category: "Cybersecurity",
    skills: ["Security awareness", "Phishing"],
    status: "draft",
    note: "A virtual experience program, not a professional certification.",
  },
  {
    id: "packet-tracer-activity",
    title: "Cisco Packet Tracer Activity — device setup",
    issuer: "Cisco Networking Academy",
    type: "Hands-on activity",
    category: "Networking",
    skills: ["Packet Tracer", "Cabling", "Hostname configuration"],
    status: "draft",
    note: "Completed hands-on activity (confirmed). Not a certification. Add date/screenshot when available.",
  },
  {
    id: "tryhackme-pre-security",
    title: "TryHackMe Pre Security",
    issuer: "TryHackMe",
    type: "Course completion",
    category: "Cybersecurity",
    skills: ["Cybersecurity basics", "Linux", "Networking"],
    status: "draft",
    note: "Learning path completed (confirmed). Add profile/certificate link when available.",
  },
];
