"use client";

import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MechanicalKeySwitch,
  getAllSwitches,
  getSwitchById,
} from "@/switchdb/src";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";

const toLabel = (sw: MechanicalKeySwitch) => {
  return {
    label: sw.friendlyName,
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

export function SwitchSearchCommand({
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
    <Command>
      <CommandInput placeholder="Search switches..." />
      <CommandList className="relative w-full">
        <CommandEmpty>No switch found.</CommandEmpty>
        <CommandGroup>
          {keyboardSwitches.map((kbSwitch) => (
            <CommandItem
              key={kbSwitch.value}
              value={kbSwitch.value}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              <DialogClose asChild className="w-full">
                <Link key={kbSwitch.value} href={`/switches/${kbSwitch.value}`}>
                  {kbSwitch.label}
                </Link>
              </DialogClose>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
