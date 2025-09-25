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

      {/* Head/Face */}
      <ellipse cx="12" cy="10" rx="5" ry="6" fill="url(#face-gradient)" stroke="url(#turing-gradient)" strokeWidth="0.5"/>

      {/* Hair - slicked back style */}
      <path d="M7 6 Q12 4 17 6 Q16 8 12 8 Q8 8 7 6" fill="url(#turing-gradient)" opacity="0.8"/>

      {/* Eyes */}
      <circle cx="10" cy="9" r="0.6" fill="#1f2937"/>
      <circle cx="14" cy="9" r="0.6" fill="#1f2937"/>
      <circle cx="10.2" cy="8.8" r="0.2" fill="white"/>
      <circle cx="14.2" cy="8.8" r="0.2" fill="white"/>

      {/* Eyebrows */}
      <path d="M9.2 7.8 Q10 7.5 10.8 7.8" stroke="#1f2937" strokeWidth="0.3" fill="none"/>
      <path d="M13.2 7.8 Q14 7.5 14.8 7.8" stroke="#1f2937" strokeWidth="0.3" fill="none"/>

      {/* Nose */}
      <path d="M12 10.5 L11.8 11.2 L12.2 11.2 Z" fill="#d1d5db"/>

      {/* Mouth - slight smile */}
      <path d="M11 12.5 Q12 13 13 12.5" stroke="#1f2937" strokeWidth="0.4" fill="none"/>

      {/* Glasses */}
      <circle cx="10" cy="9" r="1.8" fill="none" stroke="url(#turing-gradient)" strokeWidth="0.8" opacity="0.7"/>
      <circle cx="14" cy="9" r="1.8" fill="none" stroke="url(#turing-gradient)" strokeWidth="0.8" opacity="0.7"/>
      <line x1="11.8" y1="9" x2="12.2" y2="9" stroke="url(#turing-gradient)" strokeWidth="0.6" opacity="0.7"/>

      {/* Collar/Tie */}
      <path d="M8 16 Q12 18 16 16 L15 20 Q12 21 9 20 Z" fill="url(#turing-gradient)" opacity="0.6"/>
      <path d="M11.5 17 Q12 19 12.5 17 Q12 18 11.5 17" fill="url(#turing-gradient)" opacity="0.8"/>
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
          <stop offset="100%" stopColor="#f3e8ff" />
        </radialGradient>
      </defs>

      {/* Head/Face */}
      <ellipse cx="12" cy="10" rx="4.5" ry="5.5" fill="url(#ada-face-gradient)" stroke="url(#lovelace-gradient)" strokeWidth="0.5"/>

      {/* Victorian Hair - elaborate updo */}
      <path d="M7.5 5 Q12 3 16.5 5 Q17 7 16 8 Q15 6 12 6 Q9 6 8 8 Q7 7 7.5 5" fill="url(#lovelace-gradient)" opacity="0.9"/>
      <path d="M8 7 Q10 5.5 12 6 Q14 5.5 16 7 Q15 8 12 7.5 Q9 8 8 7" fill="url(#lovelace-gradient)" opacity="0.7"/>

      {/* Hair ornament/ribbons */}
      <ellipse cx="9" cy="6.5" rx="0.8" ry="0.4" fill="#fbbf24" opacity="0.8"/>
      <ellipse cx="15" cy="6.5" rx="0.8" ry="0.4" fill="#fbbf24" opacity="0.8"/>

      {/* Eyes - elegant */}
      <ellipse cx="10.5" cy="9.5" rx="0.8" ry="0.6" fill="#1f2937"/>
      <ellipse cx="13.5" cy="9.5" rx="0.8" ry="0.6" fill="#1f2937"/>
      <circle cx="10.7" cy="9.3" r="0.2" fill="white"/>
      <circle cx="13.7" cy="9.3" r="0.2" fill="white"/>

      {/* Eyelashes */}
      <path d="M9.8 9 Q10.5 8.8 11.2 9" stroke="#1f2937" strokeWidth="0.2" fill="none"/>
      <path d="M12.8 9 Q13.5 8.8 14.2 9" stroke="#1f2937" strokeWidth="0.2" fill="none"/>

      {/* Nose */}
      <path d="M12 10.8 L11.9 11.3 L12.1 11.3 Z" fill="#d1d5db"/>

      {/* Mouth - refined smile */}
      <path d="M11.2 12.8 Q12 13.2 12.8 12.8" stroke="#be185d" strokeWidth="0.4" fill="none"/>

      {/* Victorian dress collar/neckline */}
      <path d="M8 15.5 Q12 17 16 15.5 Q15.5 18 12 18.5 Q8.5 18 8 15.5" fill="url(#lovelace-gradient)" opacity="0.6"/>

      {/* Jewelry/brooch */}
      <circle cx="12" cy="16.5" r="0.8" fill="#fbbf24" opacity="0.9"/>
      <circle cx="12" cy="16.5" r="0.4" fill="url(#lovelace-gradient)" opacity="0.8"/>

      {/* Victorian dress details */}
      <path d="M9 17 Q12 18.5 15 17" stroke="url(#lovelace-gradient)" strokeWidth="0.6" fill="none" opacity="0.7"/>
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

      {/* Head/Face */}
      <ellipse cx="12" cy="10" rx="4.8" ry="5.8" fill="url(#knuth-face-gradient)" stroke="url(#knuth-gradient)" strokeWidth="0.5"/>

      {/* Distinctive curly hair */}
      <path d="M7 6 Q8 4 10 5 Q11 4 12 5 Q13 4 14 5 Q15 4 17 6 Q16 8 15 7 Q14 8 12 7 Q10 8 9 7 Q8 8 7 6" fill="url(#knuth-gradient)" opacity="0.8"/>
      <circle cx="8.5" cy="6.5" r="0.8" fill="url(#knuth-gradient)" opacity="0.6"/>
      <circle cx="15.5" cy="6.5" r="0.8" fill="url(#knuth-gradient)" opacity="0.6"/>

      {/* Eyes behind glasses */}
      <circle cx="10" cy="9.5" r="0.7" fill="#1f2937"/>
      <circle cx="14" cy="9.5" r="0.7" fill="#1f2937"/>
      <circle cx="10.2" cy="9.3" r="0.2" fill="white"/>
      <circle cx="14.2" cy="9.3" r="0.2" fill="white"/>

      {/* Large round glasses */}
      <circle cx="10" cy="9.5" r="2" fill="none" stroke="url(#knuth-gradient)" strokeWidth="0.8" opacity="0.8"/>
      <circle cx="14" cy="9.5" r="2" fill="none" stroke="url(#knuth-gradient)" strokeWidth="0.8" opacity="0.8"/>
      <line x1="12" y1="9.5" x2="12" y2="9.5" stroke="url(#knuth-gradient)" strokeWidth="0.6" opacity="0.8"/>

      {/* Beard */}
      <path d="M9 13 Q12 15 15 13 Q14.5 16 12 16.5 Q9.5 16 9 13" fill="url(#knuth-gradient)" opacity="0.7"/>
      <path d="M9.5 14 Q12 15.5 14.5 14 Q14 15.5 12 16 Q10 15.5 9.5 14" fill="url(#knuth-gradient)" opacity="0.5"/>

      {/* Nose */}
      <path d="M12 11 L11.8 11.5 L12.2 11.5 Z" fill="#d1d5db"/>

      {/* Mouth under beard */}
      <path d="M11 12.5 Q12 13 13 12.5" stroke="#1f2937" strokeWidth="0.3" fill="none" opacity="0.6"/>

      {/* Academic clothing */}
      <path d="M8 17 Q12 19 16 17 L15.5 21 Q12 22 8.5 21 Z" fill="url(#knuth-gradient)" opacity="0.4"/>
      <rect x="11.5" y="18" width="1" height="3" fill="url(#knuth-gradient)" opacity="0.6"/>
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

      {/* Head/Face */}
      <ellipse cx="12" cy="10" rx="4.5" ry="5.5" fill="url(#dijkstra-face-gradient)" stroke="url(#dijkstra-gradient)" strokeWidth="0.5"/>

      {/* Neat combed hair */}
      <path d="M7.5 5.5 Q12 4 16.5 5.5 Q16 7 15 7 Q12 6 9 7 Q8 7 7.5 5.5" fill="url(#dijkstra-gradient)" opacity="0.8"/>
      <path d="M8 6.5 Q12 5.5 16 6.5" stroke="url(#dijkstra-gradient)" strokeWidth="0.3" opacity="0.6"/>

      {/* Eyes */}
      <circle cx="10.5" cy="9.5" r="0.6" fill="#1f2937"/>
      <circle cx="13.5" cy="9.5" r="0.6" fill="#1f2937"/>
      <circle cx="10.7" cy="9.3" r="0.2" fill="white"/>
      <circle cx="13.7" cy="9.3" r="0.2" fill="white"/>

      {/* Eyebrows */}
      <path d="M9.5 8.5 Q10.5 8.2 11.5 8.5" stroke="#1f2937" strokeWidth="0.3" fill="none"/>
      <path d="M12.5 8.5 Q13.5 8.2 14.5 8.5" stroke="#1f2937" strokeWidth="0.3" fill="none"/>

      {/* Nose */}
      <path d="M12 10.8 L11.8 11.4 L12.2 11.4 Z" fill="#d1d5db"/>

      {/* Mouth - slight smile */}
      <path d="M11 12.8 Q12 13.2 13 12.8" stroke="#1f2937" strokeWidth="0.4" fill="none"/>

      {/* Professional attire - suit */}
      <path d="M8 15.5 Q12 17 16 15.5 Q15.5 19 12 19.5 Q8.5 19 8 15.5" fill="url(#dijkstra-gradient)" opacity="0.6"/>
      <line x1="12" y1="16" x2="12" y2="19" stroke="url(#dijkstra-gradient)" strokeWidth="0.8" opacity="0.8"/>

      {/* Tie */}
      <path d="M11.5 16.5 Q12 18 12.5 16.5 Q12 17.5 11.5 16.5" fill="url(#dijkstra-gradient)" opacity="0.9"/>

      {/* Dutch features - clean appearance */}
      <path d="M9 13.5 Q10 13.8 11 13.5" stroke="#d1d5db" strokeWidth="0.2" fill="none" opacity="0.6"/>
      <path d="M13 13.5 Q14 13.8 15 13.5" stroke="#d1d5db" strokeWidth="0.2" fill="none" opacity="0.6"/>
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

      {/* Head/Face */}
      <ellipse cx="12" cy="9.5" rx="4.2" ry="5" fill="url(#grace-face-gradient)" stroke="url(#hopper-gradient)" strokeWidth="0.5"/>

      {/* 1940s-style hair */}
      <path d="M7.8 5.5 Q12 4 16.2 5.5 Q16.5 7 15.5 8 Q14 6.5 12 6.5 Q10 6.5 8.5 8 Q7.5 7 7.8 5.5" fill="url(#hopper-gradient)" opacity="0.8"/>
      <path d="M8.5 7 Q9.5 6 11 6.8 Q12 6.5 13 6.8 Q14.5 6 15.5 7 Q15 8 12 7.5 Q9 8 8.5 7" fill="url(#hopper-gradient)" opacity="0.6"/>

      {/* Victory roll hairstyle */}
      <ellipse cx="9.5" cy="6.8" rx="1" ry="0.6" fill="url(#hopper-gradient)" opacity="0.7"/>
      <ellipse cx="14.5" cy="6.8" rx="1" ry="0.6" fill="url(#hopper-gradient)" opacity="0.7"/>

      {/* Eyes - determined look */}
      <ellipse cx="10.5" cy="9" rx="0.7" ry="0.6" fill="#1f2937"/>
      <ellipse cx="13.5" cy="9" rx="0.7" ry="0.6" fill="#1f2937"/>
      <circle cx="10.7" cy="8.8" r="0.2" fill="white"/>
      <circle cx="13.7" cy="8.8" r="0.2" fill="white"/>

      {/* Strong eyebrows */}
      <path d="M9.5 8 Q10.5 7.7 11.5 8" stroke="#1f2937" strokeWidth="0.4" fill="none"/>
      <path d="M12.5 8 Q13.5 7.7 14.5 8" stroke="#1f2937" strokeWidth="0.4" fill="none"/>

      {/* Nose */}
      <path d="M12 10.2 L11.8 10.8 L12.2 10.8 Z" fill="#d1d5db"/>

      {/* Mouth - confident smile */}
      <path d="M11 12 Q12 12.5 13 12" stroke="#be185d" strokeWidth="0.4" fill="none"/>

      {/* Naval uniform - high collar */}
      <path d="M8 14.5 Q12 16 16 14.5 Q15.8 18 12 18.5 Q8.2 18 8 14.5" fill="url(#hopper-gradient)" opacity="0.7"/>
      <rect x="11.5" y="15.5" width="1" height="2.5" fill="url(#hopper-gradient)" opacity="0.9"/>

      {/* Naval insignia */}
      <circle cx="9.5" cy="16" r="0.4" fill="#fbbf24" opacity="0.9"/>
      <circle cx="14.5" cy="16" r="0.4" fill="#fbbf24" opacity="0.9"/>

      {/* Strong jawline */}
      <path d="M8.5 12.5 Q12 14 15.5 12.5" stroke="#d1d5db" strokeWidth="0.2" fill="none" opacity="0.5"/>

      {/* Collar details */}
      <path d="M9 15 Q12 16 15 15" stroke="url(#hopper-gradient)" strokeWidth="0.5" fill="none" opacity="0.9"/>
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

      {/* Head/Face */}
      <ellipse cx="12" cy="10" rx="4.3" ry="5.3" fill="url(#tim-face-gradient)" stroke="url(#web-gradient)" strokeWidth="0.5"/>

      {/* Thinning hair - receding hairline */}
      <path d="M8.5 6 Q12 4.5 15.5 6 Q15 7.5 14 7.5 Q12 6.5 10 7.5 Q9 7.5 8.5 6" fill="url(#web-gradient)" opacity="0.7"/>
      <path d="M9.5 6.8 Q12 6 14.5 6.8" stroke="url(#web-gradient)" strokeWidth="0.2" opacity="0.5"/>

      {/* Eyes behind glasses */}
      <circle cx="10.5" cy="9.5" r="0.6" fill="#1f2937"/>
      <circle cx="13.5" cy="9.5" r="0.6" fill="#1f2937"/>
      <circle cx="10.7" cy="9.3" r="0.2" fill="white"/>
      <circle cx="13.7" cy="9.3" r="0.2" fill="white"/>

      {/* Glasses - rectangular frames */}
      <rect x="9" y="8.5" width="2.5" height="2" rx="0.3" fill="none" stroke="url(#web-gradient)" strokeWidth="0.6" opacity="0.8"/>
      <rect x="12.5" y="8.5" width="2.5" height="2" rx="0.3" fill="none" stroke="url(#web-gradient)" strokeWidth="0.6" opacity="0.8"/>
      <line x1="11.5" y1="9.5" x2="12.5" y2="9.5" stroke="url(#web-gradient)" strokeWidth="0.5" opacity="0.8"/>

      {/* Eyebrows */}
      <path d="M9.2 8.2 Q10.2 7.9 11.2 8.2" stroke="#1f2937" strokeWidth="0.3" fill="none"/>
      <path d="M12.8 8.2 Q13.8 7.9 14.8 8.2" stroke="#1f2937" strokeWidth="0.3" fill="none"/>

      {/* Nose */}
      <path d="M12 11 L11.8 11.5 L12.2 11.5 Z" fill="#d1d5db"/>

      {/* Mouth - thoughtful expression */}
      <path d="M11 12.8 Q12 13.1 13 12.8" stroke="#1f2937" strokeWidth="0.4" fill="none"/>

      {/* Casual attire - open collar */}
      <path d="M8.5 15 Q12 16.5 15.5 15 Q15.2 18.5 12 19 Q8.8 18.5 8.5 15" fill="url(#web-gradient)" opacity="0.5"/>
      <path d="M10 16 Q12 17 14 16" stroke="url(#web-gradient)" strokeWidth="0.5" fill="none" opacity="0.7"/>

      {/* Collar - casual shirt */}
      <path d="M10.5 15.5 L11.5 16.5 L12.5 16.5 L13.5 15.5" stroke="url(#web-gradient)" strokeWidth="0.6" fill="none" opacity="0.8"/>

      {/* British features - slight jaw definition */}
      <path d="M8.8 13 Q12 14.2 15.2 13" stroke="#d1d5db" strokeWidth="0.2" fill="none" opacity="0.6"/>
    </svg>
  )
}