import type { Metadata } from "next";
import ResumeCard from "@/components/ResumeCard";
import { RESUMES } from "@/data/site";
import { publicFileExists } from "@/lib/files";
export const metadata: Metadata = { title: "Resume", description: "Choose the AI & Automation or Cybersecurity version of Princess Joy Abigail Abique’s resume.", alternates: { canonical: "/resume" } };
export default function Page() {
  return (
    <section className="container-page py-12">
      <p className="kicker">Resume</p>
      <h1 className="mt-1 text-4xl font-extrabold">Choose a resume</h1>
      <p className="mt-3 max-w-2xl text-muted">Two focused versions of the same resume — same person, same background, different emphasis.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">{RESUMES.map((r) => <ResumeCard key={r.id} r={r} available={publicFileExists(r.file)} />)}</div>
    </section>
  );
}
