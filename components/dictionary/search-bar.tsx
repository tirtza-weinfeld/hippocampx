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

  useEffect(function syncSearchParams() {
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
  }, [debouncedQuery, language, router, searchParams, pathname]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Search words
        </Label>
        <Input
          id="search"
          type="search"
          placeholder="Search words..."
          value={query}
          onChange={function handleQueryChange(e) {
            setQuery(e.target.value);
          }}
          className="w-full"
        />
      </div>
      <div className="w-full sm:w-48">
        <Label htmlFor="language" className="sr-only">
          Language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
