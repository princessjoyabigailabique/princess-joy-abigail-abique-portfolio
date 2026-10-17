import { User } from "lucide-react";
import { PORTRAIT } from "@/data/site";
import { publicFileExists } from "@/lib/files";

export default function Portrait({ className = "h-64 w-48" }: { className?: string }) {
  if (publicFileExists(PORTRAIT.src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <div className={`portrait-stage ${className}`}>
        <img src={PORTRAIT.src} alt={PORTRAIT.alt} className="portrait-image rounded-2xl border border-accent/50 object-cover shadow-neon" />
        <span className="portrait-light portrait-light-one" />
        <span className="portrait-light portrait-light-two" />
        <span className="portrait-light portrait-light-three" />
        <span className="portrait-light portrait-light-four" />
      </div>
    );
  }
  return (
    <div className={`portrait-stage ${className}`}>
      <div role="img" aria-label="Portrait placeholder — my photo has not been added yet" className="portrait-placeholder flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-accent/60 bg-surface2/70 text-center text-xs text-muted">
        <User className="h-10 w-10 text-accent" aria-hidden />
        <span className="px-3">Portrait placeholder{process.env.NODE_ENV !== "production" && <><br />(add /public/images/portrait.jpg)</>}</span>
      </div>
      <span className="portrait-light portrait-light-one" />
      <span className="portrait-light portrait-light-two" />
      <span className="portrait-light portrait-light-three" />
      <span className="portrait-light portrait-light-four" />
    </div>
  );
}
