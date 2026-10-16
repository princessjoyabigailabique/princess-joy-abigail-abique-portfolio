const tools = ["n8n", "Google Sheets", "Gmail", "OpenAI API", "Telegram", "Webhooks", "Next.js", "TypeScript", "Prisma", "Auth.js"];

export default function ToolsMarquee() {
  return (
      <div className="group overflow-hidden rounded-2xl border border-line bg-surface/60 py-4">
        <div className="flex w-max motion-safe:animate-[tools-marquee-right_36s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused] motion-safe:group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} aria-label={copy === 0 ? "Tools I work with" : undefined} className="flex shrink-0 gap-3 pr-3">
              {tools.map((tool) => <li key={tool} className="rounded-full border border-accent/25 bg-surface2/75 px-4 py-2 text-sm font-medium text-ink">{tool}</li>)}
            </ul>
          ))}
        </div>
      </div>
  );
}
