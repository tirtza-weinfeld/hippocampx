import { cn } from "@/lib/utils";

// HippoLogo component
export function HippoLogo({ size = 40, animate = false }: { size?: number; animate?: boolean }) {
    return (
      <div
        className={cn("relative block", animate && "animate-float")}
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Hippo body */}
        <div
          className="absolute rounded-[60%_60%_50%_50%/70%_70%_40%_40%] bg-gradient-to-br from-teal-400 to-blue-600"
          style={{
            width: size,
            height: size * 1.1,
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
  
        {/* Left ear */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-teal-400 to-blue-600"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: size * 0.05,
            left: size * -0.05,
            zIndex: 2,
          }}
        />
  
        {/* Right ear */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-teal-400 to-blue-600"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: size * 0.05,
            right: size * -0.05,
            zIndex: 2,
          }}
        />
  
        {/* Left eye */}
        <div
          className="absolute bg-white rounded-full border-2 border-gray-800/20"
          style={{
            width: size * 0.17,
            height: size * 0.17,
            top: size * 0.3,
            left: size * 0.2,
            zIndex: 3,
          }}
        />
  
        {/* Right eye */}
        <div
          className="absolute bg-white rounded-full border-2 border-gray-800/20"
          style={{
            width: size * 0.17,
            height: size * 0.17,
            top: size * 0.3,
            right: size * 0.2,
            zIndex: 3,
          }}
        />
  
        {/* Left pupil */}
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: size * 0.35,
            left: size * 0.25,
            zIndex: 4,
          }}
        />
  
        {/* Right pupil */}
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: size * 0.35,
            right: size * 0.25,
            zIndex: 4,
          }}
        />
  
        {/* Nose */}
        <div
          className="absolute bg-gray-800 rounded-[50%_50%_60%_60%/50%_50%_70%_70%]"
          style={{
            width: size * 0.25,
            height: size * 0.175,
            top: size * 0.55,
            left: size * 0.375,
            zIndex: 5,
          }}
        />
  
        {/* Left nostril */}
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: size * 0.04,
            height: size * 0.05,
            top: size * 0.6,
            left: size * 0.425,
            zIndex: 6,
          }}
        />
  
        {/* Right nostril */}
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: size * 0.04,
            height: size * 0.05,
            top: size * 0.6,
            right: size * 0.425,
            zIndex: 6,
          }}
        />
  
        {/* Mouth */}
        <div
          className="absolute border-b-2 border-l-[1.5px] border-r-[1.5px] border-black/60 rounded-b-[50%]"
          style={{
            width: size * 0.35,
            height: size * 0.2,
            top: size * 0.7,
            left: size * 0.325,
            zIndex: 5,
          }}
        />
  
        {/* X mark for the "X" in HippoCampX */}
        <div
          className="absolute flex items-center justify-center font-bold text-black/60"
          style={{
            width: size * 0.3,
            height: size * 0.3,
            top: size * 0.75,
            left: size * 0.35,
            fontSize: size * 0.2,
            zIndex: 7,
          }}
        >
          X
        </div>
      </div>
    )
  }