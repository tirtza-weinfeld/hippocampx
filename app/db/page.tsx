import { Suspense } from "react";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { getTableStats } from "@/lib/db-viewer/queries";

export const metadata = {
  title: "Database Explorer",
  description: "Browse tables and visualize schema relationships",
};

async function DatabaseLanding() {
  'use cache'
  cacheLife('hours')
  const stats = await getTableStats();
  const neonCount = stats.filter(t => t.provider === "neon").length;
  const vercelCount = stats.filter(t => t.provider === "vercel").length;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-linear-to-br from-transparent via-db-surface to-transparent">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="inline-flex items-center justify-center mb-8">
          <div className="size-24 rounded-3xl bg-gradient-to-br from-db-neon/15 via-transparent to-db-vercel/15 flex items-center justify-center">
            <svg
              className="size-12 text-db-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-db-text mb-4">
          Database Explorer
        </h1>

        {/* Description */}
        <p className="text-lg text-db-text-muted mb-8">
          <span className="font-semibold text-db-text">{stats.length} tables</span> across{" "}
          <span className="font-semibold text-db-neon">{neonCount} Neon</span> and{" "}
          <span className="font-semibold text-db-vercel">{vercelCount} Vercel</span> databases
        </p>

        {/* Navigation Cards */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Tables Card */}
          <Link
            href="/db/tables"
            className="group p-6 rounded-2xl bg-db-surface-raised/50 hover:bg-db-surface-raised border border-db-border/30 hover:border-db-neon/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="size-14 rounded-xl bg-gradient-to-br from-db-neon/20 to-db-neon/5 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <svg
                className="size-7 text-db-neon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M13.125 18.375v-1.5m0 0c-.621 0-1.125-.504-1.125-1.125m1.125 1.125h7.5"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-db-text mb-2">Browse Tables</h2>
            <p className="text-sm text-db-text-muted">
              View, search, and query your database tables
            </p>
          </Link>

          {/* Diagram Card */}
          <Link
            href="/db/diagram"
            className="group p-6 rounded-2xl bg-db-surface-raised/50 hover:bg-db-surface-raised border border-db-border/30 hover:border-db-vercel/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="size-14 rounded-xl bg-gradient-to-br from-db-vercel/20 to-db-vercel/5 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <svg
                className="size-7 text-db-vercel"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-db-text mb-2">ER Diagram</h2>
            <p className="text-sm text-db-text-muted">
              Visualize schema relationships and foreign keys
            </p>
          </Link>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-db-surface-raised/50">
            <span className="size-2 rounded-full bg-db-neon animate-pulse" />
            <span className="text-sm font-medium text-db-text-muted">Neon Connected</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-db-surface-raised/50">
            <span className="size-2 rounded-full bg-db-vercel animate-pulse" />
            <span className="text-sm font-medium text-db-text-muted">Vercel Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingSkeleton() {
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

export default function Page() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <DatabaseLanding />
    </Suspense>
  );
}
