import React from "react"

interface CategoryProgressProps {
  done: number
  total: number
  label: string
}

export default function CategoryProgress({ done, total, label }: CategoryProgressProps) {
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#4ade80 ${percentage * 3.6}deg, #e5e7eb 0deg)`,
          }}
        />
        <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-inner">
          <span className="text-lg font-semibold">{percentage}%</span>
        </div>
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  )
}