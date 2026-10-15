"use client";
import { useState } from "react";
import { BookOpen, ChevronDown, Film, Gamepad2, Heart, Palette, Sparkles, UserRound } from "lucide-react";

const HOBBIES = [
  { icon: Gamepad2, title: "My Gaming Corner", art: "gaming", text: "I enjoy Valorant—especially Sage, Miks, Gekko, and Raze—and Roblox." },
  { icon: Film, title: "Stories & Fictional Worlds", art: "movies", text: "Anime, Studio Ghibli, Marvel, and movies give me new worlds to enjoy." },
  { icon: BookOpen, title: "My Reading Shelf", art: "reading", text: "I read manhwa, manhua, Wattpad, and books, especially mystery, sci-fi, fantasy, horror, villainess, and isekai stories." },
  { icon: Palette, title: "The Creative Side", art: "cosplay", text: "I enjoy cosplay, dressing up, and the creative side of self-expression." },
  { icon: UserRound, title: "A Little About Me", art: "quiet", text: "I’m an introvert who values peaceful moments, personal space, and trusted company. I care about the people close to me and like looking out for them." },
];

export default function PersonalSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="container-page py-10 sm:py-14" aria-labelledby="personal-h">
      <div className={`outside-shell ${open ? "is-open" : ""}`}>
        <div className="outside-intro">
          <p className="kicker">Outside the Tech</p>
          <h2 id="personal-h" className="section-title mt-2">A Little More About Me</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">Beyond code, logs, and labs, here are some of the things that make me, me. They keep me inspired, balanced, and happy.</p>
          <button type="button" className="btn-ghost mt-5" aria-expanded={open} aria-controls="personal-body" onClick={() => setOpen((v) => !v)}>
            <Sparkles size={15} aria-hidden /> {open ? "Close this section" : "Get to know me"} <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>
        <div id="personal-body" className={`outside-grid-wrap ${open ? "is-open" : ""}`} aria-hidden={!open}>
          <ul className="outside-grid">
            {HOBBIES.map(({ icon: Icon, title, art, text }) => <li className={`outside-tile outside-tile-${art}`} key={title}>
              <span className="outside-art" aria-hidden><Icon size={25} strokeWidth={1.8} /></span>
              <div className="outside-tile-copy"><h3>{title}</h3><p>{text}</p></div>
            </li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
