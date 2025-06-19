"use client"

import {
  Dancing_Script,
  Pacifico,
  Great_Vibes,
  Satisfy,
  Tangerine,
  Roboto,
  Open_Sans,
  Montserrat,
} from "next/font/google"

// Load script fonts
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
})

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
})

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-satisfy",
  display: "swap",
})

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
})

// Load standard fonts
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export function Fonts() {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-dancing-script: ${dancingScript.style.fontFamily};
          --font-pacifico: ${pacifico.style.fontFamily};
          --font-great-vibes: ${greatVibes.style.fontFamily};
          --font-satisfy: ${satisfy.style.fontFamily};
          --font-tangerine: ${tangerine.style.fontFamily};
          --font-roboto: ${roboto.style.fontFamily};
          --font-open-sans: ${openSans.style.fontFamily};
          --font-montserrat: ${montserrat.style.fontFamily};
        }
        
        /* Add font classes for direct application */
        .font-dancing-script {
          font-family: var(--font-dancing-script);
        }
        .font-pacifico {
          font-family: var(--font-pacifico);
        }
        .font-great-vibes {
          font-family: var(--font-great-vibes);
        }
        .font-satisfy {
          font-family: var(--font-satisfy);
        }
        .font-tangerine {
          font-family: var(--font-tangerine);
        }
        .font-roboto {
          font-family: var(--font-roboto);
        }
        .font-open-sans {
          font-family: var(--font-open-sans);
        }
        .font-montserrat {
          font-family: var(--font-montserrat);
        }
      `}</style>
    </>
  )
}
