import type { Metadata, Viewport } from "next";
import { Syne, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#5865F2",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "DStats | Discord Analytics SDK",
    template: "%s | DStats",
  },
  description: "Discord SDK for server insights",
  keywords: ["Discord SDK", "Discord Analytics", "Bot metrics", "Server stats"],
  authors: [{ name: "@ViB404" }],
  creator: "@ViB404",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`dark ${syne.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
      >
        <body
          suppressHydrationWarning
          className="min-h-full flex flex-col bg-neutral font-sans"
        >
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
