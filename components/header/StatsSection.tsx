"use client";

import { TotalProgressCard } from "@/components/header/TotalProgressCard";
import { CategoryStatCard } from "@/components/header/CategoryStatCard";
import { Category } from "@/lib/types";
import { getTotalDone, getTotalSubtopics } from "@/lib/utils";
import { useMemo } from "react";

export function StatsSection({
  categories,
  totalDone,
  total,
}: {
  categories: Category[];
  totalDone: number;
  total: number;
}) {
  const summarizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        name: category.name,
        id: category.id,
        done: getTotalDone(category),
        total: getTotalSubtopics(category),
      })),
    [categories]
  );


  return (
    <div className="flex gap-4">
      {/* Top row → total progress */}
      <TotalProgressCard done={totalDone} total={total} />
      {/* Grid of categories */}

      <div className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2">
        {summarizedCategories.map((c) => (
          <CategoryStatCard
            key={c.id}
            name={c.name}
            done={c.done}
            total={c.total}
          />
        ))}
      </div>
    </div>
  );
}
