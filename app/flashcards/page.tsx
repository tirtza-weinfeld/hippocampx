import Learn from "@/components/falshcards/learn";
import { getTerms, getTermsCategoriesMap  } from "@/lib/db/query";

export default function LearnPage() {

    const termsPromise = getTerms();
    const categoriesPromise = getTermsCategoriesMap();

    return (
        <div className="h-full w-full">
            <Learn termsPromise={termsPromise} categoriesPromise={categoriesPromise} />
        </div>
    )
}