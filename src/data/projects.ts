export type Status =
  | "completed"
  | "in-progress"
  | "prototype"
  | "simulated"
  | "planned"
  | "academic"
  | "placeholder";

export const STATUS_LABEL: Record<Status, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  prototype: "Prototype",
  simulated: "Simulated",
  planned: "Planned",
  academic: "Academic project",
  placeholder: "Placeholder",
};

export type Area = "cybersecurity" | "ai-automation" | "networking" | "it-support";

export interface Project {
  slug: string;
  title: string;
  area: Area | "academic";
  status: Status;
  summary: string;
  tools: string[];
  /** Plain statements that are confirmed. */
  confirmed: string[];
  /** Honest limits / what is not claimed. */
  limitations: string[];
  href: string;
}

/** Single source of truth for project statuses. Update here and every page updates. */
export const PROJECTS: Project[] = [
  {
    slug: "security-lab-simulated",
    title: "Security Lab (Simulated)",
    area: "cybersecurity",
    status: "simulated",
    summary: "An interactive browser-only alert triage workspace for filtering fictional security events and inspecting sample evidence.",
    tools: ["SIEM concepts", "Log analysis", "MITRE ATT&CK", "KQL"],
    confirmed: ["Built as an interactive portfolio learning simulation.", "Includes sample event filters, evidence context and example queries."],
    limitations: ["Uses fictional events and does not connect to a SIEM or represent real security activity."],
    href: "/cybersecurity#lab-h",
  },
  {
    slug: "support-ticket-simulation",
    title: "IT Support Ticket Simulation",
    area: "it-support",
    status: "simulated",
    summary: "A fictional helpdesk ticket that visitors can troubleshoot step by step and resolve with a documented outcome.",
    tools: ["Troubleshooting", "Service desk", "Documentation"],
    confirmed: ["Built as an interactive portfolio learning simulation with sample tickets."],
    limitations: ["The tickets and troubleshooting environment are fictional; no support system is connected."],
    href: "/it-support#ticket",
  },
  {
    slug: "ai-email-operations-assistant",
    title: "AI Email Operations Assistant",
    area: "ai-automation",
    status: "in-progress",
    summary:
      "An n8n workflow that classifies and prioritizes incoming email, tracks tasks and follow-ups in Google Sheets, and notifies me on Telegram. AI output is a suggestion for human review.",
    tools: ["n8n", "Gmail", "OpenAI API", "Google Sheets", "Telegram"],
    confirmed: [
      "Built with n8n, Gmail, OpenAI API, Google Sheets and Telegram.",
      "Classifies emails by category and priority; AI-generated replies are suggestions that a human reviews.",
    ],
    limitations: [
      "Still in progress. No time-saved or accuracy numbers are claimed.",
      "The website demo is a browser-only simulation with sample data, not a live n8n execution.",
    ],
    href: "/ai-automation#email-assistant",
  },
  {
    slug: "securedesk-ai",
    title: "SecureDesk AI",
    area: "ai-automation",
    status: "prototype",
    summary:
      "An AI-assisted helpdesk prototype concept that classifies support issues using an OpenAI API integration.",
    tools: ["Next.js", "TypeScript", "Prisma", "Auth.js", "OpenAI API"],
    confirmed: ["Prototype built with Next.js, TypeScript, Prisma and Auth.js."],
    limitations: [
      "AI-assisted prototype — it is not presented as fully hand-engineered by me.",
      "No production deployment is claimed.",
    ],
    href: "/ai-automation#securedesk",
  },
  {
    slug: "itrackit",
    title: "ITRACKIT — Unified Attendance and Access Control System",
    area: "academic",
    status: "academic",
    summary:
      "Academic project. I served as Project Coordinator & Team Lead. The team received the Best Group Award on March 14, 2025.",
    tools: [],
    confirmed: ["Role: Project Coordinator & Team Lead.", "Best Group Award — March 14, 2025."],
    limitations: ["Technology details are not listed here yet."],
    href: "/about#academic",
  },
  {
    slug: "dough-delight-pos",
    title: "DOUGH DELIGHT CAFE POS System",
    area: "academic",
    status: "academic",
    summary: "Academic point-of-sale project.",
    tools: [],
    confirmed: ["Academic project."],
    limitations: ["Technology details and my specific contribution are not listed here yet."],
    href: "/about#academic",
  },
  {
    slug: "examease",
    title: "ExamEase — Centralized Medical Records Platform",
    area: "academic",
    status: "academic",
    summary: "Academic project on a centralized medical records platform.",
    tools: [],
    confirmed: ["Academic project."],
    limitations: ["Technology details and my specific contribution are not listed here yet."],
    href: "/about#academic",
  },
  {
    slug: "packet-tracer-device-setup",
    title: "Cisco Packet Tracer — Device Setup Activity",
    area: "networking",
    status: "completed",
    summary:
      "Connected devices using different cables, installed a backup router, and configured a hostname on a networking device.",
    tools: ["Cisco Packet Tracer"],
    confirmed: [
      "Connected devices using different cable types.",
      "Installed a backup router.",
      "Configured a device hostname.",
    ],
    limitations: ["Screenshots and a write-up are not published yet. No other network configurations are claimed."],
    href: "/networking#labs",
  },
];

export const AREAS: {
  id: Area;
  num: string;
  label: string;
  href: string;
  blurb: string;
  topics: string[];
  focus: string;
  focusStatus: Status;
}[] = [
  {
    id: "cybersecurity",
    num: "01",
    label: "Cybersecurity",
    href: "/cybersecurity",
    blurb:
      "Learning security monitoring, SIEM fundamentals, log analysis and threat analysis through TryHackMe paths.",
    topics: ["SIEM", "Log Analysis", "Threat Analysis", "MITRE ATT&CK", "KQL"],
    focus: "TryHackMe SOC Level 1",
    focusStatus: "in-progress",
  },
  {
    id: "ai-automation",
    num: "02",
    label: "AI & Automation",
    href: "/ai-automation",
    blurb: "Building n8n workflows that connect tools, route decisions and keep a human in the review loop.",
    topics: ["n8n", "OpenAI API", "Google Sheets", "Gmail", "Telegram"],
    focus: "AI Email Operations Assistant",
    focusStatus: "in-progress",
  },
  {
    id: "networking",
    num: "03",
    label: "Networking",
    href: "/networking",
    blurb: "Studying network fundamentals and practising device setup in Cisco Packet Tracer.",
    topics: ["TCP/IP", "IP addressing", "Subnetting", "Routing & switching", "Packet Tracer"],
    focus: "Packet Tracer device setup",
    focusStatus: "completed",
  },
  {
    id: "it-support",
    num: "04",
    label: "IT Support / System",
    href: "/it-support",
    blurb:
      "Practising structured troubleshooting and documentation, and learning endpoint and identity tools.",
    topics: ["Troubleshooting", "Documentation", "Windows", "Command line", "Service desk"],
    focus: "Structured troubleshooting practice",
    focusStatus: "simulated",
  },
];
