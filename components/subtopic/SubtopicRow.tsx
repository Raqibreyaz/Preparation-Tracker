import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { BookMarked, Star, Settings2, Trash2, ChevronDown } from "lucide-react";
import { useTracker } from "@/store/useTrackerStore";
import { Subtopic, Status, Importance } from "@/lib/types";
import { NotesDialog } from "@/components/subtopic/NotesDialog";

const statusColors: Record<Status, string> = {
  "Not Started": "bg-gray-200 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-700",
  Done: "bg-emerald-100 text-emerald-700",
};

export function SubtopicRow({
  categoryId,
  topicId,
  subtopic,
}: {
  categoryId: string;
  topicId: string;
  subtopic: Subtopic;
}) {
  const update = useTracker((s) => s.updateSubtopic);
  const deleteSubtopic = useTracker((s) => s.deleteSubtopic);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="w-full bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border hover:shadow-md transition"
    >
      <div className="grid grid-cols-1 md:grid-cols-13 items-center gap-4">
        {/* Name & Status */}
        <div className="md:col-span-4 flex items-center gap-3">
          <Badge
            className={`rounded-full transition-colors px-3 py-1 text-xs font-medium ${
              statusColors[subtopic.status]
            }`}
          >
            {subtopic.status}
          </Badge>
          <div className="font-medium truncate">{subtopic.name}</div>
        </div>

        {/* Importance */}
        <div className="md:col-span-2 flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Star className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Importance</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[90px] justify-between">
                {subtopic.importance}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[120px] p-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    update(categoryId, topicId, subtopic.id, {
                      importance: n as Importance,
                    })
                  }
                >
                  {"⭐".repeat(n)}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {/* Status */}
        <div className="md:col-span-2 flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Settings2 className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Status</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-between">
                {subtopic.status}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-1 space-y-1">
              {["Not Started", "In Progress", "Done"].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    update(categoryId, topicId, subtopic.id, {
                      status: status as Status,
                    })
                  }
                >
                  {status}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {/* Revision */}
        <div className="md:col-span-2 flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <BookMarked
                className={`h-4 w-4 ${
                  subtopic.markForRevision
                    ? "text-amber-500"
                    : "text-muted-foreground"
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>Mark for Revision</TooltipContent>
          </Tooltip>
          <Switch
            checked={subtopic.markForRevision}
            onCheckedChange={(checked) =>
              update(categoryId, topicId, subtopic.id, {
                markForRevision: !!checked,
              })
            }
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2 flex items-center justify-end md:justify-center">
          <NotesDialog
            initialNotes={subtopic.notes || ""}
            onSave={(notes) =>
              update(categoryId, topicId, subtopic.id, { notes })
            }
          />
        </div>

        {/* Delete */}
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Delete this subtopic?")) {
                deleteSubtopic(categoryId, topicId, subtopic.id);
              }
            }}
          >
            <Trash2 className="size-4 text-red-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
