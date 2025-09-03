import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookMarked, Star, Settings2 } from "lucide-react";
import { useTracker } from "@/store/useTrackerStore";
import { Subtopic, Status } from "@/lib/types";
import { NotesDialog } from "@/components/subtopic/NotesDialog";

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

  const bg = ""
    // subtopic.status === "Done"
    //   ? "bg-emerald-50 border-emerald-200"
    //   : "bg-white";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`w-full ${bg} p-3 border shadow-sm`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
        {/* Name */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Badge
            variant={subtopic.status === "Done" ? "default" : "secondary"}
            className="rounded-full whitespace-nowrap"
          >
            {subtopic.status}
          </Badge>
          <div className="font-medium">{subtopic.name}</div>
        </div>

        {/* Importance */}
        <div className="md:col-span-2 flex items-center gap-2">
          <Star className="h-4 w-4" />
          <Select
            value={String(subtopic.importance)}
            onValueChange={(v) =>
              update(categoryId, topicId, subtopic.id, {
                importance: Number(v) as any,
              })
            }
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="md:col-span-2 flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <Select
            value={subtopic.status}
            onValueChange={(v) =>
              update(categoryId, topicId, subtopic.id, { status: v as Status })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Revision toggle */}
        <div className="md:col-span-2 flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            <Label className="text-sm">Mark for Revision</Label>
          </div>
          <Switch
            checked={subtopic.markForRevision}
            onCheckedChange={(checked) =>
              update(categoryId, topicId, subtopic.id, {
                markForRevision: !!checked,
              })
            }
          />
        </div>

        {/* Notes button */}
        <div className="md:col-span-2 flex items-center justify-end md:justify-start">
          <NotesDialog
            initialNotes={subtopic.notes || ""}
            onSave={(notes) =>
              update(categoryId, topicId, subtopic.id, { notes })
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
