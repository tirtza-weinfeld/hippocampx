"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const EMPTY_ARRAY: string[] = [];

type DbViewerState = {
  /** Hidden columns per table: { tableName: Set<columnName> } stored as arrays */
  hiddenColumnsByTable: Record<string, string[]>;
};

type DbViewerActions = {
  getHiddenColumns: (tableName: string) => Set<string>;
  setHiddenColumns: (tableName: string, columns: Set<string>) => void;
  toggleColumn: (tableName: string, columnName: string) => void;
  showAllColumns: (tableName: string) => void;
  hideAllColumns: (tableName: string, allColumnNames: string[]) => void;
};

const INITIAL_STATE: DbViewerState = {
  hiddenColumnsByTable: {},
};

const useDbViewerStoreBase = create<DbViewerState & DbViewerActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      getHiddenColumns: (tableName) => {
        const state = get();
        const columns = state.hiddenColumnsByTable[tableName] as string[] | undefined;
        return new Set(columns ?? []);
      },

      setHiddenColumns: (tableName, columns) =>
        set((state) => ({
          hiddenColumnsByTable: {
            ...state.hiddenColumnsByTable,
            [tableName]: Array.from(columns),
          },
        })),

      toggleColumn: (tableName, columnName) =>
        set((state) => {
          const current = state.hiddenColumnsByTable[tableName] ?? [];
          const currentSet = new Set(current);
          if (currentSet.has(columnName)) {
            currentSet.delete(columnName);
          } else {
            currentSet.add(columnName);
          }
          return {
            hiddenColumnsByTable: {
              ...state.hiddenColumnsByTable,
              [tableName]: Array.from(currentSet),
            },
          };
        }),

      showAllColumns: (tableName) =>
        set((state) => ({
          hiddenColumnsByTable: {
            ...state.hiddenColumnsByTable,
            [tableName]: [],
          },
        })),

      hideAllColumns: (tableName, allColumnNames) =>
        set((state) => ({
          hiddenColumnsByTable: {
            ...state.hiddenColumnsByTable,
            [tableName]: allColumnNames,
          },
        })),
    }),
    {
      name: "db-viewer-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Get store actions without subscribing */
export function getDbViewerActions() {
  const state = useDbViewerStoreBase.getState();
  return {
    getHiddenColumns: state.getHiddenColumns,
    setHiddenColumns: state.setHiddenColumns,
    toggleColumn: state.toggleColumn,
    showAllColumns: state.showAllColumns,
    hideAllColumns: state.hideAllColumns,
  };
}

/** Subscribe to hidden columns for a specific table */
export function useHiddenColumns(tableName: string | undefined): string[] {
  // Selector returns undefined (stable) when not found - fallback handled outside
  const fromStore = useDbViewerStoreBase((state) =>
    tableName ? state.hiddenColumnsByTable[tableName] : undefined
  );
  return fromStore ?? EMPTY_ARRAY;
}
