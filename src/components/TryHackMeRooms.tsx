"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Search } from "lucide-react";
import { roomsForPerspective, type Perspective } from "@/data/tryhackme";

const PAGE_SIZE = 6;

export default function TryHackMeRooms({ perspective }: { perspective: Perspective }) {
  const rooms = roomsForPerspective(perspective);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const topics = useMemo(() => ["All topics", ...Array.from(new Set(rooms.flatMap((room) => room.topics))).sort()], [rooms]);
  const filtered = rooms.filter((room) => {
    const matchesSearch = `${room.title} ${room.topics.join(" ")}`.toLowerCase().includes(search.toLowerCase().trim());
    return matchesSearch && (topic === "All topics" || room.topics.includes(topic));
  });
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const visibleRooms = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
    setExpanded(null);
  }

  function changeTopic(value: string) {
    setTopic(value);
    setPage(1);
    setExpanded(null);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm text-muted">Completed rooms in this perspective</p><p className="mt-1 text-sm" aria-live="polite"><strong className="text-accent">{filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> shown <span className="text-muted">of {filtered.length} matching · {rooms.length} completed total</span></p></div>
        <span className="badge border-good/40 bg-good/10 text-good"><CheckCircle2 size={13} aria-hidden /> {rooms.length} completed</span>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(200px,1fr)_minmax(180px,260px)]">
        <label className="relative block"><span className="sr-only">Search completed rooms</span><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden /><input className="w-full rounded-xl border border-line bg-bg/70 py-2.5 pl-9 pr-3 text-sm transition focus:border-accent focus:ring-2 focus:ring-accent/20" type="search" value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Search room titles or topics" /></label>
        <label><span className="sr-only">Filter by topic</span><select className="w-full rounded-xl border border-line bg-bg/70 px-3 py-2.5 text-sm transition focus:border-accent focus:ring-2 focus:ring-accent/20" value={topic} onChange={(event) => changeTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      {filtered.length ? <>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visibleRooms.map((room) => {
        const isExpanded = expanded === room.url;
        return <li key={room.url} className="card card-hover flex flex-col p-4">
          <div className="flex items-start justify-between gap-3"><h3 className="font-semibold leading-snug"><a className="transition-colors hover:text-accent focus-visible:text-accent" href={room.url} target="_blank" rel="noreferrer">{room.title}<span className="sr-only"> (opens in a new tab)</span></a></h3><span className="badge shrink-0 border-good/40 bg-good/10 text-good">Completed</span></div>
          <div className="mt-3 flex flex-wrap gap-1.5">{room.topics.map((item) => <span key={item} className="chip px-2 py-1 text-[11px]">{item}</span>)}</div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 pt-3"><button type="button" className="text-xs font-medium text-muted transition-colors hover:text-accent" aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? null : room.url)}>{isExpanded ? "Hide details" : "Room details"}</button><a className="inline-flex items-center gap-1 text-xs font-semibold text-accent" href={room.url} target="_blank" rel="noreferrer">Open room <ExternalLink size={12} aria-hidden /></a></div>
          {isExpanded && <p className="mt-3 border-t border-line/60 pt-3 text-sm leading-relaxed text-muted">{room.description}</p>}
        </li>;
        })}</ul>
        {pageCount > 1 && <nav className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label={`Completed TryHackMe rooms pages for ${perspective}`}>
          <button type="button" className="btn-ghost px-3 py-2 text-sm" onClick={() => { setPage((current) => current - 1); setExpanded(null); }} disabled={page === 1} aria-label="Previous room page"><ChevronLeft size={16} aria-hidden />Previous</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" className={pageNumber === page ? "btn-primary px-3 py-2 text-sm" : "btn-ghost px-3 py-2 text-sm"} onClick={() => { setPage(pageNumber); setExpanded(null); }} aria-label={`Page ${pageNumber}`} aria-current={pageNumber === page ? "page" : undefined}>{pageNumber}</button>)}
          <span className="sr-only" aria-live="polite">Page {page} of {pageCount}</span>
          <button type="button" className="btn-ghost px-3 py-2 text-sm" onClick={() => { setPage((current) => current + 1); setExpanded(null); }} disabled={page === pageCount} aria-label="Next room page">Next<ChevronRight size={16} aria-hidden /></button>
        </nav>}
      </> : <p className="card border-dashed p-8 text-center text-sm text-muted">No completed rooms match these filters. Try another title or topic.</p>}
    </div>
  );
}
