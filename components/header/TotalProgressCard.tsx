"use client";

import React from "react";

interface RingProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}

function RingProgress({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = "#f97316", // orange
  trackColor = "#374151", // gray-700
}: RingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="relative">
      {/* Track */}
      <circle
        stroke={trackColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      {/* Progress */}
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Percentage text (must use <text> inside SVG) */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-2xl font-semibold fill-current"
      >
        {percentage}%
      </text>
    </svg>
  );
}

import { Card, CardContent } from "@/components/ui/card";

interface TotalProgressCardProps {
  done: number;
  total: number;
}

export function TotalProgressCard({ done, total }: TotalProgressCardProps) {
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="rounded-2xl shadow-sm p-4 flex items-center justify-center gap-4">
      <CardContent className="p-0 flex flex-col items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg text-muted-foreground">Total Progress</h2>
          <h2 className="text-xl text-center font-bold">
            {done} / {total}
          </h2>
        </div>

        {/* Ring progress */}
        <div className="flex items-center justify-center">
          <RingProgress
            percentage={percentage}
            size={120}
            strokeWidth={10}
            color="#f97316"
            trackColor="#374151"
          />
        </div>
      </CardContent>
    </Card>
  );
}
