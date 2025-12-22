import { Suspense } from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Sidebar } from "@/components/sidebar/sidebar";
import AppFooter from "@/components/layout/app-footer";
import { cookies } from "next/headers";
import { fontVariables } from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";

export { metadata, viewport } from "@/lib/metadata";

async function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarDefaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar defaultOpen={sidebarDefaultOpen}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
          <AppFooter />
        </div>
      </Sidebar>
    </TooltipProvider>
  )
}

function LayoutSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 flex-col border-r border-border/40 bg-muted/30">
        <div className="p-4 space-y-3">
          <div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 rounded-md bg-muted/60 animate-pulse" style={{ animationDelay: `${i * 75}ms` }} />
            ))}
          </div>
        </div>
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-4xl space-y-4">
            <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted/60 animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="h-4 w-3/4 rounded bg-muted/40 animate-pulse" style={{ animationDelay: '150ms' }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="antialiased">
        <ThemeProvider>
          <Suspense fallback={<LayoutSkeleton />}>
            <RootLayoutContent>{children}</RootLayoutContent>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
