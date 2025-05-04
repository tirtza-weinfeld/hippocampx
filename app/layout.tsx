import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
// import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar/sidebar";
// import { AppSidebar } from "@/components/layout/app-sidebar";
import AppFooter from "@/components/layout/app-footer";
import { cookies } from "next/headers";
import { CustomTheme } from "@/components/theme/custom-theme";
import { SparklesCore } from "@/components/calculus/ui/sparkles";
import { Fonts } from "@/components/sidebar/fonts";
// import { Fonts } from "@/components/sidebar/fonts";
import { Font } from "@/components/theme/theme-provider";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })


export { metadata } from "@/lib/metadata";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const theme = cookieStore.get("theme")?.value || "system"
  const font: Font = cookieStore.get("font")?.value as Font || "inter"
  // const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      {/* <body className={`${geistSans.variable} ${geistMono.variable} @container `}>
       */}
      <body className={`${inter.variable} antialiased`}>
       
      {/* <Fonts /> */}

        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          defaultFont={font }
          enableSystem
          disableTransitionOnChange
        >
        <Fonts />

          <CustomTheme>
          <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={15}
                className="h-full w-full"
                particleColor="#7C3AED"
              />
            {/* <SidebarProvider defaultOpen={defaultOpen}  >
              <SidebarTrigger className="md:hidden fixed top-3 left-2 z-50 bg-sidebar rounded p-3 rounded-full " />
               */}
            {/* <AppSidebar
                side="left"
                variant="inset"
                collapsible="icon"
              />

              <SidebarInset > */}
            <div className="  h-full w-full">
            
              <div className="flex flex-col min-h-screen">

                {/* <AppHeader /> */}
                {/* <div className="mt-12  h-full w-full"> */}
              
                <Sidebar>

                  {children}

                </Sidebar>

              </div>

            </div>
            <AppFooter />

            {/* </SidebarInset>

            </SidebarProvider> */}
          </CustomTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}
