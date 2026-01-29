import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers";
import { DashboardLayout } from "@/components/layout";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeKonsole - Server Management Dashboard",
  description: "Modern Linux server management dashboard - A powerful cPanel alternative",
  keywords: ["server management", "linux", "dashboard", "cpanel alternative", "web hosting"],
  authors: [{ name: "WeKonsole Team" }],
  openGraph: {
    title: "WeKonsole - Server Management Dashboard",
    description: "Modern Linux server management dashboard",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-inter antialiased">
        <ThemeProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
