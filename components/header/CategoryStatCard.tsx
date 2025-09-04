"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CategoryStatCardProps {
  name: string
  done: number
  total: number
}

export function CategoryStatCard({ name, done, total }: CategoryStatCardProps) {
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Card className="rounded-2xl shadow-sm p-4 flex flex-col gap-2">
      <CardContent className="my-auto p-0 flex flex-col gap-2">
        <span className="text-xl font-medium dark:text-neutral-100">{name}</span>
        <span className="text-2xl font-bold">{percentage}%</span>
        <Progress value={percentage} className="[&>div]:bg-orange-500"/>
        <span className="text-sm text-muted-foreground dark:text-neutral-400">{done}/{total} done</span>
      </CardContent>
    </Card>
  )
}
