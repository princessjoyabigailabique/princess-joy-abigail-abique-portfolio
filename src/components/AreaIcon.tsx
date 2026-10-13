import { Bot, Monitor, Network, ShieldCheck } from "lucide-react";
import type { Area } from "@/data/projects";
const map = { cybersecurity: ShieldCheck, "ai-automation": Bot, networking: Network, "it-support": Monitor };
export default function AreaIcon({ area, className = "h-6 w-6" }: { area: Area; className?: string }) {
  const I = map[area];
  return <I className={className} aria-hidden />;
}
