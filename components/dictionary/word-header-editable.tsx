"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useWordEditMode } from "./word-edit-mode-provider";

interface WordHeaderEditableProps {
  initialWordText: string;
  initialLanguageCode: string;
  onUpdate: (wordText: string, languageCode: string) => void;
}

export function WordHeaderEditable({
  initialWordText,
  initialLanguageCode,
  onUpdate,
}: WordHeaderEditableProps) {
  const { isEditMode } = useWordEditMode();
  const [wordText, setWordText] = useState(initialWordText);
  const [languageCode, setLanguageCode] = useState(initialLanguageCode);

  function handleWordChange(value: string) {
    setWordText(value);
    onUpdate(value, languageCode);
  }

  function handleLanguageChange(value: string) {
    setLanguageCode(value);
    onUpdate(wordText, value);
  }

  if (isEditMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <Input
          value={wordText}
          onChange={(e) => handleWordChange(e.target.value)}
          className="text-5xl font-bold h-auto py-2 px-4 border-2 max-w-md"
        />
        <Select value={languageCode} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <h1 className="text-5xl font-bold tracking-tight">{initialWordText}</h1>
      <Badge variant="secondary" className="uppercase text-sm">
        {initialLanguageCode}
      </Badge>
    </motion.div>
  );
}
