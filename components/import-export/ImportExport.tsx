"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import {  Category } from "@/lib/types";
import { useTracker } from "@/store/useTrackerStore";

export function ImportExport() {
  const categories = useTracker((s) => s.categories);
  const importJSON = useTracker((s) => s.importJSON);

  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(categories, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "placement-tracker.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text) as Category[];
    importJSON(data);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="application/json"
        ref={fileRef}
        className="hidden"
        onChange={(e) => e.target.files && handleImport(e.target.files[0])}
      />
      <Button
        variant="outline"
        size="sm"
        className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" /> Import
      </Button>
      <Button
        size="sm"
        className=" bg-amber-500 dark:bg-amber-400 hover:bg-amber-600"
        onClick={handleExport}
      >
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </div>
  );
}
