import type { Metadata } from "next";
import CredentialBrowser from "@/components/CredentialBrowser";
export const metadata: Metadata = { title: "Certifications", description: "Searchable list of courses, certifications, virtual experiences and hands-on activities, with clear verification status.", alternates: { canonical: "/certifications" } };
export default function Page() {
  return (
    <section className="container-page py-12">
      <p className="kicker">A garden of learning</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Credentials and learning activities</h1>
      <p className="mb-6 mt-2 max-w-2xl text-muted">Credentials, course completions, virtual experiences and hands-on activities each mark a different point in my learning journey. Verification links and images appear only when I have the real ones.</p>
      <CredentialBrowser />
    </section>
  );
}
