"use client";

import { TotalProgressCard } from "@/components/header/TotalProgressCard";
import { CategoryStatCard } from "@/components/header/CategoryStatCard";

export function StatsSection({ categories, totalDone, total }) {
  return (
    <div className="grid gap-4">
      {/* Top row → total progress */}
      <div>
        <TotalProgressCard done={totalDone} total={total} />
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <CategoryStatCard
            key={c.name}
            name={c.name}
            done={c.done}
            total={c.total}
          />
        ))}
      </div>
    </div>
  );
}
