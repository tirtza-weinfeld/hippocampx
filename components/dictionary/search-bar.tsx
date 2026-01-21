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
import { Search, Globe, X } from "lucide-react";
import { getDictionaryListActions } from "./store/dictionary-list-store";

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
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const currentLang = searchParams.get("lang") || "en";
    startTransition(function updateUrl() {
      router.push(buildUrl("", currentLang));
    });
  }

  function handleLanguageChange(newLanguage: string) {
    const currentLanguage = searchParams.get("lang") || "en";
    const currentQuery = searchParams.get("q") || "";
    const currentTagSlugs = searchParams.getAll("tag");
    const currentSourceSlugs = searchParams.getAll("source");
    const currentPartSlugs = searchParams.getAll("part");

    const storeActions = getDictionaryListActions();

    // Save current language filters before switching
    storeActions.saveLanguageFilters(currentLanguage, {
      query: currentQuery,
      tagSlugs: currentTagSlugs,
      sourceSlugs: currentSourceSlugs,
      sourcePartSlugs: currentPartSlugs,
    });

    // Get saved filters for new language (if any)
    const savedFilters = storeActions.getLanguageFilters(newLanguage);

    startTransition(function updateUrl() {
      if (savedFilters) {
        // Restore saved filters for the new language
        const params = new URLSearchParams();

        if (savedFilters.query) {
          params.set("q", savedFilters.query);
        }

        if (newLanguage !== "en") {
          params.set("lang", newLanguage);
        }

        savedFilters.tagSlugs.forEach((tag) => params.append("tag", tag));
        savedFilters.sourceSlugs.forEach((source) => params.append("source", source));
        savedFilters.sourcePartSlugs.forEach((part) => params.append("part", part));

        const queryString = params.toString();
        router.push((queryString ? `${pathname}?${queryString}` : pathname) as Route);
      } else {
        // No saved filters - navigate to clean state for new language
        const params = new URLSearchParams();
        if (newLanguage !== "en") {
          params.set("lang", newLanguage);
        }
        const queryString = params.toString();
        router.push((queryString ? `${pathname}?${queryString}` : pathname) as Route);
      }
    });
  }

  return (
    <div className="relative">
      <Label htmlFor="dict-search" className="sr-only">
        Search words
      </Label>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dict-text-tertiary" />
      <Input
        ref={inputRef}
        id="dict-search"
        type="text"
        placeholder="Search words..."
        defaultValue={initialQuery || ""}
        onChange={handleQueryChange}
        className="pl-9 pr-28 h-9 text-base sm:text-sm bg-dict-surface-1 border-dict-border
         text-dict-text placeholder:text-dict-text-tertiary focus:border-dict-border-focus 
         focus:ring-2 focus:ring-dict-focus-ring rounded-xl w-full"
      />
      {/* Clear button - positioned closer on mobile (icon-only lang), further on desktop (lang with text) */}
      {initialQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-dict-text-tertiary hover:text-dict-text hover:bg-dict-hover transition-colors"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
      {/* Language selector inside search */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <Select defaultValue={initialLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger
            id="dict-language"
            className="h-7 text-xs bg-dict-surface-2 border-0 text-dict-text-secondary rounded-lg hover:bg-dict-hover transition-colors px-2 gap-1"
          >
            <Globe className="h-3 w-3" />
            <span className="hidden md:inline" ><SelectValue /></span>
          </SelectTrigger>
          <SelectContent className="bg-dict-surface-1 border-dict-border rounded-xl shadow-dict-lg p-1">
            <SelectItem value="en" className="rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover">English</SelectItem>
            <SelectItem value="es" className="rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover">Spanish</SelectItem>
            <SelectItem value="fr" className="rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover">French</SelectItem>
            <SelectItem value="de" className="rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover">German</SelectItem>
            <SelectItem value="it" className="rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover">Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
