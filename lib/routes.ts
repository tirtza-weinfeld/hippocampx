import { Brain, Binary, Sparkles, InfinityIcon, ChartNoAxesCombinedIcon } from "lucide-react"

export type NavigationItem = {
    title: string
    icon: React.ElementType
    color: string
    bgColor: string
    href  : string 
    children?: NavigationItem[] 
}
export const routes: NavigationItem[] = [
    // { title: 'Home', href: '/', icon: Home, color: "text-blue-500", bgColor: "bg-purple-500/10", },
    
    { title: 'Binary', href: '/binary', icon: Binary, color: "text-violet-500", bgColor: "bg-violet-500/10",
        // children: [
        //     { title: 'Learn', href: '/binary/learn' },
        //     { title: 'Practice', href: '/binary/practice' },
        //     { title: 'Games', href: '/binary/games' },
        // ],
     },
    { title: 'AI', href: '/ai', icon: Brain, color: "text-blue-500", bgColor: "bg-blue-500/10",
        // children: [
        //     { title: 'What is AI?', href: '/ai/what-is-ai' },
        //     { title: 'Train ML', href: '/ai/train-ml' },
        //     { title: 'Robot Friend', href: '/ai/robot-friend' },
        //     { title: 'AI Quiz', href: '/ai/quiz' },
        //     { title: 'Advanced Concepts', href: '/ai/advanced' },
        //     { title: 'Games', href: '/ai/games' },
        //     { title: 'Lessons', href: '/ai/lessons' },
        //     { title: 'Tutorials', href: '/ai/tutorials' },
        // ],
     },
    { title: 'Hadestown', href: '/hadestown', icon: Sparkles, color: "text-green-500", bgColor: "bg-green-500/10", },
    { title: 'Infinity', href: '/infinity', icon: InfinityIcon, color: "text-yellow-500", bgColor: "bg-yellow-500/10", },
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
