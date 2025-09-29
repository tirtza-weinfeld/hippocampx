import { Brain, Binary, Sparkles, InfinityIcon, ChartNoAxesCombinedIcon, Home, Calculator, BookOpen, HelpCircle, Dumbbell, Lightbulb, Gamepad2, SquareFunction, Code } from "lucide-react"
import { ElementType } from "react"
import { PROBLEMS_ROUTES } from "./problems-routes"

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
    // {
    //     title: 'Fundamentals', href: '/fundamentals', icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10",
    //     children: [
    //         { title: 'Linear Algebra', href: '/fundamentals/linear-algebra', icon: Code, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    //         { title: 'Set Theory', href: '/fundamentals/set-theory', icon: Code, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    //         { title: 'Number Sets', href: '/fundamentals/number-sets', icon: Code, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    //         { title: 'Math', href: '/fundamentals/math', icon: Code, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    //     ]
    // },


    {
        title: 'Binary', href: '/binary', icon: Binary, color: "text-violet-500", bgColor: "bg-violet-500/10",
        children: [
            { title: 'Learn', href: '/binary', icon: BookOpen, color: "text-violet-500", bgColor: "bg-violet-500/10" },
            { title: 'Convert', href: '/binary/convert', icon: Calculator, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'How To', href: '/binary/explain', icon: HelpCircle, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
            { title: 'Practice', href: '/binary/practice', icon: Dumbbell, color: "text-purple-500", bgColor: "bg-purple-500/10" },
            { title: 'Fun Facts', href: '/binary/fun', icon: Lightbulb, color: "text-pink-500", bgColor: "bg-pink-500/10" },
            { title: 'Play', href: '/binary/play', icon: Gamepad2, color: "text-rose-500", bgColor: "bg-rose-500/10" },
        ],
    },
    {
        title: 'AI', href: '/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10",
        children: [
            { title: 'What is AI?', href: '/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Train ML', href: '/ai/train-ml', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Advanced Ai', href: '/ai/advanced', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Robot Friend', href: '/ai/robot-friend', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Fun Quiz', href: '/ai/quiz', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" }
        ],
    },
    { title: 'Hadestown', href: '/hadestown', icon: Sparkles, color: "text-green-500", bgColor: "bg-green-500/10", },
    { title: 'Infinity', href: '/infinity', icon: InfinityIcon, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    {
        title: "Calculus", href: "/calculus", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10",
        children: [
            { title: "Overview", href: "/calculus", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Learning Paths", href: "/calculus/learning-paths", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Games", href: "/calculus/games", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Lab", href: "/calculus/lab", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        ],
    },
    ...PROBLEMS_ROUTES,
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
