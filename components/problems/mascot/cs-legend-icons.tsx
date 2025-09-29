import { SVGProps } from "react"

export function TuringIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="turing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="face-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f3e8ff" />
        </radialGradient>
      </defs>

      {/* Head/Face - more angular, characteristic Turing features */}
      <ellipse cx="12" cy="10.2" rx="4.8" ry="5.8" fill="url(#face-gradient)" stroke="url(#turing-gradient)" strokeWidth="0.5"/>

      {/* Dark wavy hair - Turing's distinctive hair */}
      <path d="M7.2 5.5 Q8.5 4 10 5 Q11 4.2 12 4.8 Q13 4.2 14 5 Q15.5 4 16.8 5.5 Q16.5 7.5 15.5 8 Q14 6.8 12 7.2 Q10 6.8 8.5 8 Q7.5 7.5 7.2 5.5" fill="#2d1b69" opacity="0.9"/>
      <path d="M8 6.5 Q9 5.5 10.5 6.2 Q12 5.8 13.5 6.2 Q15 5.5 16 6.5 Q15.2 7.5 12 7.8 Q8.8 7.5 8 6.5" fill="#2d1b69" opacity="0.7"/>

      {/* Characteristic deep-set eyes */}
      <ellipse cx="10.2" cy="9.2" rx="0.8" ry="0.7" fill="#1f2937"/>
      <ellipse cx="13.8" cy="9.2" rx="0.8" ry="0.7" fill="#1f2937"/>
      <circle cx="10.4" cy="9" r="0.2" fill="white"/>
      <circle cx="14" cy="9" r="0.2" fill="white"/>

      {/* Strong, distinctive eyebrows */}
      <path d="M9.2 8.2 Q10.2 7.8 11.2 8.2" stroke="#2d1b69" strokeWidth="0.4" fill="none"/>
      <path d="M12.8 8.2 Q13.8 7.8 14.8 8.2" stroke="#2d1b69" strokeWidth="0.4" fill="none"/>

      {/* Prominent nose */}
      <path d="M12 10.8 L11.7 11.5 L12.3 11.5 Z" fill="#d1d5db"/>
      <path d="M11.8 10.8 Q12 11.2 12.2 10.8" stroke="#d1d5db" strokeWidth="0.2" fill="none"/>

      {/* Subtle mouth - Turing's reserved expression */}
      <path d="M11.2 12.8 Q12 13 12.8 12.8" stroke="#1f2937" strokeWidth="0.3" fill="none"/>

      {/* 1940s formal wear - suit and tie */}
      <path d="M8.2 15.5 Q12 17.2 15.8 15.5 Q15.5 19.5 12 20 Q8.5 19.5 8.2 15.5" fill="#1e3a8a" opacity="0.8"/>
      <path d="M11.5 16.8 Q12 18.5 12.5 16.8 Q12.2 18 11.8 17.5 Q11.5 16.8 11.5 16.8" fill="#991b1b" opacity="0.9"/>
      
      {/* Suit lapels */}
      <path d="M9.5 16 L11 17 L12 16.5 L13 17 L14.5 16" stroke="#1e3a8a" strokeWidth="0.6" fill="none" opacity="0.9"/>

      {/* Collar */}
      <path d="M10.8 16.2 L11.5 17 L12.5 17 L13.2 16.2" stroke="white" strokeWidth="0.4" fill="none" opacity="0.8"/>
    </svg>
  )
}

export function LovelaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="lovelace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <radialGradient id="ada-face-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f8e8ff" />
        </radialGradient>
      </defs>

      {/* Head/Face - Ada's soft, feminine oval face */}
      <ellipse cx="12" cy="10.8" rx="3.8" ry="4.8" fill="url(#ada-face-gradient)" stroke="url(#lovelace-gradient)" strokeWidth="0.5"/>

      {/* Victorian elaborate hairstyle - side ringlets and updo */}
      <path d="M8.2 5.5 Q9.5 4.2 11 5 Q11.8 4.5 12 4.8 Q12.2 4.5 13 5 Q14.5 4.2 15.8 5.5 Q16.2 7.5 15.5 9 Q14.8 8.2 13.5 8.5 Q12 8 10.5 8.5 Q9.2 8.2 8.5 9 Q7.8 7.5 8.2 5.5" fill="#4a1810" opacity="0.95"/>
      
      {/* Elaborate Victorian ringlets on sides */}
      <ellipse cx="8.5" cy="8" rx="1.2" ry="1.5" fill="#4a1810" opacity="0.9"/>
      <ellipse cx="15.5" cy="8" rx="1.2" ry="1.5" fill="#4a1810" opacity="0.9"/>
      <ellipse cx="8.8" cy="9.2" rx="0.8" ry="1" fill="#4a1810" opacity="0.8"/>
      <ellipse cx="15.2" cy="9.2" rx="0.8" ry="1" fill="#4a1810" opacity="0.8"/>

      {/* Hair ornaments - Victorian style */}
      <ellipse cx="9.5" cy="7" rx="0.4" ry="0.3" fill="#fbbf24" opacity="0.9"/>
      <ellipse cx="14.5" cy="7" rx="0.4" ry="0.3" fill="#fbbf24" opacity="0.9"/>

      {/* Large, expressive feminine eyes */}
      <ellipse cx="10.5" cy="10.2" rx="0.7" ry="0.8" fill="#1e293b"/>
      <ellipse cx="13.5" cy="10.2" rx="0.7" ry="0.8" fill="#1e293b"/>
      <circle cx="10.6" cy="10" r="0.25" fill="white"/>
      <circle cx="13.6" cy="10" r="0.25" fill="white"/>

      {/* Long, delicate eyelashes */}
      <path d="M10.1 9.5 L10.2 9.3" stroke="#4a1810" strokeWidth="0.2" fill="none"/>
      <path d="M10.5 9.4 L10.6 9.2" stroke="#4a1810" strokeWidth="0.2" fill="none"/>
      <path d="M10.9 9.5 L11 9.3" stroke="#4a1810" strokeWidth="0.2" fill="none"/>
      <path d="M13.1 9.5 L13.2 9.3" stroke="#4a1810" strokeWidth="0.2" fill="none"/>
      <path d="M13.5 9.4 L13.6 9.2" stroke="#4a1810" strokeWidth="0.2" fill="none"/>
      <path d="M13.9 9.5 L14 9.3" stroke="#4a1810" strokeWidth="0.2" fill="none"/>

      {/* Thin, arched feminine eyebrows */}
      <path d="M9.8 9.3 Q10.5 9 11.2 9.3" stroke="#4a1810" strokeWidth="0.25" fill="none"/>
      <path d="M12.8 9.3 Q13.5 9 14.2 9.3" stroke="#4a1810" strokeWidth="0.25" fill="none"/>

      {/* Small, delicate nose */}
      <path d="M12 11.8 L11.9 12.1 L12.1 12.1 Z" fill="#f4c2c2"/>

      {/* Small, rosebud mouth with lipstick */}
      <ellipse cx="12" cy="13.8" rx="0.6" ry="0.3" fill="#be185d" opacity="0.8"/>
      <ellipse cx="12" cy="13.7" rx="0.4" ry="0.2" fill="#dc2626" opacity="0.6"/>

      {/* Feminine jawline and cheekbones */}
      <path d="M9.2 13.5 Q12 14.2 14.8 13.5" stroke="#f4c2c2" strokeWidth="0.15" fill="none" opacity="0.6"/>

      {/* Victorian off-shoulder ballgown */}
      <path d="M8 16 Q12 17.8 16 16 Q15.8 19.5 12 20 Q8.2 19.5 8 16" fill="url(#lovelace-gradient)" opacity="0.8"/>
      
      {/* Elegant off-shoulder neckline */}
      <path d="M8.8 16.5 Q10.5 15.8 12 16.2 Q13.5 15.8 15.2 16.5" stroke="url(#lovelace-gradient)" strokeWidth="0.6" fill="none" opacity="0.95"/>

      {/* Victorian pearl necklace */}
      <ellipse cx="12" cy="17.2" rx="1.5" ry="0.3" fill="white" opacity="0.9"/>
      <circle cx="10.8" cy="17.2" r="0.15" fill="white"/>
      <circle cx="11.4" cy="17.2" r="0.18" fill="white"/>
      <circle cx="12" cy="17.2" r="0.2" fill="white"/>
      <circle cx="12.6" cy="17.2" r="0.18" fill="white"/>
      <circle cx="13.2" cy="17.2" r="0.15" fill="white"/>

      {/* Elegant dress details - Victorian lace */}
      <path d="M9 18 Q9.8 18.5 10.6 18.2 Q11.4 18.6 12.2 18.3 Q13 18.6 13.8 18.2 Q14.6 18.5 15 18" stroke="url(#lovelace-gradient)" strokeWidth="0.3" fill="none" opacity="0.7"/>

      {/* Delicate collar bones */}
      <path d="M10.5 16.8 Q12 17.2 13.5 16.8" stroke="#f4c2c2" strokeWidth="0.1" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function KnuthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="knuth-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <radialGradient id="knuth-face-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fed7aa" />
        </radialGradient>
      </defs>

      {/* Head/Face - Knuth's characteristic round, friendly face */}
      <ellipse cx="12" cy="10.5" rx="4.5" ry="5.5" fill="url(#knuth-face-gradient)" stroke="url(#knuth-gradient)" strokeWidth="0.5"/>

      {/* Knuth's graying, thinning hair with receding hairline */}
      <path d="M8.5 6.8 Q9.8 5.5 11.2 6.2 Q12 5.8 12.8 6.2 Q14.2 5.5 15.5 6.8 Q15.2 8.2 14.2 8.5 Q12 8 10 8.5 Q8.8 8.2 8.5 6.8" fill="#9ca3af" opacity="0.85"/>
      <path d="M9.2 7.5 Q10.5 7.2 12 7.5 Q13.5 7.2 14.8 7.5" stroke="#9ca3af" strokeWidth="0.3" opacity="0.6"/>

      {/* Normal-sized eyes behind reasonable glasses */}
      <ellipse cx="10.5" cy="10" rx="0.7" ry="0.6" fill="#1f2937"/>
      <ellipse cx="13.5" cy="10" rx="0.7" ry="0.6" fill="#1f2937"/>
      <circle cx="10.7" cy="9.8" r="0.2" fill="white"/>
      <circle cx="13.7" cy="9.8" r="0.2" fill="white"/>

      {/* More proportional rectangular glasses - not owl-like */}
      <rect x="9.2" y="9.2" width="2.6" height="1.8" rx="0.3" fill="none" stroke="#374151" strokeWidth="0.7" opacity="0.9"/>
      <rect x="12.2" y="9.2" width="2.6" height="1.8" rx="0.3" fill="none" stroke="#374151" strokeWidth="0.7" opacity="0.9"/>
      <line x1="11.8" y1="10.1" x2="12.2" y2="10.1" stroke="#374151" strokeWidth="0.6" opacity="0.9"/>

      {/* Knuth's distinctive full beard - well-groomed */}
      <path d="M9 13.8 Q12 16.2 15 13.8 Q14.8 17 12 17.5 Q9.2 17 9 13.8" fill="#9ca3af" opacity="0.9"/>
      <path d="M9.5 14.8 Q12 16.8 14.5 14.8 Q14.3 16.3 12 16.8 Q9.7 16.3 9.5 14.8" fill="#9ca3af" opacity="0.75"/>
      <path d="M10 15.5 Q12 16.5 14 15.5 Q13.8 16.2 12 16.5 Q10.2 16.2 10 15.5" fill="#9ca3af" opacity="0.6"/>

      {/* Well-defined nose */}
      <path d="M12 11.5 L11.8 12 L12.2 12 Z" fill="#d1d5db"/>
      <path d="M11.9 11.4 Q12 11.7 12.1 11.4" stroke="#d1d5db" strokeWidth="0.2" fill="none"/>

      {/* Mouth partially visible above beard */}
      <path d="M11.3 13.2 Q12 13.4 12.7 13.2" stroke="#1f2937" strokeWidth="0.3" fill="none" opacity="0.6"/>

      {/* Academic casual attire - button-down shirt */}
      <path d="M8.5 18 Q12 19.5 15.5 18 Q15.2 21.5 12 22 Q8.8 21.5 8.5 18" fill="#6366f1" opacity="0.8"/>
      
      {/* Button-down shirt details */}
      <path d="M10.8 18.5 L11.5 19.2 L12.5 19.2 L13.2 18.5" stroke="#6366f1" strokeWidth="0.5" fill="none" opacity="0.95"/>
      <circle cx="12" cy="19.8" r="0.15" fill="white" opacity="0.8"/>
      <circle cx="12" cy="20.5" r="0.15" fill="white" opacity="0.8"/>

      {/* Friendly eyebrows */}
      <path d="M9.5 9 Q10.5 8.7 11.5 9" stroke="#9ca3af" strokeWidth="0.35" fill="none"/>
      <path d="M12.5 9 Q13.5 8.7 14.5 9" stroke="#9ca3af" strokeWidth="0.35" fill="none"/>

      {/* Gentle smile lines */}
      <path d="M9.5 14 Q10.2 14.3 10.9 14" stroke="#d1d5db" strokeWidth="0.15" fill="none" opacity="0.5"/>
      <path d="M13.1 14 Q13.8 14.3 14.5 14" stroke="#d1d5db" strokeWidth="0.15" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function DijkstraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="dijkstra-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <radialGradient id="dijkstra-face-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fed7aa" />
        </radialGradient>
      </defs>

      {/* Head/Face - distinguished, intellectual appearance */}
      <ellipse cx="12" cy="10.2" rx="4.3" ry="5.3" fill="url(#dijkstra-face-gradient)" stroke="url(#dijkstra-gradient)" strokeWidth="0.5"/>

      {/* Dijkstra's neat, receding hairline - typical of older academic */}
      <path d="M8.5 6.2 Q10 4.8 11.5 5.5 Q12 5 12.5 5.5 Q14 4.8 15.5 6.2 Q15.2 7.8 14 8 Q12 7 10 8 Q8.8 7.8 8.5 6.2" fill="#6b7280" opacity="0.85"/>
      <path d="M9.2 7 Q12 6.2 14.8 7" stroke="#6b7280" strokeWidth="0.25" opacity="0.6"/>

      {/* Intellectual eyes - slightly larger, thoughtful */}
      <ellipse cx="10.3" cy="9.6" rx="0.8" ry="0.7" fill="#1f2937"/>
      <ellipse cx="13.7" cy="9.6" rx="0.8" ry="0.7" fill="#1f2937"/>
      <circle cx="10.5" cy="9.4" r="0.2" fill="white"/>
      <circle cx="13.9" cy="9.4" r="0.2" fill="white"/>

      {/* Distinguished eyebrows */}
      <path d="M9.3 8.8 Q10.3 8.4 11.3 8.8" stroke="#6b7280" strokeWidth="0.35" fill="none"/>
      <path d="M12.7 8.8 Q13.7 8.4 14.7 8.8" stroke="#6b7280" strokeWidth="0.35" fill="none"/>

      {/* Refined nose */}
      <path d="M12 11 L11.8 11.6 L12.2 11.6 Z" fill="#d1d5db"/>
      <path d="M11.9 11 Q12 11.3 12.1 11" stroke="#d1d5db" strokeWidth="0.2" fill="none"/>

      {/* Subtle, professional smile */}
      <path d="M11.2 13 Q12 13.3 12.8 13" stroke="#1f2937" strokeWidth="0.35" fill="none"/>

      {/* Professional Dutch academic attire - formal suit */}
      <path d="M8.3 15.8 Q12 17.3 15.7 15.8 Q15.4 19.2 12 19.7 Q8.6 19.2 8.3 15.8" fill="#1e40af" opacity="0.8"/>
      
      {/* Suit jacket details */}
      <path d="M9.8 16.5 L11.2 17.2 L12 16.8 L12.8 17.2 L14.2 16.5" stroke="#1e40af" strokeWidth="0.6" fill="none" opacity="0.9"/>
      
      {/* Conservative tie */}
      <path d="M11.6 17 Q12 18.5 12.4 17 Q12.2 18.2 11.8 17.8 Q11.6 17 11.6 17" fill="#991b1b" opacity="0.9"/>

      {/* Professional collar */}
      <path d="M10.8 16.8 L11.6 17.5 L12.4 17.5 L13.2 16.8" stroke="white" strokeWidth="0.4" fill="none" opacity="0.9"/>

      {/* Clean-shaven, professional appearance */}
      <path d="M9.5 13.8 Q12 14.5 14.5 13.8" stroke="#d1d5db" strokeWidth="0.2" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function HopperIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="hopper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id="grace-face-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
      </defs>

      {/* Head/Face - Grace's determined, intelligent features */}
      <ellipse cx="12" cy="9.8" rx="4" ry="4.8" fill="url(#grace-face-gradient)" stroke="url(#hopper-gradient)" strokeWidth="0.5"/>

      {/* Grace's distinctive 1940s hairstyle - neat, professional waves */}
      <path d="M8 5.8 Q9 4.5 10.5 5.2 Q11.2 4.8 12 5 Q12.8 4.8 13.5 5.2 Q15 4.5 16 5.8 Q16.2 7.2 15.2 8 Q14 7 12 7.2 Q10 7 8.8 8 Q7.8 7.2 8 5.8" fill="#8b4513" opacity="0.9"/>
      
      {/* Hair waves and styling typical of 1940s professional women */}
      <path d="M8.5 6.8 Q9.5 6.2 10.5 6.8 Q11.2 6.5 12 6.8 Q12.8 6.5 13.5 6.8 Q14.5 6.2 15.5 6.8" stroke="#8b4513" strokeWidth="0.3" opacity="0.7"/>
      <ellipse cx="9.2" cy="7" rx="0.6" ry="0.4" fill="#8b4513" opacity="0.7"/>
      <ellipse cx="14.8" cy="7" rx="0.6" ry="0.4" fill="#8b4513" opacity="0.7"/>

      {/* Strong, intelligent eyes - Grace's determined gaze */}
      <ellipse cx="10.3" cy="9.2" rx="0.8" ry="0.7" fill="#1f2937"/>
      <ellipse cx="13.7" cy="9.2" rx="0.8" ry="0.7" fill="#1f2937"/>
      <circle cx="10.5" cy="9" r="0.22" fill="white"/>
      <circle cx="13.9" cy="9" r="0.22" fill="white"/>

      {/* Strong, confident eyebrows */}
      <path d="M9.3 8.4 Q10.3 8 11.3 8.4" stroke="#8b4513" strokeWidth="0.4" fill="none"/>
      <path d="M12.7 8.4 Q13.7 8 14.7 8.4" stroke="#8b4513" strokeWidth="0.4" fill="none"/>

      {/* Well-defined nose */}
      <path d="M12 10.5 L11.8 11.1 L12.2 11.1 Z" fill="#d1d5db"/>
      <path d="M11.9 10.4 Q12 10.8 12.1 10.4" stroke="#d1d5db" strokeWidth="0.2" fill="none"/>

      {/* Confident, warm smile */}
      <path d="M11 12.2 Q12 12.6 13 12.2" stroke="#be185d" strokeWidth="0.4" fill="none"/>

      {/* Naval uniform - authentic Navy blue with proper details */}
      <path d="M8.2 14.8 Q12 16.2 15.8 14.8 Q15.6 18.5 12 19 Q8.4 18.5 8.2 14.8" fill="#1e3a8a" opacity="0.9"/>
      
      {/* Naval uniform collar - high, military style */}
      <path d="M9.5 15.5 L10.8 16.2 L11.2 15.8 L12 16 L12.8 15.8 L13.2 16.2 L14.5 15.5" stroke="#1e3a8a" strokeWidth="0.7" fill="none" opacity="1"/>
      
      {/* Naval officer stripes/insignia on sleeves */}
      <rect x="8.8" y="16.5" width="0.8" height="0.3" fill="#fbbf24" opacity="0.95"/>
      <rect x="8.8" y="17" width="0.8" height="0.3" fill="#fbbf24" opacity="0.95"/>
      <rect x="14.4" y="16.5" width="0.8" height="0.3" fill="#fbbf24" opacity="0.95"/>
      <rect x="14.4" y="17" width="0.8" height="0.3" fill="#fbbf24" opacity="0.95"/>

      {/* Navy buttons */}
      <circle cx="11.2" cy="17" r="0.15" fill="#fbbf24" opacity="0.9"/>
      <circle cx="12" cy="17.2" r="0.15" fill="#fbbf24" opacity="0.9"/>
      <circle cx="12.8" cy="17" r="0.15" fill="#fbbf24" opacity="0.9"/>

      {/* Service ribbons/decorations */}
      <rect x="9.5" y="15.8" width="1" height="0.4" fill="#dc2626" opacity="0.8"/>
      <rect x="10.6" y="15.8" width="1" height="0.4" fill="#059669" opacity="0.8"/>
      <rect x="12.4" y="15.8" width="1" height="0.4" fill="#7c3aed" opacity="0.8"/>
      <rect x="13.5" y="15.8" width="1" height="0.4" fill="#f59e0b" opacity="0.8"/>

      {/* Professional, determined jawline */}
      <path d="M8.8 13 Q12 13.8 15.2 13" stroke="#d1d5db" strokeWidth="0.2" fill="none" opacity="0.6"/>
    </svg>
  )
}

export function BernersLeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="web-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <radialGradient id="tim-face-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fed7aa" />
        </radialGradient>
      </defs>

      {/* Head/Face - Tim's friendly, approachable features */}
      <ellipse cx="12" cy="10.3" rx="4.5" ry="5.2" fill="url(#tim-face-gradient)" stroke="url(#web-gradient)" strokeWidth="0.5"/>

      {/* Tim's characteristic graying hair - mature, receding */}
      <path d="M8.2 6.5 Q9.8 5.2 11.5 6 Q12 5.5 12.5 6 Q14.2 5.2 15.8 6.5 Q15.5 8 14.2 8.2 Q12 7.5 9.8 8.2 Q8.5 8 8.2 6.5" fill="#9ca3af" opacity="0.8"/>
      <path d="M9 7.5 Q10.5 7 12 7.5 Q13.5 7 15 7.5" stroke="#9ca3af" strokeWidth="0.3" opacity="0.6"/>

      {/* Tim's kind, intelligent eyes */}
      <ellipse cx="10.2" cy="9.8" rx="0.7" ry="0.6" fill="#1f2937"/>
      <ellipse cx="13.8" cy="9.8" rx="0.7" ry="0.6" fill="#1f2937"/>
      <circle cx="10.4" cy="9.6" r="0.2" fill="white"/>
      <circle cx="14" cy="9.6" r="0.2" fill="white"/>

      {/* Modern rectangular glasses - Tim's signature look */}
      <rect x="8.8" y="9" width="2.8" height="1.8" rx="0.4" fill="none" stroke="#374151" strokeWidth="0.7" opacity="0.9"/>
      <rect x="12.4" y="9" width="2.8" height="1.8" rx="0.4" fill="none" stroke="#374151" strokeWidth="0.7" opacity="0.9"/>
      <line x1="11.6" y1="9.9" x2="12.4" y2="9.9" stroke="#374151" strokeWidth="0.6" opacity="0.9"/>

      {/* Gentle eyebrows */}
      <path d="M9 8.5 Q10 8.2 11 8.5" stroke="#9ca3af" strokeWidth="0.35" fill="none"/>
      <path d="M13 8.5 Q14 8.2 15 8.5" stroke="#9ca3af" strokeWidth="0.35" fill="none"/>

      {/* Nose */}
      <path d="M12 11.3 L11.8 11.8 L12.2 11.8 Z" fill="#d1d5db"/>
      <path d="M11.9 11.2 Q12 11.5 12.1 11.2" stroke="#d1d5db" strokeWidth="0.2" fill="none"/>

      {/* Warm, approachable smile */}
      <path d="M11 13.2 Q12 13.6 13 13.2" stroke="#1f2937" strokeWidth="0.4" fill="none"/>

      {/* Modern casual attire - Tim's relaxed style */}
      <path d="M8.5 15.5 Q12 17 15.5 15.5 Q15.2 19 12 19.5 Q8.8 19 8.5 15.5" fill="#6366f1" opacity="0.7"/>
      
      {/* Casual button-down shirt */}
      <path d="M10.2 16.2 Q11.5 16.8 12 16.5 Q12.5 16.8 13.8 16.2" stroke="#6366f1" strokeWidth="0.5" fill="none" opacity="0.9"/>

      {/* Open collar - relaxed, modern look */}
      <path d="M10.8 16.8 L11.4 17.5 Q12 17.2 12.6 17.5 L13.2 16.8" stroke="white" strokeWidth="0.5" fill="none" opacity="0.9"/>

      {/* Casual shirt pocket */}
      <rect x="9.5" y="17" width="1" height="1.2" rx="0.1" fill="none" stroke="#6366f1" strokeWidth="0.3" opacity="0.7"/>

      {/* Friendly, approachable expression lines */}
      <path d="M9.2 13.5 Q10 14 10.8 13.5" stroke="#d1d5db" strokeWidth="0.15" fill="none" opacity="0.5"/>
      <path d="M13.2 13.5 Q14 14 14.8 13.5" stroke="#d1d5db" strokeWidth="0.15" fill="none" opacity="0.5"/>
    </svg>
  )
}