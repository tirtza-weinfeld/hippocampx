export interface TagOption {
  id: number;
  name: string;
  categoryId: string;
  categoryDisplayName: string;
  senseCount: number;
}

export interface SourceOption {
  id: number;
  title: string;
  type: string;
  entryCount: number;
}

export interface SourcePartOption {
  id: number;
  name: string;
  type: string | null;
  sourceId: number;
  sourceTitle: string;
  sourceType: string;
  entryCount: number;
}

export interface FilterState {
  tags: string[];
  sources: string[];
  parts: string[];
}

export type FilterAction =
  | { type: "SET_TAGS"; tags: string[] }
  | { type: "SET_SOURCES"; sources: string[] }
  | { type: "SET_PARTS"; parts: string[] }
  | { type: "SET_ALL"; tags: string[]; sources: string[]; parts: string[] };

export interface DictionaryFiltersProps {
  tags: TagOption[];
  sources: SourceOption[];
  sourceParts: SourcePartOption[];
  selectedTagNames: string[];
  selectedSourceTitles: string[];
  selectedSourcePartNames: string[];
}
