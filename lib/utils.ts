import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Subtopic, Topic, Category } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function topicStats(topic: Topic) {
  const total = topic.subtopics.length;
  const done = countDone(topic.subtopics);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}


export function categoryStats(category: Category) {
  const allSubs = category.topics.flatMap((t) => t.subtopics);
  const total = allSubs.length;
  const done = countDone(allSubs);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}

export function countDone(items: Subtopic[]) {
  return items.filter((s) => s.status === "Done").length;
}

export function overallStats(categories: Category[]) {
  const allSubs = categories.flatMap((c) =>
    c.topics.flatMap((t) => t.subtopics)
  );
  const total = allSubs.length;
  const done = countDone(allSubs);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}
