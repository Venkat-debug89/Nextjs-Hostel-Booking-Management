"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { HostelProvider } from "@/context/HostelContext";

export default function AppProviders({ children }) {
  return (
    <HostelProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3200 }} />
      </AuthProvider>
    </HostelProvider>
  );
}