import { Category, Status } from "@/lib/types";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NotebookPen, ChevronRight } from "lucide-react";
import { SubtopicRow } from "@/components/subtopic/SubtopicRow";

export function RevisionTab({
  categories,
  query,
  statusFilter,
}: {
  categories: Category[];
  query: string;
  statusFilter: "All" | Status;
}) {
  const q = query.trim().toLowerCase();
  const filtered = categories
    .map((c) => ({
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
            return s.markForRevision && (!q || textMatch) && statusMatch;
          }),
        }))
        .filter((t) => t.subtopics.length > 0),
    }))
    .filter((c) => c.topics.length > 0);

  if (filtered.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No subtopics marked for revision yet. Use the toggle to mark items.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-4">
      {filtered.map((c) => (
        <AccordionItem
          key={c.id}
          value={c.id}
          className="border rounded-2xl p-0 shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <NotebookPen className="h-5 w-5" />
              <span className="text-base font-medium">{c.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Accordion type="multiple" className="space-y-3">
              {c.topics.map((t) => (
                <AccordionItem
                  key={t.id}
                  value={t.id}
                  className="border rounded-2xl"
                >
                  <AccordionTrigger className="px-3 py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {t.subtopics.map((s) => (
                        <SubtopicRow
                          key={s.id}
                          categoryId={c.id}
                          topicId={t.id}
                          subtopic={s}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
