import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import NavBar from "@/components/ui/navbar"
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookkMarrker",
  description: "A modern web application built with Next.js and Clerk",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow container mx-auto px-4 py-8 mt-16">
                {children}
              </main>
              <footer className="border-t py-8 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      © {new Date().getFullYear()} BookkMarrker. All rights reserved.
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      Made with <span className="mx-1">🧠</span> by
                      <a
                        href='https://github.com/prathameshpowar1910'
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        @prathameshpowar1910
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}