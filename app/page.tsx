"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { overallStats } from "@/lib/utils";
import { Status} from "@/lib/types";
import { useTracker } from "@/store/useTrackerStore";
import { AddForm } from "@/components/forms/AddForm";
import { CategoryCard } from "@/components/category/CategoryCard";
import { RevisionTab } from "@/components/tabs/RevisionTab";
import { StatsSection } from "@/components/header/StatsSection";
import { ImportExport } from "@/components/import-export/ImportExport";
import { CategoryExplorer } from "@/components/category/CategoryExplorer";

export default function Page() {
  const categories = useTracker((s) => s.categories);

  console.log(categories);

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
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <StatsSection
          categories={categories}
          totalDone={stats.done}
          total={stats.total}
        />
        {/* <Header
          stats={stats}
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        /> */}

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