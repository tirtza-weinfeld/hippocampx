import type React from "react"
import type { Metadata } from "next"
// import "@/styles/components/infinity.css";




export const metadata: Metadata = {
  title: "Infinity for Kids",
  description: "Learn about different levels of infinity in a fun, interactive way!",
  keywords: ["infinity", "math", "education", "kids", "learning", "interactive"],

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <div >
          {children}
   </div>
   
  )
}


