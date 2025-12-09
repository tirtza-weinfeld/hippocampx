"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Route } from "next";
import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Globe } from "lucide-react";

const DEBOUNCE_DELAY = 300;

export function SearchBar({
  initialQuery,
  initialLanguage,
}: {
  initialQuery?: string;
  initialLanguage: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery || "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery || "");
  const [language, setLanguage] = useState(initialLanguage);

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
      const params = new URLSearchParams();
      const currentQuery = debouncedQuery.trim();

      if (currentQuery) {
        params.set("q", currentQuery);
      }

      if (language !== "en") {
        params.set("lang", language);
      }

      // Preserve filter params (tag, source, part)
      searchParams.getAll("tag").forEach(function appendTag(tag) {
        params.append("tag", tag);
      });
      searchParams.getAll("source").forEach(function appendSource(source) {
        params.append("source", source);
      });
      searchParams.getAll("part").forEach(function appendPart(part) {
        params.append("part", part);
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Compare only q and lang to decide if we need to update
      const currentQ = searchParams.get("q") || "";
      const currentLang = searchParams.get("lang") || "en";
      const newQ = currentQuery;
      const newLang = language;

      if (currentQ !== newQ || currentLang !== newLang) {
        startTransition(function updateUrl() {
          router.push(newUrl as Route);
        });
      }
    },
    [debouncedQuery, language, router, searchParams, pathname]
  );

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
            placeholder="Search all words..."
            value={query}
            onChange={function handleQueryChange(e) {
              setQuery(e.target.value);
            }}
            className="pl-8 h-9 text-sm border-border/50"
          />
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
  );
}
