"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Upload, Download } from "lucide-react";
import { overallStats } from "@/lib/utils";
import { Status, Category } from "@/lib/types";
import { useTracker } from "@/store/useTrackerStore";
import { AddForm } from "@/components/forms/AddForm";
import { Header } from "@/components/header/HeaderStats";
import { CategoryCard } from "@/components/category/CategoryCard";
import { RevisionTab } from "@/components/tabs/RevisionTab";
import { StatsSection } from "@/components/header/StatsSection";

export default function Page() {
  const categories = useTracker((s) => s.categories);
  const stats = overallStats(categories);

  // search + filters
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"All" | Status>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.map((c) => ({
      ...c,
      topics: c.topics
        .map((t) => ({
          ...t,
          subtopics: t.subtopics.filter((s) => {
            const textMatch =
              c.name.toLowerCase().includes(q) ||
              t.name.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q) ||
              (s.notes || "").toLowerCase().includes(q);
            const statusMatch =
              statusFilter === "All" ? true : s.status === statusFilter;
            return (!q || textMatch) && statusMatch;
          }),
        }))
        .filter((t) => t.subtopics.length > 0 || q === ""),
    }));
  }, [categories, query, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* <Header
          stats={stats}
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        /> */}
        <StatsSection
          categories={categories}
          totalDone={stats.done}
          total={stats.total}
        />

        <Card className="mt-6 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              Placement Progress Tracker
            </CardTitle>
            <div className="flex items-center gap-2">
              <AddForm />
              <ImportExport />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="full">
              <TabsList>
                <TabsTrigger value="full">Structured View</TabsTrigger>
                <TabsTrigger value="revision">Revision</TabsTrigger>
              </TabsList>

              <TabsContent value="full" className="mt-4">
                <Accordion type="multiple" className="space-y-4">
                  {filtered.map((c) => (
                    <CategoryCard key={c.id} category={c} />
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="revision" className="mt-4">
                <RevisionTab
                  categories={categories}
                  query={query}
                  statusFilter={statusFilter}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Built with ❤️ for focused interview prep. Your data persists in the
          browser (localStorage).
        </footer>
      </div>
    </div>
  );
}

function ImportExport() {
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
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" /> Import
      </Button>
      <Button size="sm" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </div>
  );
}
