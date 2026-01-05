import Link from "next/link";
import { Calculator, Puzzle,
  // Lock 
} from "lucide-react";

const games = [
  {
    title: "Formula Match",
    description: "Match mathematical formulas with their names. Test your knowledge of calculus, algebra, and more.",
    href: "/games/formula-match",
    icon: Calculator,
  },
  {
    title: "Memory Match",
    description: "Classic card matching game. Flip cards and find pairs to train your memory.",
    href: "/games/memory-match",
    icon: Puzzle,
  },
  // {
  //   title: "Word Vault",
  //   description: "",
  //   href: "/games/word-vault",
  //   icon: Lock,
  // },
  
] as const;

export default function GamesPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gradient-games-title w-fit">
          Games
        </h1>
        <p className="mt-3 text-lg text-gradient-games-muted w-fit">
          Learn through play. Pick a game and challenge yourself.
        </p>
      </header>

      <div className="grid gap-6 @sm/games:grid-cols-2 @lg/games:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="glass-games-surface rounded-2xl p-6 shadow-xl transition-all duration-300
             hover:scale-[1.02] hover:shadow-2xl hover:glow-games-glow/20"
          >
            <span className="inline-flex size-14 items-center justify-center rounded-xl
             bg-gradient-games-icon-bg shadow-lg">
              <game.icon className="size-8 text-games-icon-start" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-gradient-games-text">{game.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gradient-games-muted">{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}