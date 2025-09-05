"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search, RefreshCcw, ChevronDown } from "lucide-react";
import { Importance, Status } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Filter({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  importanceFilter,
  setImportanceFilter,
  revisionOnly,
  setRevisionOnly,
  resetFilters,
}: {
  query: string;
  setQuery: (v: string) => void;
  statusFilter: "All" | Status;
  setStatusFilter: (s: "All" | Status) => void;
  importanceFilter: "All" | 1 | 2 | 3 | 4 | 5;
  setImportanceFilter: (v: "All" | 1 | 2 | 3 | 4 | 5) => void;
  revisionOnly: boolean;
  setRevisionOnly: (v: boolean) => void;
  resetFilters: () => void;
}) {
  const statuses: ("All" | Status)[] = ["All", "Not Started", "In Progress", "Done"];
  const importanceLevels: ("All" | 1 | 2 | 3 | 4 | 5)[] = ["All", 1, 2, 3, 4, 5];

  return (
    <div className="py-3">
      <h2 className="text-lg font-bold">Search & Filter</h2>
      <div className="w-full rounded-xl border bg-background p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[150px] justify-between"
              >
                {statusFilter}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[150px]">
              <Command>
                <CommandGroup>
                  {statuses.map((s) => (
                    <CommandItem
                      key={s}
                      onSelect={() => setStatusFilter(s)}
                      className="cursor-pointer"
                    >
                      {s}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Importance */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[140px] justify-between"
              >
                {importanceFilter === "All"
                  ? "All"
                  : "⭐".repeat(importanceFilter as number)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[140px]">
              <Command>
                <CommandGroup>
                  {importanceLevels.map((lvl) => (
                    <CommandItem
                      key={lvl.toString()}
                      onSelect={() =>
                        setImportanceFilter(lvl === "All" ? "All" : (lvl as Importance))
                      }
                      className="cursor-pointer"
                    >
                      {lvl === "All" ? "All" : "⭐".repeat(lvl as number)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Revision */}
          <div className="flex items-center gap-2 border rounded-md px-3 py-1">
            <Switch
              checked={revisionOnly}
              onCheckedChange={setRevisionOnly}
              id="revision"
            />
            <Label htmlFor="revision" className="text-sm">
              Revision
            </Label>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="icon"
            title="Reset Filters"
            onClick={resetFilters}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
