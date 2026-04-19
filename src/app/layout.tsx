import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Spotify Listening Personality",
  description: "Analyze your Spotify listening history and discover your music personality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-black text-white`}>
        <SessionProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
