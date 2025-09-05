import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Subtopic, Topic, Category, Status } from "@/lib/types";

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

export function revisionStats(category: Category) {
  const allSubs = category.topics.flatMap((t) => t.subtopics);
  const revisionSubs = allSubs.filter((s) => s.markForRevision);
  const total = revisionSubs.length;
  const done = revisionSubs.filter((s) => s.status === "Done").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
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

export function getTotalDone(category: Category): number {
  return category.topics.reduce((topicDone, topic) => {
    return (
      topicDone + topic.subtopics.filter((s) => s.status === "Done").length
    );
  }, 0);
}

export function getTotalSubtopics(category: Category): number {
  return category.topics.reduce((topicTotal, topic) => {
    return topicTotal + topic.subtopics.length;
  }, 0);
}

export function getFilteredData(
  categories: Category[],
  query: string,
  statusFilter: "All" | Status,
  importanceFilter: "All" | 1 | 2 | 3 | 4 | 5,
  revisionOnly: boolean
): Category[] {
  const q = query.trim().toLowerCase();
  const filtersActive =
    q !== "" || statusFilter !== "All" || importanceFilter !== "All" || revisionOnly;

  // ✅ If no filters/search → return everything unchanged
  if (!filtersActive) {
    return categories;
  }

  return categories
    .map((cat) => {
      const catName = cat.name.toLowerCase();
      const categoryMatch = q !== "" && catName.includes(q);

      const topics = cat.topics
        .map((topic) => {
          const topicName = topic.name.toLowerCase();
          const topicMatch = q !== "" && topicName.includes(q);

          const subtopics = topic.subtopics.filter((sub) => {
            const subName = (sub.name || "").toLowerCase();
            const subNotes = (sub.notes || "").toLowerCase();

            const matchesQuery =
              q === "" ||
              subName.includes(q) ||
              subNotes.includes(q) ||
              topicMatch ||
              categoryMatch;

            const matchesStatus =
              statusFilter === "All" || sub.status === statusFilter;

            const matchesImportance =
              importanceFilter === "All" ||
              (typeof importanceFilter === "number" &&
                sub.importance >= importanceFilter);

            const matchesRevision = !revisionOnly || sub.markForRevision;

            return (
              matchesQuery &&
              matchesStatus &&
              matchesImportance &&
              matchesRevision
            );
          });

          if (subtopics.length > 0) {
            return { ...topic, subtopics };
          }
          if (topicMatch || categoryMatch) {
            return { ...topic, subtopics: [] };
          }
          return null;
        })
        .filter(Boolean) as typeof cat.topics;

      if (topics.length > 0 || categoryMatch) {
        return { ...cat, topics };
      }

      return null;
    })
    .filter(Boolean) as Category[];
}
