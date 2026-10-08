import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { RosarySync } from "@/components/pwa/rosary-sync";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const ui = Hanken_Grotesk({ variable: "--font-ui", subsets: ["latin"], display: "swap" });
const prayer = Source_Serif_4({ variable: "--font-prayer", subsets: ["latin"], display: "swap" });
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Ora — Catholic prayer", template: "%s · Ora" },
  description: "A calm place to keep your prayers and pray the Rosary.",
  applicationName: "Ora",
  appleWebApp: { capable: true, title: "Ora", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/brand/ora-app-icon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1626" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ui.variable} ${prayer.variable} ${display.variable}`}
    >
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ServiceWorkerRegister />
          <RosarySync />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
