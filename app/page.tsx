import Image from "next/image"

const floatingWords = [
  { text: "Learn", position: "top-[15%] left-[10%] sm:left-[15%]", delay: "delay-0" },
  { text: "Remember", position: "top-[20%] right-[8%] sm:right-[12%]", delay: "delay-100" },
  { text: "Grow", position: "bottom-[25%] left-[8%] sm:left-[18%]", delay: "delay-200" },
  { text: "Think", position: "bottom-[18%] right-[10%] sm:right-[15%]", delay: "delay-300" },
]

export default function HomePage() {
  return (
    <div className="group/page relative min-h-screen w-full flex flex-col items-center justify-center gap-4 sm:gap-6 overflow-hidden px-4">
      {/* Layered background - blends into app */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent dark:via-indigo-500/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/3 to-transparent dark:via-teal-500/5" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-primary/5 via-transparent to-transparent" />

      {/* Hippocampus watermark - subtle background brain */}
      <Image
        src="/hippo/hippocampus-hippo.png"
        alt=""
        width={600}
        height={600}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] sm:size-[400px] md:size-[500px] object-contain opacity-[0.03] dark:opacity-[0.05] pointer-events-none mask-radial-from-40% mask-radial-at-center transition-all duration-1000 group-hover/page:opacity-[0.06] group-hover/page:mask-radial-from-60% dark:group-hover/page:opacity-[0.08] group-hover/page:scale-105"
      />

      {/* Floating learning words - orbit around on hover */}
      {floatingWords.map((word) => (
        <span
          key={word.text}
          className={`absolute ${word.position} ${word.delay}
           text-sm sm:text-base font-medium text-muted-foreground/5 
           transition-all duration-700 ease-out group-hover/page:text-primary/60
            group-hover/page:scale-110 group-active/page:text-primary/60`}
        >
          {word.text}
        </span>
      ))}

      {/* Title */}
      <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold transition-all duration-700 ease-out cursor-pointer bg-gradient-to-r from-indigo-500 to-teal-400 bg-clip-text text-transparent hover:scale-105 sm:hover:scale-110 hover:rotate-2 sm:hover:rotate-3 active:scale-95">
        HippoCampX
      </h1>

      {/* Hippocampus tagline */}
      <p className="relative z-10 text-xs sm:text-sm text-muted-foreground/50 -mt-2 sm:-mt-3 tracking-widest uppercase">
        Memory &middot; Learning &middot; Growth
      </p>

      {/* Main hippo container */}
      <div className="group/hippo relative cursor-pointer transition-all duration-500 mt-2 sm:mt-4">
        {/* Outer glow ring */}
        <div className="absolute -inset-8 sm:-inset-12 rounded-full bg-gradient-to-r from-indigo-500/0 via-teal-400/0 to-indigo-500/0 group-hover/hippo:from-indigo-500/10 group-hover/hippo:via-teal-400/15 group-hover/hippo:to-indigo-500/10 blur-2xl sm:blur-3xl transition-all duration-700 group-active/hippo:from-indigo-500/20 group-active/hippo:via-teal-400/25 group-active/hippo:to-indigo-500/20" />

        {/* Inner glow pulse */}
        <div className="absolute inset-4 rounded-full bg-teal-400/0 group-hover/hippo:bg-teal-400/10 blur-xl transition-all duration-500 group-hover/hippo:animate-pulse" />

        {/* Main hippo - spotlight reveal */}
        <Image
          src="/hippo/dark-hippo-floating-brain.png"
          alt="HippoCampX mascot"
          width={280}
          height={280}
          priority
          className="relative z-10 size-48 sm:size-56 md:size-72 object-contain drop-shadow-xl transition-all duration-500 ease-out mask-radial-from-50% mask-radial-at-center group-hover/hippo:mask-radial-from-100% group-active/hippo:mask-radial-from-100% group-hover/hippo:scale-105 group-hover/hippo:rotate-3 group-active/hippo:scale-95 group-hover/hippo:drop-shadow-2xl animate-float"
        />

        {/* Companion hippo - peeks from bottom right */}
        <Image
          src="/hippo/hippo.png"
          alt=""
          width={80}
          height={80}
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 size-12 sm:size-16 object-contain transition-all duration-500 ease-out opacity-0 translate-y-4 translate-x-2 group-hover/hippo:opacity-100 group-hover/hippo:translate-y-0 group-hover/hippo:translate-x-0 group-active/hippo:opacity-100 group-active/hippo:translate-y-0 group-active/hippo:translate-x-0 mask-t-from-40% mask-l-from-50% group-hover/hippo:mask-t-from-90% group-hover/hippo:mask-l-from-90% group-hover/hippo:rotate-12"
        />

        {/* Floating concept badges - appear on hover */}
        <span className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-indigo-500/0 text-indigo-500/0 border border-indigo-500/0 transition-all duration-500 group-hover/hippo:bg-indigo-500/10 group-hover/hippo:text-indigo-500 group-hover/hippo:border-indigo-500/30 group-active/hippo:bg-indigo-500/10 group-active/hippo:text-indigo-500 group-active/hippo:border-indigo-500/30">
          Hippocampus
        </span>

        <span className="absolute top-1/4 -left-12 sm:-left-16 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-teal-500/0 text-teal-500/0 border border-teal-500/0 transition-all duration-500 delay-100 group-hover/hippo:bg-teal-500/10 group-hover/hippo:text-teal-500 group-hover/hippo:border-teal-500/30 group-active/hippo:bg-teal-500/10 group-active/hippo:text-teal-500 group-active/hippo:border-teal-500/30">
          Encode
        </span>

        <span className="absolute top-1/3 -right-10 sm:-right-14 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-violet-500/0 text-violet-500/0 border border-violet-500/0 transition-all duration-500 delay-200 group-hover/hippo:bg-violet-500/10 group-hover/hippo:text-violet-500 group-hover/hippo:border-violet-500/30 group-active/hippo:bg-violet-500/10 group-active/hippo:text-violet-500 group-active/hippo:border-violet-500/30">
          Recall
        </span>

        <span className="absolute bottom-1/4 -left-10 sm:-left-14 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-amber-500/0 text-amber-500/0 border border-amber-500/0 transition-all duration-500 delay-300 group-hover/hippo:bg-amber-500/10 group-hover/hippo:text-amber-500 group-hover/hippo:border-amber-500/30 group-active/hippo:bg-amber-500/10 group-active/hippo:text-amber-500 group-active/hippo:border-amber-500/30">
          Retain
        </span>
      </div>

      {/* Subtitle */}
      <p className="relative z-10 text-muted-foreground text-base sm:text-lg transition-all duration-500 mt-2">
        Your brain&apos;s best friend
      </p>

      {/* Fun fact tooltip */}
      <p className="max-w-xs sm:max-w-sm text-center text-xs text-muted-foreground/40 transition-all duration-500 opacity-0 group-hover/page:opacity-100 group-active/page:opacity-100">
        The hippocampus is a seahorse-shaped brain region essential for forming new memories
      </p>
    </div>
  )
}


