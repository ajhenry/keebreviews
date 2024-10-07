"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MechanicalKeySwitch, fetchById, getAllSwitches } from "@/switchdb/src";

const toLabel = (sw: MechanicalKeySwitch) => {
  if (sw.spec.variation && sw.spec.variation !== "undefined") {
    return {
      label: `${sw.brand.name} ${sw.spec.model} ${sw.spec.variation}`,
      value: sw.id,
    };
  }

  return {
    label: `${sw.brand.name} ${sw.spec.model}`,
    value: sw.id,
  };
};

const keyboardSwitches = getAllSwitches().map(toLabel);
console.log(keyboardSwitches);

export function SwitchSearch() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const selectedSwitch = fetchById(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? selectedSwitch
              ? toLabel(selectedSwitch)?.label
              : "Select a switch..."
            : "Select a switch..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput className="w-full" placeholder="Search switches..." />
          <CommandList className="w-full">
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {keyboardSwitches.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
