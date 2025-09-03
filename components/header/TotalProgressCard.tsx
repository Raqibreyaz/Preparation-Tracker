"use client"

import { Card, CardContent } from "@/components/ui/card"

interface TotalProgressCardProps {
  done: number
  total: number
}

export function TotalProgressCard({ done, total }: TotalProgressCardProps) {
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Card className="rounded-2xl shadow-sm p-4 flex items-center gap-4">
      <CardContent className="p-0 flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Total Progress</span>
          <span className="text-xl font-bold">
            {done} / {total}
          </span>
        </div>

        {/* Ring progress */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#f97316 ${percentage * 3.6}deg, #1f2937 0deg)`,
            }}
          />
          <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-sm font-semibold">
            {percentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
