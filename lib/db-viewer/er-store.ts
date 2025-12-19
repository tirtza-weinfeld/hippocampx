"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ColumnSelection, TablePosition, Transform } from "./types";

interface ERDiagramState {
  /** Hidden tables (stored as array for serialization) */
  hiddenTables: string[];
  /** Canvas transform (pan/zoom) */
  transform: Transform;
  /** Currently selected column */
  selectedColumn: ColumnSelection | null;
  /** Per-table zoom levels */
  tableZooms: Record<string, number>;
  /** Currently focused table */
  focusedTable: string | null;
  /** Table z-indexes for layering */
  tableZIndexes: Record<string, number>;
  /** Table positions for dragging */
  positions: Record<string, TablePosition>;
  /** Z-index counter for bringing tables to front */
  zCounter: number;
  /** Whether initial layout has been applied */
  hasInitialLayout: boolean;
  /** Tables with expanded details view */
  expandedTables: Record<string, boolean>;
  /** Whether store has been hydrated from storage */
  _hasHydrated: boolean;
}

interface ERDiagramActions {
  // Hidden tables
  getHiddenTables: () => Set<string>;
  setHiddenTables: (tables: Set<string>) => void;
  toggleTable: (name: string) => void;
  showAllTables: () => void;
  hideAllTables: (allNames: string[]) => void;
  toggleSchema: (tableNames: string[], show: boolean) => void;

  // Transform
  setTransform: (transform: Transform) => void;
  setScale: (scale: number) => void;
  panTo: (x: number, y: number) => void;

  // Selection
  setSelectedColumn: (selection: ColumnSelection | null) => void;
  clearSelection: () => void;

  // Table zooms
  setTableZoom: (tableName: string, zoom: number) => void;
  clearTableZoom: (tableName: string) => void;
  clearAllTableZooms: () => void;

  // Focus
  setFocusedTable: (tableName: string | null) => void;

  // Z-indexes
  bringTableToFront: (tableName: string) => void;

  // Positions
  setPositions: (positions: Record<string, TablePosition>) => void;
  updatePosition: (tableName: string, position: TablePosition) => void;

  // Layout
  setHasInitialLayout: (value: boolean) => void;
  resetLayout: () => void;

  // Expanded tables
  toggleTableExpanded: (tableName: string) => void;
  setTableExpanded: (tableName: string, expanded: boolean) => void;
}

const INITIAL_STATE: ERDiagramState = {
  hiddenTables: [],
  transform: { x: 0, y: 0, scale: 1 },
  selectedColumn: null,
  tableZooms: {},
  focusedTable: null,
  tableZIndexes: {},
  positions: {},
  zCounter: 1,
  hasInitialLayout: false,
  expandedTables: {},
  _hasHydrated: false,
};

export const useERDiagramStore = create<ERDiagramState & ERDiagramActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // Hidden tables
      getHiddenTables: () => new Set(get().hiddenTables),

      setHiddenTables: (tables) =>
        set({ hiddenTables: Array.from(tables) }),

      toggleTable: (name) =>
        set((state) => {
          const current = new Set(state.hiddenTables);
          if (current.has(name)) {
            current.delete(name);
          } else {
            current.add(name);
          }
          return { hiddenTables: Array.from(current) };
        }),

      showAllTables: () => set({ hiddenTables: [] }),

      hideAllTables: (allNames) => set({ hiddenTables: allNames }),

      toggleSchema: (tableNames, show) =>
        set((state) => {
          const current = new Set(state.hiddenTables);
          for (const name of tableNames) {
            if (show) {
              current.delete(name);
            } else {
              current.add(name);
            }
          }
          return { hiddenTables: Array.from(current) };
        }),

      // Transform
      setTransform: (transform) => set({ transform }),

      setScale: (scale) =>
        set((state) => ({
          transform: { ...state.transform, scale },
        })),

      panTo: (x, y) =>
        set((state) => ({
          transform: { ...state.transform, x, y },
        })),

      // Selection
      setSelectedColumn: (selection) => set({ selectedColumn: selection }),
      clearSelection: () => set({ selectedColumn: null }),

      // Table zooms
      setTableZoom: (tableName, zoom) =>
        set((state) => {
          if (zoom === 1) {
            const { [tableName]: _, ...rest } = state.tableZooms;
            void _;
            return { tableZooms: rest };
          }
          return { tableZooms: { ...state.tableZooms, [tableName]: zoom } };
        }),

      clearTableZoom: (tableName) =>
        set((state) => {
          const { [tableName]: _, ...rest } = state.tableZooms;
          void _;
          return { tableZooms: rest };
        }),

      clearAllTableZooms: () => set({ tableZooms: {} }),

      // Focus
      setFocusedTable: (tableName) => set({ focusedTable: tableName }),

      // Z-indexes
      bringTableToFront: (tableName) =>
        set((state) => ({
          zCounter: state.zCounter + 1,
          tableZIndexes: { ...state.tableZIndexes, [tableName]: state.zCounter + 1 },
        })),

      // Positions
      setPositions: (positions) => set({ positions }),

      updatePosition: (tableName, position) =>
        set((state) => ({
          positions: { ...state.positions, [tableName]: position },
        })),

      // Layout
      setHasInitialLayout: (value) => set({ hasInitialLayout: value }),

      resetLayout: () =>
        set({
          positions: {},
          tableZooms: {},
          focusedTable: null,
          tableZIndexes: {},
          zCounter: 1,
          hasInitialLayout: false,
          expandedTables: {},
        }),

      // Expanded tables
      toggleTableExpanded: (tableName) =>
        set((state) => ({
          expandedTables: {
            ...state.expandedTables,
            [tableName]: !state.expandedTables[tableName],
          },
        })),

      setTableExpanded: (tableName, expanded) =>
        set((state) => {
          if (!expanded) {
            const { [tableName]: _, ...rest } = state.expandedTables;
            void _;
            return { expandedTables: rest };
          }
          return { expandedTables: { ...state.expandedTables, [tableName]: true } };
        }),
    }),
    {
      name: "er-diagram-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        hiddenTables: state.hiddenTables,
        transform: state.transform,
        selectedColumn: state.selectedColumn,
        tableZooms: state.tableZooms,
        focusedTable: state.focusedTable,
        tableZIndexes: state.tableZIndexes,
        positions: state.positions,
        zCounter: state.zCounter,
        hasInitialLayout: state.hasInitialLayout,
        expandedTables: state.expandedTables,
      }),
      onRehydrateStorage: () => () => {
        useERDiagramStore.setState({ _hasHydrated: true });
      },
    }
  )
);

/** Get store actions without subscribing */
export function getERDiagramActions() {
  const state = useERDiagramStore.getState();
  return {
    setHiddenTables: state.setHiddenTables,
    toggleTable: state.toggleTable,
    showAllTables: state.showAllTables,
    hideAllTables: state.hideAllTables,
    toggleSchema: state.toggleSchema,
    setTransform: state.setTransform,
    setScale: state.setScale,
    panTo: state.panTo,
    setSelectedColumn: state.setSelectedColumn,
    clearSelection: state.clearSelection,
    setTableZoom: state.setTableZoom,
    clearTableZoom: state.clearTableZoom,
    clearAllTableZooms: state.clearAllTableZooms,
    setFocusedTable: state.setFocusedTable,
    bringTableToFront: state.bringTableToFront,
    setPositions: state.setPositions,
    updatePosition: state.updatePosition,
    setHasInitialLayout: state.setHasInitialLayout,
    resetLayout: state.resetLayout,
    toggleTableExpanded: state.toggleTableExpanded,
    setTableExpanded: state.setTableExpanded,
  };
}
