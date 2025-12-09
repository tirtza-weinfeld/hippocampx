"use client";

import { useRef, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Route } from "next";
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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildUrl(query: string, language: string): Route {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    if (language !== "en") {
      params.set("lang", language);
    }

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
    return (queryString ? `${pathname}?${queryString}` : pathname) as Route;
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    const currentLang = searchParams.get("lang") || "en";

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(function navigateAfterDebounce() {
      startTransition(function updateUrl() {
        router.push(buildUrl(newQuery, currentLang));
      });
    }, DEBOUNCE_DELAY);
  }

  function handleLanguageChange(newLanguage: string) {
    const currentQuery = searchParams.get("q") || "";

    startTransition(function updateUrl() {
      router.push(buildUrl(currentQuery, newLanguage));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Label htmlFor="dict-search" className="sr-only">
            Search words
          </Label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dict-text-tertiary" />
          <Input
            id="dict-search"
            type="search"
            placeholder="Search all words..."
            defaultValue={initialQuery || ""}
            onChange={handleQueryChange}
            className="pl-9 h-10 text-sm bg-dict-surface-1 border-dict-border text-dict-text placeholder:text-dict-text-tertiary focus:border-dict-border-focus focus:ring-2 focus:ring-dict-focus-ring shadow-dict-inner"
          />
          {/* {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 rounded-full border-2 border-dict-primary border-t-transparent animate-spin" />
            </div>
          )} */}
        </div>
        <div className="w-full sm:w-40">
          <Label htmlFor="dict-language" className="sr-only">
            Language
          </Label>
          <Select defaultValue={initialLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger
              id="dict-language"
              className="h-10 text-sm bg-dict-surface-1 border-dict-border text-dict-text shadow-dict-inner"
            >
              <Globe className="h-4 w-4 text-dict-text-tertiary mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dict-glass border-dict-border shadow-dict-md">
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
