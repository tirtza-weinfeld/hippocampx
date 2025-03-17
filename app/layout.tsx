import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import AppFooter from "@/components/layout/app-footer";
import { cookies } from "next/headers";
import { CustomTheme } from "@/components/theme/custom-theme";

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
      <body className={`${geistSans.variable} ${geistMono.variable} @container`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomTheme>
            <SidebarProvider defaultOpen={defaultOpen}  >
              <SidebarTrigger className="md:hidden absolute top-3 left-2  z-50 bg-sidebar rounded p-2" />
              <AppSidebar
                side="left"
                variant="inset"
                collapsible="icon"
              />

              <SidebarInset >

                <div className="flex flex-col min-h-screen">

                  {/* <AppHeader /> */}
                  {/* <div className="mt-12  h-full w-full"> */}
                  <div className="  h-full w-full">
                    {children}
                  </div>

                </div>
                <AppFooter />

              </SidebarInset>

            </SidebarProvider>
          </CustomTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}
