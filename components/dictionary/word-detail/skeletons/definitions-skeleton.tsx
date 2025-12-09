import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BookText } from "lucide-react";

export function DefinitionsSkeleton() {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-50 to-purple-100/80 dark:from-violet-950/60 dark:to-purple-900/40 ring-1 ring-violet-200/50 dark:ring-violet-700/30">
          <BookText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Definitions</h2>
      </div>

      <div className="space-y-4">
        {/* {[1, 2, 3].map(function renderSkeleton(i) { */}
        {[1].map(function renderSkeleton(i) {
          return (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-6" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <div className="border-l-2 pl-4 py-2 border-muted">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
