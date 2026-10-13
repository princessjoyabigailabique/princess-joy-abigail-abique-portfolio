import type { Metadata } from "next";
import CredentialBrowser from "@/components/CredentialBrowser";
export const metadata: Metadata = { title: "Certifications", description: "Searchable list of courses, certifications, virtual experiences and hands-on activities, with clear verification status.", alternates: { canonical: "/certifications" } };
export default function Page() {
  return (
    <section className="container-page py-12">
      <p className="kicker">Certifications & achievements</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Credentials and learning activities</h1>
      <p className="mb-6 mt-2 max-w-2xl text-muted">Certifications, course completions, virtual experiences and hands-on activities are kept distinct. Verification links and images appear only when I have the real ones.</p>
      <CredentialBrowser />
    </section>
  );
}
