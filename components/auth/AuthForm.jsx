"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BedDouble, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm({ mode }) {
  const registering = mode === "register";
  const { login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", phone: "", course: "", year: "Year 1", password: "", confirmPassword: "" });
  const change = (event) => setFields((current) => ({ ...current, [event.target.name]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    setError("");
    if (registering) {
      if (fields.password.length < 6) return setError("Choose a password with at least 6 characters.");
      if (fields.password !== fields.confirmPassword) return setError("The passwords do not match.");
      const result = register(fields);
      if (!result.ok) return setError(result.error);
      toast.success("Your student account is ready.");
      router.replace("/student/dashboard");
      return;
    }
    const result = login(fields.email, fields.password);
    if (!result.ok) return setError(result.error);
    toast.success("Welcome back to HostelHub.");
    router.replace(result.destination);
  }

  const fillDemo = (role) => setFields((current) => ({ ...current, email: role === "admin" ? "admin@hostelhub.com" : "student@gmail.com", password: role === "admin" ? "admin123" : "student123" }));

  return (
    <main className="auth-wrap">
      <aside className="auth-aside">
        <Link className="brand" href="/"><span className="brand-mark"><BedDouble size={19} /></span>HostelHub</Link>
        <div className="auth-aside-copy"><span className="eyebrow" style={{ color: "#9ec2d5" }}>A better place to begin</span><h1>Make campus feel like yours.</h1><p>Room details, booking updates, hostel fees, and everyday support, all in one student workspace.</p><div className="hero-note" style={{ color: "#c6d4dd" }}><ShieldCheck size={16} /> Built for a clear, confident stay.</div></div>
        <div className="auth-aside-foot">INT257 · Modern Web Application Development</div>
      </aside>
      <section className="auth-main">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow-small">{registering ? "Join the campus" : "Student and administrator access"}</span><h2>{registering ? "Create your account" : "Welcome back"}</h2><p>{registering ? "Set up your student profile to begin exploring rooms." : "Sign in to continue to your HostelHub workspace."}</p>
          {!registering && <div className="demo-box"><strong>Demo access</strong><br /><button className="panel-link" type="button" onClick={() => fillDemo("student")}>Fill student login</button> · <button className="panel-link" type="button" onClick={() => fillDemo("admin")}>Fill admin login</button><br />Student: student@gmail.com / student123<br />Admin: admin@hostelhub.com / admin123</div>}
          {registering && <><div className="form-field"><label htmlFor="name">Full name</label><input className="input" id="name" name="name" autoComplete="name" required value={fields.name} onChange={change} /></div><div className="form-grid"><div className="form-field"><label htmlFor="phone">Phone</label><input className="input" id="phone" name="phone" autoComplete="tel" required value={fields.phone} onChange={change} /></div><div className="form-field"><label htmlFor="year">Academic year</label><select className="select" id="year" name="year" value={fields.year} onChange={change}>{[1, 2, 3, 4].map((year) => <option key={year}>Year {year}</option>)}</select></div></div><div className="form-field"><label htmlFor="course">Course</label><input className="input" id="course" name="course" required value={fields.course} onChange={change} /></div></>}
          <div className="form-field"><label htmlFor="email">Email address</label><input className="input" id="email" name="email" type="email" autoComplete="email" required value={fields.email} onChange={change} /></div>
          <div className="form-field"><label htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} required value={fields.password} onChange={change} /></div>
          {registering && <div className="form-field"><label htmlFor="confirmPassword">Confirm password</label><input className="input" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={fields.confirmPassword} onChange={change} /></div>}
          {registering && <p className="metric-note">Demo passwords are kept only in memory and are not saved to browser storage.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" style={{ width: "100%", marginTop: 9 }} type="submit">{registering ? "Create student account" : "Sign in"}</button>
          <p style={{ marginTop: 20 }}>{registering ? "Already registered?" : "New to HostelHub?"} <Link className="panel-link" href={registering ? "/login" : "/register"}>{registering ? "Sign in" : "Create an account"}</Link></p>
          <p className="metric-note">Frontend-only academic demo. Do not enter a real password.</p>
        </form>
      </section>
    </main>
  );
}
