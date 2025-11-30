"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Route } from "next";
import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Globe, Database, FileText } from "lucide-react";

const DEBOUNCE_DELAY = 300;

type SearchScope = "page" | "database";

export function SearchBar({
  initialQuery,
  initialLanguage,
  onClientFilterChange,
}: {
  initialQuery?: string;
  initialLanguage: string;
  onClientFilterChange?: (filter: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery || "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery || "");
  const [language, setLanguage] = useState(initialLanguage);
  const [scope, setScope] = useState<SearchScope>("database");

  useEffect(function debounceQuery() {
    const timer = setTimeout(function updateDebouncedQuery() {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return function cleanup() {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(
    function syncSearchParams() {
      if (scope === "page") {
        return;
      }

      const params = new URLSearchParams();
      const currentQuery = debouncedQuery.trim();

      if (currentQuery) {
        params.set("q", currentQuery);
      }

      if (language !== "en") {
        params.set("lang", language);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      const currentUrl = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      if (newUrl !== currentUrl) {
        startTransition(function updateUrl() {
          router.push(newUrl as Route);
        });
      }
    },
    [debouncedQuery, language, router, searchParams, pathname, scope]
  );

  useEffect(
    function syncClientFilter() {
      if (scope === "page" && onClientFilterChange) {
        onClientFilterChange(query);
      }
    },
    [query, scope, onClientFilterChange]
  );

  function handleScopeChange(newScope: SearchScope) {
    setScope(newScope);
    if (newScope === "page") {
      if (onClientFilterChange) {
        onClientFilterChange(query);
      }
    } else {
      if (onClientFilterChange) {
        onClientFilterChange("");
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Label htmlFor="search" className="sr-only">
            Search words
          </Label>
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="search"
            placeholder={
              scope === "page" ? "Filter current page..." : "Search all words..."
            }
            value={query}
            onChange={function handleQueryChange(e) {
              setQuery(e.target.value);
            }}
            className="pl-8 h-9 text-sm border-border/50"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-border/50 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={function handlePageScope() {
                handleScopeChange("page");
              }}
              className={`h-7 px-2.5 text-xs gap-1.5 ${
                scope === "page"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3 w-3" />
              Page
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={function handleDatabaseScope() {
                handleScopeChange("database");
              }}
              className={`h-7 px-2.5 text-xs gap-1.5 ${
                scope === "database"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Database className="h-3 w-3" />
              All
            </Button>
          </div>
          <div className="w-full sm:w-36">
            <Label htmlFor="language" className="sr-only">
              Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                id="language"
                className="h-9 text-sm border-border/50"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border border-border/50 shadow-lg ring-1 ring-black/5 bg-popover/95 backdrop-blur-xl">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
