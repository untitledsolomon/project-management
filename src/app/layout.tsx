import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { WorkspaceProvider } from "@/components/providers/WorkspaceProvider";
import { Toaster } from "sonner";


const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Axis | Project Management",
  description: "A premium project management platform for high-performance teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface-1 text-primary">
        <WorkspaceProvider>
          {children}
          <CommandPalette />
          <Toaster position="bottom-right" />
        </WorkspaceProvider>
      </body>
    </html>
  );
}
