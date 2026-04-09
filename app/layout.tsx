import type { Metadata } from "next";
import { MuiProvider } from "@/theme/MuiProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prestige Realty — Find Where You Belong",
    template: "%s | Prestige Realty",
  },
  description:
    "Premium real estate agency in New York. Browse luxury listings, connect with expert agents, and find your dream home.",
  keywords: ["real estate", "luxury homes", "property", "New York", "agents"],
  openGraph: {
    type: "website",
    siteName: "Prestige Realty",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
