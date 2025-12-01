"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateWord } from "@/lib/actions/vocabulary";
import { motion } from "motion/react";

interface EditableWordHeaderProps {
  wordId: number;
  initialWordText: string;
  initialLanguageCode: string;
}

export function EditableWordHeader({
  wordId,
  initialWordText,
  initialLanguageCode,
}: EditableWordHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [wordText, setWordText] = useState(initialWordText);
  const [languageCode, setLanguageCode] = useState(initialLanguageCode);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!wordText.trim() || wordText === initialWordText && languageCode === initialLanguageCode) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const result = await updateWord(wordId, wordText.trim(), languageCode);
    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
    }
  }

  function handleCancel() {
    setWordText(initialWordText);
    setLanguageCode(initialLanguageCode);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <Input
          value={wordText}
          onChange={(e) => setWordText(e.target.value)}
          className="text-5xl font-bold h-auto py-2 px-4 border-2 max-w-md"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          }}
        />
        <Select value={languageCode} onValueChange={setLanguageCode}>
          <SelectTrigger className="w-32">
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
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-9"
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-9"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 group"
    >
      <h1 className="text-5xl font-bold tracking-tight">{initialWordText}</h1>
      <Badge variant="secondary" className="uppercase text-sm">
        {initialLanguageCode}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
