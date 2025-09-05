import { categoryStats } from "@/lib/utils";
import { Category } from "@/lib/types";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Icons
import { FolderPlus, Trash2 } from "lucide-react";
import { TopicCard } from "@/components/topic/TopicCard";
import CategoryAddTopicButton from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { useTracker } from "@/store/useTrackerStore";

export function CategoryCard({ category }: { category: Category }) {
  const stats = categoryStats(category);
  const deleteCategory = useTracker((s) => s.deleteCategory);
  return (
    <AccordionItem
      value={category.id}
      // className="rounded-2xl p-0 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FolderPlus className="h-5 w-5" />
            <span className="text-base font-medium">{category.name}</span>
            <Badge variant="secondary" className="rounded-full">
              {stats.done}/{stats.total}
            </Badge>
          </div>
          <div
            className="relative flex items-center gap-3 w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <Progress
              value={stats.pct}
              className="h-2 flex-1 [&>div]:bg-orange-500"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">
              {stats.pct}%
            </span>
            <CategoryAddTopicButton categoryId={category.id} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Delete this category?")) {
                  deleteCategory(category.id);
                }
              }}
            >
              <Trash2 className="size-5 text-red-500" />
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <Accordion type="multiple" className="space-y-3">
          {category.topics.map((t) => (
            <TopicCard key={t.id} categoryId={category.id} topic={t} />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
