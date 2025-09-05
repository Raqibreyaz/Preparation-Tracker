import React from "react";
import { useTracker } from "@/store/useTrackerStore";
import { Topic } from "@/lib/types";
import { topicStats } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Trash2 } from "lucide-react";
import { SubtopicRow } from "../subtopic/SubtopicRow";
import { TopicForm } from "@/components/forms/TopicForm";

export function TopicCard({
  categoryId,
  topic,
}: {
  categoryId: string;
  topic: Topic;
}) {
  const stats = topicStats(topic);
  const deleteTopic = useTracker((s) => s.deleteTopic);
  return (
    <AccordionItem value={topic.id} className="rounded-2xl">
      <AccordionTrigger className="px-3 py-2 hover:no-underline">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium">{topic.name}</span>
            <Badge variant="secondary" className="rounded-full">
              {stats.done}/{stats.total}
            </Badge>
          </div>
          <div
            className="flex items-center gap-3 w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <Progress
              value={stats.pct}
              className="h-2 flex-1 [&>div]:bg-orange-500"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">
              {stats.pct}%
            </span>
            <TopicForm
              categoryId={categoryId}
              topicId={topic.id}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Delete this topic?")) {
                  deleteTopic(categoryId, topic.id);
                }
              }}
            >
              <Trash2 className="size-5 text-red-500" />
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="">
        <div className="">
          {topic.subtopics.map((s) => (
            <SubtopicRow
              key={s.id}
              categoryId={categoryId}
              topicId={topic.id}
              subtopic={s}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
