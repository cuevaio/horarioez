import type { Metadata } from "next";
import { Poppins as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";
import "./globals.css";

import { Providers } from "./providers";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Horario EZ",
  description: "Pasar tu horario de UTEC a Google Calendar nunca fue tan fácil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          "min-h-screen overflow-y-scroll bg-background font-sans"
        )}
      >
        <Providers>
          <div>
            {children}
            <Toaster richColors closeButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}
