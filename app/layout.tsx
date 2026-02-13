import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Smart Bookmark",
    template: "%s | Smart Bookmark",
  },
  description:
    "Smart Bookmark is a secure realtime bookmark manager built with Next.js and Supabase. Organize, edit, and access your bookmarks seamlessly.",
  keywords: [
    "Bookmark Manager",
    "Next.js",
    "Supabase",
    "Realtime App",
    "Fullstack Project",
  ],
  authors: [{ name: "Your Name" }],
  metadataBase: new URL("https://your-vercel-domain.vercel.app"), // replace after deploy
  openGraph: {
    title: "Smart Bookmark",
    description:
      "Secure realtime bookmark manager with inline editing and search.",
    url: "https://your-vercel-domain.vercel.app",
    siteName: "Smart Bookmark",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
