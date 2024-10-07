import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import MenuBar from "./menu-bar";
import Placeholder from "@tiptap/extension-placeholder";

export function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder: "Write something",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-20",
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="editor border rounded-md">
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} placeholder="Hello there" />
    </div>
  );
}
