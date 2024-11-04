import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./menu-bar";

interface EditorProps {
  onContentChange: (content: string) => void;
  initialContent?: string;
}

export function Editor({ onContentChange, initialContent }: EditorProps) {
  const editor = useEditor({
    content: initialContent,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    extensions: [
      StarterKit.configure(),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder: "Write any notes about the switch here",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose lg:prose-md m-5 focus:outline-none min-h-32",
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="editor border rounded-md">
      {editor && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        placeholder="Write any notes about the switch here"
      />
    </div>
  );
}
