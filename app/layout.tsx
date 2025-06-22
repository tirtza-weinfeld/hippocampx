import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Sidebar } from "@/components/sidebar/sidebar";
import AppFooter from "@/components/layout/app-footer";
import { cookies } from "next/headers";
import { CustomTheme } from "@/components/theme/custom-theme";
import { SparklesBackground } from "@/components/calculus/ui/sparkles-background";
import { Fonts } from "@/components/sidebar/fonts";
import { Font, getFontFamily } from "@/components/theme/font";
import 'katex/dist/katex.min.css';

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
  const sidebarDefaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning style={{ fontFamily: getFontFamily(font) }}>
      <body className={`${inter.variable} antialiased 
    
      `}>
      <div className="fixed inset-0 
      pointer-events-none z-[9999]" aria-label="Navigation" role="navigation">
        <SparklesBackground />
      </div>

      <Fonts />

        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          defaultFont={font}
          enableSystem
          disableTransitionOnChange
        >

          <CustomTheme>
    
              
            <div className="min-h-screen w-full">
              <Sidebar defaultOpen={sidebarDefaultOpen}>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">
                    {children}
                  </main>
                  <AppFooter />
                </div>
              </Sidebar>
            </div>

        
          </CustomTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}

