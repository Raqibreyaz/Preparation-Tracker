"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { getFilteredData, overallStats } from "@/lib/utils";
import { Status } from "@/lib/types";
import { useTracker } from "@/store/useTrackerStore";
import { AddForm } from "@/components/forms/AddForm";
import { CategoryCard } from "@/components/category/CategoryCard";
import { RevisionTab } from "@/components/tabs/RevisionTab";
import { StatsSection } from "@/components/header/StatsSection";
import { Filter } from "@/components/filter/Filter";
import { ImportExport } from "@/components/import-export/ImportExport";
import { useDebounce } from "use-debounce";

export default function Page() {
  const categories = useTracker((s) => s.categories);

  // 🔹 State for filters
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"All" | Status>("All");
  const [importanceFilter, setImportanceFilter] = React.useState<
    "All" | 1 | 2 | 3 | 4 | 5
  >("All");
  const [revisionOnly, setRevisionOnly] = React.useState(false);

  // 🔹 Debounced versions of filters (300ms delay)
  const [debouncedQuery] = useDebounce(query, 300);

  // 🔹 Reset filters
  const resetFilters = () => {
    setQuery("");
    setStatusFilter("All");
    setImportanceFilter("All");
    setRevisionOnly(false);
  };

  // 🔹 Apply filters with debounced values
  const filtered = useMemo(
    () =>
      getFilteredData(
        categories,
        debouncedQuery,
        statusFilter,
        importanceFilter,
        revisionOnly
      ),
    [
      categories,
      debouncedQuery,
      statusFilter,
      importanceFilter,
      revisionOnly,
    ]
  );

  const stats = useMemo(() => overallStats(categories), [categories]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <StatsSection
          categories={categories}
          totalDone={stats.done}
          total={stats.total}
        />

        <Filter
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          importanceFilter={importanceFilter}
          resetFilters={resetFilters}
          revisionOnly={revisionOnly}
          setImportanceFilter={setImportanceFilter}
          setRevisionOnly={setRevisionOnly}
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
                  query={debouncedQuery}
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
