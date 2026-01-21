"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SourceOption, SourcePartOption } from "./types";

interface SourceFilterDropdownProps {
  sources: SourceOption[];
  sourceParts: SourcePartOption[];
  localSources: string[];
  localParts: string[];
  isPending: boolean;
  handleSourceToggle: (sourceTitle: string) => void;
  handleSourcePartToggle: (partName: string, parentSourceTitle: string) => void;
  reducedMotion: boolean | null;
}

export function SourceFilterDropdown({
  sources,
  sourceParts,
  localSources,
  localParts,
  isPending,
  handleSourceToggle,
  handleSourcePartToggle,
  reducedMotion,
}: SourceFilterDropdownProps) {
  const hasSourceFilters = localSources.length > 0 || localParts.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: reducedMotion ? 1 : 1.02, y: reducedMotion ? 0 : -1 }}
          whileTap={{ scale: reducedMotion ? 1 : 0.98 }}
          className={`relative inline-flex items-center justify-center gap-1.5 @sm:gap-2 size-9 @sm:size-auto @sm:px-4 @sm:py-2 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-dict-primary/50 ${
            hasSourceFilters
              ? "bg-dict-tag-gradient text-dict-primary-vivid shadow-dict-sm"
              : "bg-dict-surface-2 text-dict-text-secondary hover:bg-dict-hover hover:text-dict-text hover:shadow-dict-sm active:bg-dict-active"
          }`}
        >
          <BookOpen className="size-4 @sm:size-3.5" />
          <span className="hidden @sm:inline">Sources</span>
          {hasSourceFilters && (
            <span className="absolute -top-1 -right-1 @sm:relative @sm:top-0 @sm:right-0 @sm:ml-1 min-w-5 px-1.5 py-0.5 text-xs rounded-full bg-dict-accent/20 text-dict-accent">
              {localSources.length + localParts.length}
            </span>
          )}
          {isPending && hasSourceFilters && (
            <span className="ml-1 size-2 rounded-full bg-dict-accent animate-pulse" />
          )}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 max-h-96 overflow-y-auto bg-dict-surface-1 border-dict-border rounded-2xl shadow-dict-lg p-2"
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Filter by Source</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sources.length === 0 ? (
          <div className="px-3 py-4 text-sm text-dict-text-tertiary text-center">No sources available</div>
        ) : (
          sources.map((source, sourceIndex) => {
            const partsForSource = sourceParts.filter((part) => part.sourceId === source.id);
            return (
              <div key={source.id}>
                {sourceIndex > 0 && <DropdownMenuSeparator className="my-2 bg-dict-border" />}
                <DropdownMenuCheckboxItem
                  checked={localSources.includes(source.title)}
                  onCheckedChange={() => handleSourceToggle(source.title)}
                  onSelect={(e) => e.preventDefault()}
                  className="rounded-lg px-3 py-2.5 my-0.5 cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover"
                >
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-sm">{source.title}</span>
                    <span className="text-xs text-dict-text-tertiary">{source.type}</span>
                  </div>
                  <span className="text-xs text-dict-text-tertiary ml-2">({source.entryCount})</span>
                </DropdownMenuCheckboxItem>
                {partsForSource.map((part) => (
                  <DropdownMenuCheckboxItem
                    key={part.id}
                    checked={localParts.includes(part.name)}
                    onCheckedChange={() => handleSourcePartToggle(part.name, source.title)}
                    onSelect={(e) => e.preventDefault()}
                    className="rounded-lg px-3 py-2 pl-10 my-0.5 cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover"
                  >
                    <div className="flex flex-1 min-w-0">
                      <span className="truncate text-sm">{part.name}</span>
                    </div>
                    <span className="text-xs text-dict-text-tertiary ml-2 shrink-0">({part.entryCount})</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
