import { Suspense } from "react";
import { ProtectedLayout } from "@/components/layout/PortalLayout";

export default function AdminLayout({ children }) {
  return <Suspense fallback={<main className="auth-main"><p>Loading your workspace…</p></main>}><ProtectedLayout role="admin">{children}</ProtectedLayout></Suspense>;
}
