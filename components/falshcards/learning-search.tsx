import { Input } from "../ui/input";

export default function LearningSearch({ setSearch }: { setSearch: (search: string) => void }) {
    return (
       
            <Input className="bg-transparent border-none
            
            
         w-full
        bg-accent/20 rounded-full cursor-pointer   border-none
text-foreground hover:text-accent transition-all ease-in-out duration-500  hover:scale-101
        
            " placeholder="Search" onChange={(e) => setSearch(e.target.value)} />

    )
}