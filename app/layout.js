import "./globals.css";
import AppProviders from "@/providers/AppProviders";

export const metadata = {
  title: "HostelHub | Student living, made simpler",
  description: "Hostel room booking and management platform for campus communities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
