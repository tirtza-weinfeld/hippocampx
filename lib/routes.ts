import { Brain, Binary, Sparkles, InfinityIcon, ChartNoAxesCombinedIcon, Home, Calculator, BookOpen, HelpCircle, Dumbbell, Lightbulb, Gamepad2 } from "lucide-react"

export type NavigationItem = {
    title: string
    icon: React.ElementType
    color: string
    bgColor: string
    href: string
    children?: NavigationItem[]
}
export const routes: NavigationItem[] = [
    { title: 'Home', href: '/', icon: Home, color: "text-blue-500", bgColor: "bg-purple-500/10", },

   
    {
        title: 'Binary',
        href: '/binary',
        icon: Binary,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        children: [
            {
                title: 'Learn',
                href: '/binary',
                icon: BookOpen,
                color: "text-violet-500",
                bgColor: "bg-violet-500/10"
            },
            {
                title: 'Convert',
                href: '/binary/convert',
                icon: Calculator,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10"
            },
            {
                title: 'How To',
                href: '/binary/explain',
                icon: HelpCircle,
                color: "text-indigo-500",
                bgColor: "bg-indigo-500/10"
            },
            {
                title: 'Practice',
                href: '/binary/practice',
                icon: Dumbbell,
                color: "text-purple-500",
                bgColor: "bg-purple-500/10"
            },
            {
                title: 'Fun Facts',
                href: '/binary/fun',
                icon: Lightbulb,
                color: "text-pink-500",
                bgColor: "bg-pink-500/10"
            },
            {
                title: 'Play',
                href: '/binary/play',
                icon: Gamepad2,
                color: "text-rose-500",
                bgColor: "bg-rose-500/10"
            },
        ],
    },
    {
        title: 'AI', href: '/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10",
        children: [
            { title: 'What is AI?', href: '/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Train ML', href: '/ai/train-ml', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Advanced Ai', href: '/ai/advanced', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Robot Friend', href: '/ai/robot-friend', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: 'Fun Quiz', href: '/ai/quiz', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10" },

         
        ],
    },
    { title: 'Hadestown', href: '/hadestown', icon: Sparkles, color: "text-green-500", bgColor: "bg-green-500/10", },
    {
        title: 'Infinity',
        href: '/infinity',
        icon: InfinityIcon,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10"
    },
    {
        title: "Calculus",
        href: "/calculus",
        icon: ChartNoAxesCombinedIcon,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        children: [
            { title: "Overview", href: "/calculus", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Learning Paths", href: "/calculus/learning-paths", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },

            { title: "Games", href: "/calculus/games", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
            { title: "Lab", href: "/calculus/lab", icon: ChartNoAxesCombinedIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        ],
    },


]
