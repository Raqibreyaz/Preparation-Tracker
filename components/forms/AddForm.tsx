"use client";

import React from "react";
import { Status } from "@/lib/types";
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
import { Plus, FolderTree, FileText, Layers } from "lucide-react";
import { useTracker } from "@/store/useTrackerStore";

export function AddForm() {
  const categories = useTracker((s) => s.categories);
  const addCategory = useTracker((s) => s.addCategory);
  const addTopic = useTracker((s) => s.addTopic);
  const addSubtopic = useTracker((s) => s.addSubtopic);

  const [open, setOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState<string>("");
  const [newCategory, setNewCategory] = React.useState("");
  const [topicId, setTopicId] = React.useState<string>("");
  const [topicName, setTopicName] = React.useState("");
  const [subName, setSubName] = React.useState("");
  const [status, setStatus] = React.useState<Status>("Not Started");

  const onSubmit = () => {
    let catId = categoryId;
    if (!catId) {
      if (!newCategory.trim()) return;
      addCategory(newCategory.trim());
      const latest = useTracker.getState().categories.at(-1);
      if (!latest) return;
      catId = latest.id;
    }

    let topId = topicId;
    if (!topId) {
      if (!topicName.trim()) return;
      addTopic(catId, topicName.trim());
      const cat = useTracker.getState().categories.find((c) => c.id === catId);
      if (!cat) return;
      topId = cat.topics.at(-1)?.id || "";
    }

    if (!subName.trim()) return;
    addSubtopic(catId, topId, {
      name: subName.trim(),
      status,
      notes: "",
      markForRevision: false,
      importance: 3,
    });

    // Reset state
    setOpen(false);
    setNewCategory("");
    setTopicName("");
    setSubName("");
    setCategoryId("");
    setTopicId("");
    setStatus("Not Started");
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Quick Add
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl border bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Add Learning Item
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Fill in step by step: Category → Topic → Subtopic
          </p>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="flex items-center gap-1">
                <FolderTree className="h-4 w-4 text-muted-foreground" />
                Pick Category
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select existing" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Or New Category</Label>
              <Input
                placeholder="e.g., Operating Systems"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Topic */}
          {(categoryId || newCategory.trim()) && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Pick Topic
                </Label>
                <Select value={topicId} onValueChange={setTopicId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select existing" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Or New Topic</Label>
                <Input
                  placeholder="e.g., CPU Scheduling"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Subtopic */}
          {(topicId || topicName.trim()) && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Subtopic Name</Label>
                <Input
                  placeholder="e.g., Round Robin Algorithm"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
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
                    <SelectItem value="Not Started" className="text-red-500">
                      Not Started
                    </SelectItem>
                    <SelectItem value="In Progress" className="text-yellow-500">
                      In Progress
                    </SelectItem>
                    <SelectItem value="Done" className="text-green-500">
                      Done
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="mr-2" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
