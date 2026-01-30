import type { Metadata, Viewport } from "next";
import { ThemeProvider, ToastProvider } from "@/components/providers";
import { DashboardLayout } from "@/components/layout";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";
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
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-public-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
