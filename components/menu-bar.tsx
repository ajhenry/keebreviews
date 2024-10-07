import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiCodeBlock,
  RiCodeBoxLine,
  RiDoubleQuotesL,
  RiFormatClear,
  RiH1,
  RiH2,
  RiItalic,
  RiListCheck2,
  RiListOrdered,
  RiListUnordered,
  RiMarkPenLine,
  RiParagraph,
  RiSeparator,
  RiStrikethrough,
  RiTextWrap,
  RiUnderline,
} from "@remixicon/react";
import { useEditor, type Editor } from "@tiptap/react";

import { Fragment, ReactElement, ReactNode, useEffect, useState } from "react";

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

function MenuItem({
  Icon,
  title,
  action,
  isActive = null,
}: {
  Icon?: any;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}) {
  return (
    <Button
      className="p-1 m-0 h-8"
      onClick={action}
      title={title}
      variant={isActive && isActive() ? "default" : "ghost"}
    >
      <Icon size={20} />
    </Button>
  );
}

export default function MenuBar({ editor }: { editor: Editor }) {
  const items = [
    {
      Icon: RiBold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      Icon: RiItalic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      Icon: RiStrikethrough,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      Icon: RiCodeBlock,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      Icon: RiMarkPenLine,
      title: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      type: "divider",
    },
    {
      Icon: RiDoubleQuotesL,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      Icon: RiSeparator,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      Icon: RiTextWrap,
      title: "Hard Break",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      Icon: RiFormatClear,
      title: "Clear Format",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: "divider",
    },
    {
      Icon: RiArrowGoBackLine,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      Icon: RiArrowGoForwardLine,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  const textModifiers = [
    {
      Icon: RiH1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      Icon: RiH2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      Icon: RiParagraph,
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      Icon: RiListUnordered,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      Icon: RiListOrdered,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      Icon: RiListCheck2,
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      Icon: RiCodeBoxLine,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
  ];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Paragraph");

  useEffect(() => {
    if (editor.isActive("heading", { level: 1 })) {
      console.log("setting value to Heading 1");
      setValue("Heading 1");
    }

    if (editor.isActive("heading", { level: 2 })) {
      console.log("setting value to Heading 2");
      setValue("Heading 2");
    }

    if (editor.isActive("paragraph")) {
      console.log("setting value to Paragraph");
      setValue("Paragraph");
    }

    if (editor.isActive("bulletList")) {
      console.log("setting value to Bullet List");
      setValue("Bullet List");
    }

    if (editor.isActive("orderedList")) {
      console.log("setting value to Ordered List");
      setValue("Ordered List");
    }

    if (editor.isActive("taskList")) {
      console.log("setting value to Task List");
      setValue("Task List");
    }

    if (editor.isActive("codeBlock")) {
      console.log("setting value to Code Block");
      setValue("Code Block");
    }
  }, []);

  return (
    <div className="flex sm:flex-row flex-col bg-accent p-2 space-y-2 sm:space-y-0 sm:items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between mr-2"
          >
            {value
              ? textModifiers.find((modifier) => modifier.title === value)
                  ?.title
              : "Select Modifier"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {textModifiers.map((framework) => (
                  <CommandItem
                    key={framework.title}
                    value={framework.title}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? value : currentValue);
                      textModifiers
                        .find((modifier) => modifier.title === currentValue)
                        ?.action();
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="w-full flex flex-row space-x-1">
        {items.map((item, index) => (
          <Fragment key={index}>
            {item.type === "divider" ? (
              <div className="divider border-l mx-8" />
            ) : (
              <MenuItem {...item} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
