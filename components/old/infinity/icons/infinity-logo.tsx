export function InfinityLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="infinityGradient" x1="0" y1="0" x2="120" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0091FF" />
          <stop offset="0.5" stopColor="#8000FF" />
          <stop offset="1" stopColor="#FF007F" />
        </linearGradient>
        <filter id="shadow" x="-2" y="-2" width="124" height="84" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path
          d="M85,40c0,11-9,20-20,20c-5,0-10-2-13-5c-3,3-8,5-13,5c-11,0-20-9-20-20s9-20,20-20c5,0,10,2,13,5c3-3,8-5,13-5C76,20,85,29,85,40z M39,55c7,0,12-7,12-15s-5-15-12-15s-12,7-12,15S32,55,39,55z M65,25c-7,0-12,7-12,15s5,15,12,15s12-7,12-15S72,25,65,25z"
          fill="url(#infinityGradient)"
          stroke="#222B45"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="39" cy="40" r="8" fill="url(#infinityGradient)" stroke="#222B45" strokeWidth="4" />
        <circle cx="65" cy="40" r="8" fill="url(#infinityGradient)" stroke="#222B45" strokeWidth="4" />

        {/* Fun face elements */}
        <circle cx="35" cy="36" r="3" fill="#FFFFFF" />
        <circle cx="43" cy="36" r="3" fill="#FFFFFF" />
        <path d="M34 44C34 44 37 47 39 47C41 47 44 44 44 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        <circle cx="61" cy="36" r="3" fill="#FFFFFF" />
        <circle cx="69" cy="36" r="3" fill="#FFFFFF" />
        <path d="M60 44C60 44 63 47 65 47C67 47 70 44 70 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

