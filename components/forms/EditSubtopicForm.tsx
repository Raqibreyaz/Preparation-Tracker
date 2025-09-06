import React from "react";
import { useTracker } from "@/store/useTrackerStore";
import { Subtopic } from "@/lib/types";
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
import { Edit2 } from "lucide-react";

export function EditSubtopicForm({
  categoryId,
  topicId,
  subtopic,
}: {
  categoryId: string;
  topicId: string;
  subtopic: Subtopic;
}) {
  const updateSubtopic = useTracker((s) => s.updateSubtopic);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(subtopic?.name ?? "");
  const [link, setLink] = React.useState<string | undefined>(subtopic?.link);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button
        //   variant={"outline"}
          title="Update Subtopic"
          className="flex items-center gap-2 size-5 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Edit2 className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Subtopic</DialogTitle>
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
            <Label>Link</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g., Link to Resource"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) return;
              updateSubtopic(categoryId, topicId, subtopic.id, {
                name: name.trim(),
                link,
              });
              setName("");
              setLink("");
              setOpen(false);
            }}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
