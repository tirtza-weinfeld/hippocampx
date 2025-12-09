import { Brain, Binary, Sparkles, InfinityIcon, ChartNoAxesCombinedIcon, Home, Calculator, BookOpen, HelpCircle, Dumbbell, Lightbulb, Gamepad2, Pencil, Music, Flower, Puzzle, BookMarked } from "lucide-react"
import { ElementType } from "react"
// import { PROBLEMS_ROUTES } from "./problems-routes"

export type NavigationItem = {
    title: string
    icon: ElementType
    color: string
    bgColor: string
    href: string
    children?: NavigationItem[]
}

export const routes: NavigationItem[] = [
    { title: 'Home', href: '/', icon: Home, color: "text-blue-500", bgColor: "bg-purple-500/10", },
    // { title: 'New Calculus', href: '/calculus', icon: Home, color: "text-blue-500", bgColor: "bg-purple-500/10", },
    // { title: 'New Algebra', href: '/algebra', icon: Home, color: "text-blue-500", bgColor: "bg-purple-500/10", },
    // { title: 'New AI', href: '/ai', icon: Home, color: "text-blue-500", bgColor: "bg-purple-500/10", },
    // { title: 'Dictionary', href: '/dictionary', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10", },

    // {
    //     title: 'Dictionary', href: '/dictionary', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10",
       
    // },
    {
        title: 'Binary', href: 'old/binary', icon: Binary, color: "text-violet-500", bgColor: "bg-violet-500/10",
        children: [
            { title: 'Learn', href: '/old/binary', icon: BookOpen, color: "text-violet-500", bgColor: "bg-violet-500/10" },
            { title: 'Convert', href: '/old/binary/convert', icon: Calculator, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'How To', href: '/old/binary/explain', icon: HelpCircle, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
            { title: 'Practice', href: '/old/binary/practice', icon: Dumbbell, color: "text-purple-500", bgColor: "bg-purple-500/10" },
            { title: 'Fun Facts', href: '/old/binary/fun', icon: Lightbulb, color: "text-pink-500", bgColor: "bg-pink-500/10" },
            { title: 'Play', href: '/old/binary/play', icon: Gamepad2, color: "text-rose-500", bgColor: "bg-rose-500/10" },
        ],
    },
    {
        title: 'AI', href: '/old/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10",
        children: [
            { title: 'What is AI?', href: '/old/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Train ML', href: '/old/ai/train-ml', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Advanced Ai', href: '/old/ai/advanced', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Robot Friend', href: '/old/ai/robot-friend', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Fun Quiz', href: '/old/ai/quiz', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" }
        ],
    },
    {
        title: 'Hadestown', href: '/old/hadestown', icon: Sparkles, color: "text-amber-500", bgColor: "bg-amber-500/10",
        children: [
            { title: 'Overview', href: '/old/hadestown', icon: Sparkles, color: "text-amber-500", bgColor: "bg-amber-500/10" },
            { title: 'Spelling', href: '/old/hadestown/games/spelling', icon: Pencil, color: "text-amber-600", bgColor: "bg-amber-500/10" },
            { title: 'Vocabulary', href: '/old/hadestown/games/vocabulary', icon: BookOpen, color: "text-amber-600", bgColor: "bg-amber-500/10" },
            { title: 'Lyrics Game', href: '/old/hadestown/games/lyrics', icon: Music, color: "text-amber-600", bgColor: "bg-amber-500/10" },
            { title: 'Seasons', href: '/old/hadestown/games/seasons', icon: Flower, color: "text-amber-600", bgColor: "bg-amber-500/10" },
            { title: 'Word Memory', href: '/old/hadestown/games/word-memory', icon: Puzzle, color: "text-amber-600", bgColor: "bg-amber-500/10" },
            { title: 'Lyrics Explorer', href: '/old/hadestown/lyrics-explorer', icon: Music, color: "text-amber-500", bgColor: "bg-amber-500/10" },
            { title: 'Story', href: '/old/hadestown/story', icon: BookMarked, color: "text-amber-500", bgColor: "bg-amber-500/10" },
        ],
    },
    { title: 'Infinity', href: '/old/infinity', icon: InfinityIcon, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    {
        title: "Calculus", href: "/old/calculus", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10",
        children: [
            { title: "Overview", href: "/old/calculus", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Learning Paths", href: "/old/calculus/learning-paths", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Games", href: "/old/calculus/games", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Lab", href: "/old/calculus/lab", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        ],
    },
    // ...PROBLEMS_ROUTES,
    {
        title: 'Notes', href: '/notes', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10",
        children: [
            { title: 'sliding-window', href: '/notes/sliding-window', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'kadane', href: '/notes/kadane', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'stocks', href: '/notes/stocks', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'games', href: '/notes/games', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'backtrack', href: '/notes/backtrack', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'trie', href: '/notes/trie', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'dp', href: '/notes/dp', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'binary-search', href: '/notes/binary-search', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'bfs', href: '/notes/bfs', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Dijkstra', href: '/notes/dijkstra', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'A*', href: '/notes/a-star', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Bellman-Ford', href: '/notes/bellman-ford', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Cache', href: '/notes/cache', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Prefix Sum', href: '/notes/prefix-sum', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Modular Arithmetic', href: '/notes/modular-arithmetic', icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },


        ],
    },


]
