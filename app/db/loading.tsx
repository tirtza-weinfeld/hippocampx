export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <div className="text-center max-w-2xl">
        <div className="size-24 mx-auto rounded-3xl bg-db-border/30 animate-pulse mb-8" />
        <div className="h-10 w-64 mx-auto bg-db-border/40 rounded animate-pulse mb-4" />
        <div className="h-6 w-80 mx-auto bg-db-border/30 rounded animate-pulse mb-8" />
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="p-6 rounded-2xl bg-db-border/20 animate-pulse h-40" />
          <div className="p-6 rounded-2xl bg-db-border/20 animate-pulse h-40" />
        </div>
      </div>
    </div>
  );
}
