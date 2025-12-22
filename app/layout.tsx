import { Suspense } from "react";
import "@/styles/globals.css";
import "@/styles/dev-only.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Sidebar } from "@/components/sidebar/sidebar";
import AppFooter from "@/components/layout/app-footer";
import { cookies } from "next/headers";
import { type FontKey, fontVariables } from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cacheLife, cacheTag } from "next/cache";
import 'katex/dist/katex.min.css';

export { metadata, viewport } from "@/lib/metadata";

async function RootLayoutContent({ children }: { children: React.ReactNode }) {
  'use cache: private'
  cacheTag('root-layout')
  cacheLife({ stale: 3600 })

  const cookieStore = await cookies()
  const font = (cookieStore.get("font")?.value ?? "inter") as FontKey
  const sidebarDefaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning className={fontVariables} style={{ "--font-family": `var(--font-${font})` } as React.CSSProperties}>
      <body className="antialiased">
        <ThemeProvider defaultFont={font}>
          <TooltipProvider delayDuration={0}>
            {/* <div className="fixed inset-0 pointer-events-none z-[9999]">
              <SparklesBackground />
            </div> */}
            <Sidebar defaultOpen={sidebarDefaultOpen}>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
                <AppFooter />
              </div>
            </Sidebar>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function LayoutSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="antialiased">
        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LayoutSkeleton>{children}</LayoutSkeleton>}>
      <RootLayoutContent>{children}</RootLayoutContent>
    </Suspense>
  )
}

