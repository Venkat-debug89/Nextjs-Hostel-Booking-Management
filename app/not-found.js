import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="auth-main"><section className="auth-form"><SearchX size={34} color="#245f86"/><span className="eyebrow-small">404 · Page not found</span><h2>We couldn’t find that page.</h2><p>The address may have changed, or the page may no longer be available.</p><Link className="button button-primary" href="/">Return to HostelHub</Link></section></main>;
}
