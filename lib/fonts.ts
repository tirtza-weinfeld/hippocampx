import {
  Inter,
  Dancing_Script,
  Pacifico,
  Great_Vibes,
  Satisfy,
  Tangerine,
  Allura,
  Kaushan_Script,
  Sacramento,
  Roboto,
  Open_Sans,
  Montserrat,
} from "next/font/google"

// Font loaders must be called at module scope
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script", display: "swap", weight: ["400", "500", "600", "700"] })
const pacifico = Pacifico({ subsets: ["latin"], variable: "--font-pacifico", display: "swap", weight: "400" })
const greatVibes = Great_Vibes({ subsets: ["latin"], variable: "--font-great-vibes", display: "swap", weight: "400" })
const satisfy = Satisfy({ subsets: ["latin"], variable: "--font-satisfy", display: "swap", weight: "400" })
const tangerine = Tangerine({ subsets: ["latin"], variable: "--font-tangerine", display: "swap", weight: ["400", "700"] })
const allura = Allura({ subsets: ["latin"], variable: "--font-allura", display: "swap", weight: "400" })
const kaushanScript = Kaushan_Script({ subsets: ["latin"], variable: "--font-kaushan-script", display: "swap", weight: "400" })
const sacramento = Sacramento({ subsets: ["latin"], variable: "--font-sacramento", display: "swap", weight: "400" })
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", display: "swap", weight: ["400", "500", "700", "900"] })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" })

// Font metadata for UI
const FONT_CONFIG = [
  { key: "inter", label: "Inter", category: "sans-serif" },
  { key: "dancing-script", label: "Dancing Script", category: "script" },
  { key: "pacifico", label: "Pacifico", category: "script" },
  { key: "great-vibes", label: "Great Vibes", category: "script" },
  { key: "satisfy", label: "Satisfy", category: "script" },
  { key: "tangerine", label: "Tangerine", category: "script" },
  { key: "allura", label: "Allura", category: "script" },
  { key: "kaushan-script", label: "Kaushan Script", category: "script" },
  { key: "sacramento", label: "Sacramento", category: "script" },
  { key: "roboto", label: "Roboto", category: "sans-serif" },
  { key: "open-sans", label: "Open Sans", category: "sans-serif" },
  { key: "montserrat", label: "Montserrat", category: "sans-serif" },
] as const

export type FontKey = typeof FONT_CONFIG[number]["key"]
export type FontCategory = typeof FONT_CONFIG[number]["category"]

export const FONTS = Object.fromEntries(
  FONT_CONFIG.map(f => [f.key, { label: f.label, category: f.category }])
) as Record<FontKey, { label: string; category: FontCategory }>

export const fontVariables = [
  inter,
  dancingScript,
  pacifico,
  greatVibes,
  satisfy,
  tangerine,
  allura,
  kaushanScript,
  sacramento,
  roboto,
  openSans,
  montserrat,
].map(f => f.variable).join(" ")
