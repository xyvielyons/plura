import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import {dark} from '@clerk/themes'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/providers/theme-provider";
import ModalProvider from "@/providers/modal-provider";
const font = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plura",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${font.className} antialiased`}
        >
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
            <ModalProvider>
            {children}
            </ModalProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>    
  );
}
