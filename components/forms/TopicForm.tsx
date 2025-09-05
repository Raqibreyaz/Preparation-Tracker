import React from "react";
import { useTracker } from "@/store/useTrackerStore";
import { Status} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus} from "lucide-react";

export function TopicForm({
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
