import React from "react";
import { useTracker } from "@/store/useTrackerStore";
import { Status, Topic } from "@/lib/types";
import { topicStats } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ChevronRight } from "lucide-react";
import { SubtopicRow } from "../subtopic/SubtopicRow";

export function TopicAddSubtopicButton({
  categoryId,
  topicId,
}: {
  categoryId: string;
  topicId: string;
}) {
  const addSubtopic = useTracker((s) => s.addSubtopic);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState<Status>("Not Started");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Add Subtopic">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subtopic</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Subtopic Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Round Robin Algorithm"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Status)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) return;
              addSubtopic(categoryId, topicId, {
                name: name.trim(),
                status,
                notes: "",
                markForRevision: false,
                importance: 3,
              });
              setName("");
              setStatus("Not Started");
              setOpen(false);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TopicCard({
  categoryId,
  topic,
}: {
  categoryId: string;
  topic: Topic;
}) {
  const stats = topicStats(topic);
  return (
    <AccordionItem value={topic.id} className="rounded-2xl">
      <AccordionTrigger className="px-3 py-2 hover:no-underline">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium">{topic.name}</span>
            <Badge variant="secondary" className="rounded-full">
              {stats.done}/{stats.total}
            </Badge>
          </div>
          <div className="flex items-center gap-3 w-1/2">
            <Progress value={stats.pct} className="h-2 flex-1 [&>div]:bg-orange-500" />
            <span className="text-xs text-muted-foreground w-10 text-right">
              {stats.pct}%
            </span>
            <TopicAddSubtopicButton
              categoryId={categoryId}
              topicId={topic.id}
            />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="">
        <div className="">
          {topic.subtopics.map((s) => (
            <SubtopicRow
              key={s.id}
              categoryId={categoryId}
              topicId={topic.id}
              subtopic={s}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
