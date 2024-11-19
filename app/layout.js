import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <title>F.U.M.L</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>

            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
        <main>{children}</main>
        <Toaster />
            </ThemeProvider>
                      
        </SessionProvider>
      </body>
    </html>
  );
}
