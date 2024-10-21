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
import { cn } from "@/utils/cn";
import {
  MechanicalKeySwitch,
  getAllSwitches,
  getSwitchById,
} from "@/switchdb/src";
import Link from "next/link";

const toLabel = (sw: MechanicalKeySwitch) => {
  let baseLabel = `${sw.brand.name} ${sw.spec.model}`;

  if (sw.spec.variation && sw.spec.variation !== "undefined") {
    baseLabel = `${baseLabel} ${sw.spec.variation}`;
  }

  if (sw.spec.profile === "low") {
    baseLabel = `${baseLabel} (Low Profile)`;
  }

  return {
    label: baseLabel,
    value: sw.id,
  };
};

const keyboardSwitches = getAllSwitches().map((item) => {
  return toLabel(item);
});

interface SwitchSearchProps {
  onSelectSwitch?: (id: string) => void;
  placeholder?: string;
}

export function HeroSwitchSearch({
  onSelectSwitch,
  placeholder,
}: SwitchSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const selectedSwitch = getSwitchById(value);

  React.useEffect(() => {
    onSelectSwitch?.(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-full justify-end text-xl h-12"
        >
          <span className="absolute right-0 left-0">Find a Switch</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative popover-content-width-full p-0">
        <Command>
          <CommandInput placeholder="" className="text-lg" />
          <CommandList className="relative w-full text-lg">
            <CommandEmpty>No switches found.</CommandEmpty>
            <CommandGroup>
              {keyboardSwitches.map((keyboardSwitch) => (
                <Link
                  href={`/switches/${keyboardSwitch.value}`}
                  key={keyboardSwitch.value}
                >
                  <CommandItem
                    className="text-base cursor-pointer"
                    value={keyboardSwitch.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {keyboardSwitch.label}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
