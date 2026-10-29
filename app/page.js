import Link from "next/link";
import { ArrowRight, BedDouble, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: BedDouble, title: "Find a room that fits", text: "Browse real room details, facilities, prices, and current bed availability in one place." },
  { icon: ClipboardCheck, title: "Keep every request clear", text: "Track booking decisions, fee records, and maintenance requests from your student portal." },
  { icon: ShieldCheck, title: "A calmer admin workflow", text: "Give hostel teams one practical view for rooms, residents, requests, and follow-up." },
];

export default function Home() {
  return (
    <main className="public-page">
      <nav className="public-nav" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="HostelHub home"><span className="brand-mark"><BedDouble size={19} /></span>HostelHub</Link>
        <div className="public-links"><a className="optional-link" href="#features">Platform</a><a className="optional-link" href="#how-it-works">How it works</a><Link className="button button-quiet" href="/login">Log in</Link><Link className="button button-primary" href="/register">Create account <ArrowRight size={14} /></Link></div>
      </nav>
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow">Campus living, made easier</span><h1>Make room for a <em>better</em> campus life.</h1><p>Smart hostel room booking and management, designed to make finding your place on campus feel straightforward.</p><div className="hero-actions"><Link className="button button-primary" href="/login">Find your room <ArrowRight size={15} /></Link><Link className="button button-secondary" href="/register">Register as a student</Link></div><div className="hero-note"><Sparkles size={15} /> One clear place for rooms, requests, fees, and support.</div></div>
        <div className="hero-visual" role="img" aria-label="Bright, modern university hostel room"><div className="availability-note"><span className="availability-dot" /> Rooms available for the new term</div><div className="hero-image-caption"><strong>Your next chapter starts here.</strong><span>Thoughtful campus living at HostelHub</span></div></div>
      </section>
      <section className="section" id="features"><div className="section-head"><div><span className="eyebrow">The essentials, together</span><h2>Hostel life, less complicated.</h2></div><p>From the first room search to the last maintenance update, the important details stay easy to find.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature" key={title}><span className="feature-icon"><Icon size={19} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="how-section" id="how-it-works"><div className="section"><div className="section-head"><div><span className="eyebrow">How it works</span><h2>A better stay in three steps.</h2></div><p>Simple by design, with a clear status at every step.</p></div><div className="steps"><article className="step"><span className="step-number">01</span><h3>Explore rooms</h3><p>Compare blocks, room types, amenities, availability, and monthly rates.</p></article><article className="step"><span className="step-number">02</span><h3>Send a request</h3><p>Choose a room and follow your booking request from submission to decision.</p></article><article className="step"><span className="step-number">03</span><h3>Settle in</h3><p>Keep fee summaries, profile details, and support requests close at hand.</p></article></div><div className="stats-band"><div className="stats-intro">A campus community, thoughtfully managed.</div><div><span className="stat-number">20</span><span className="stat-label">Sample rooms to explore</span></div><div><span className="stat-number">3</span><span className="stat-label">Residence halls</span></div><div><span className="stat-number">24/7</span><span className="stat-label">Your requests, in view</span></div></div></div></section>
      <footer className="public-footer"><div className="footer-inner"><span>© 2026 HostelHub · INT257 academic project</span><span>Smart Hostel Room Booking &amp; Management Platform</span></div></footer>
    </main>
  );
}
