"use client";

import { createContext, useContext, useState } from "react";

interface WordEditModeContextType {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
}

const WordEditModeContext = createContext<WordEditModeContextType | undefined>(
  undefined
);

export function WordEditModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isEditMode, setEditMode] = useState(false);

  return (
    <WordEditModeContext.Provider value={{ isEditMode, setEditMode }}>
      {children}
    </WordEditModeContext.Provider>
  );
}

export function useWordEditMode() {
  const context = useContext(WordEditModeContext);
  if (context === undefined) {
    throw new Error(
      "useWordEditMode must be used within WordEditModeProvider"
    );
  }
  return context;
}
