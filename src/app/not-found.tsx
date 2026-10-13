import { LinkButton } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-muted">That page doesn’t exist. Use the navigation or go back home.</p>
      <div className="mt-6"><LinkButton href="/">Back to home</LinkButton></div>
    </div>
  );
}
