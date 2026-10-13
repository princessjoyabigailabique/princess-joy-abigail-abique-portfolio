import { User } from "lucide-react";
import { PORTRAIT } from "@/data/site";
import { publicFileExists } from "@/lib/files";

export default function Portrait({ className = "h-64 w-48" }: { className?: string }) {
  if (publicFileExists(PORTRAIT.src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={PORTRAIT.src} alt={PORTRAIT.alt} className={`${className} rounded-2xl border border-accent/50 object-cover shadow-neon`} />;
  }
  return (
    <div
      role="img"
      aria-label="Portrait placeholder — my photo has not been added yet"
      className={`${className} flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-accent/60 bg-surface2/70 text-center text-xs text-muted`}
    >
      <User className="h-10 w-10 text-accent" aria-hidden />
      <span className="px-3">Portrait placeholder{process.env.NODE_ENV !== "production" && <><br />(add /public/images/portrait.jpg)</>}</span>
    </div>
  );
}
