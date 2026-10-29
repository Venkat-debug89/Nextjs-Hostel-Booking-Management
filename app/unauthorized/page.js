import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return <main className="auth-main"><section className="auth-form"><ShieldAlert size={34} color="#a66a18"/><span className="eyebrow-small">Access restricted</span><h2>This portal is for another role.</h2><p>Sign in with an account that has access to this area, or return to the HostelHub home page.</p><div className="hero-actions"><Link className="button button-primary" href="/login">Go to sign in</Link><Link className="button button-secondary" href="/">Home</Link></div></section></main>;
}
