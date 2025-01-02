import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import AppFooter from "@/components/layout/app-footer";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata } from "@/lib/metadata";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen} >

            <AppSidebar
              side="left"
              variant="inset"
              collapsible="icon"
            />

            <SidebarInset>

              <div className="flex flex-col min-h-screen">

                <AppHeader />

                {children}
              </div>
              <AppFooter />

            </SidebarInset>

          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
