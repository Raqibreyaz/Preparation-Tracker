"use client";

import React, { useState, useMemo } from "react";
import { List as VirtualList} from "react-window";
import { Category } from "@/lib/types";
import { categoryStats, topicStats } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FolderPlus, ChevronRight } from "lucide-react";
import { TopicAddSubtopicButton } from "@/components/topic/TopicCard";
import { SubtopicRow } from "@/components/subtopic/SubtopicRow";

export function CategoryExplorer({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 🔍 filter categories/topics/subtopics
  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      topics: cat.topics.map(top => ({
        ...top,
        subtopics: top.subtopics.filter(s => {
          const matchesQuery = s.name.toLowerCase().includes(lower);
          const matchesStatus =
            statusFilter === "All" ? true : s.status === statusFilter;
          return matchesQuery && matchesStatus;
        }),
      })).filter(t => t.subtopics.length > 0 || t.name.toLowerCase().includes(lower)),
    })).filter(c => c.topics.length > 0 || c.name.toLowerCase().includes(lower));
  }, [categories, query, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <Input
          placeholder="Search categories, topics, subtopics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category List */}
      <Accordion type="multiple" className="space-y-3">
        {filtered.map((category) => {
          const stats = categoryStats(category);
          return (
            <AccordionItem key={category.id} value={category.id} className="border rounded-xl">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">
                      {stats.done}/{stats.total}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 w-1/2">
                    <Progress value={stats.pct} className="h-2 flex-1 [&>div]:bg-orange-500" />
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {stats.pct}%
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <Accordion type="multiple" className="space-y-2">
                  {category.topics.map((topic) => {
                    const tstats = topicStats(topic);
                    return (
                      <AccordionItem key={topic.id} value={topic.id} className="border rounded-lg">
                        <AccordionTrigger className="px-3 py-2 hover:no-underline">
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="h-4 w-4" />
                              <span>{topic.name}</span>
                              <Badge variant="secondary">
                                {tstats.done}/{tstats.total}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 w-1/2">
                              <Progress value={tstats.pct} className="h-2 flex-1 [&>div]:bg-blue-500" />
                              <span className="text-xs text-muted-foreground w-10 text-right">
                                {tstats.pct}%
                              </span>
                              <TopicAddSubtopicButton categoryId={category.id} topicId={topic.id} />
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* ⚡ Virtualized Subtopic List */}
                          <VirtualList
                            height={200}
                            itemCount={topic.subtopics.length}
                            itemSize={48}
                            width="100%"
                          >
                            {({ index, style }) => {
                              const s = topic.subtopics[index];
                              return (
                                <div style={style} key={s.id}>
                                  <SubtopicRow
                                    categoryId={category.id}
                                    topicId={topic.id}
                                    subtopic={s}
                                  />
                                </div>
                              );
                            }}
                          </VirtualList>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
