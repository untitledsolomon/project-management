"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  content,
  onChange
}: {
  content: string;
  onChange: (content: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add a description...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border-base rounded-badge overflow-hidden">
      <div className="bg-surface-2 border-b border-border-base px-3 py-1.5 flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded hover:bg-surface-3 transition-colors",
            editor.isActive("bold") ? "bg-surface-3 text-accent" : "text-muted"
          )}
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded hover:bg-surface-3 transition-colors",
            editor.isActive("italic") ? "bg-surface-3 text-accent" : "text-muted"
          )}
        >
          <Italic size={14} />
        </button>
        <div className="w-px h-4 bg-border-base mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-surface-3 transition-colors",
            editor.isActive("bulletList") ? "bg-surface-3 text-accent" : "text-muted"
          )}
        >
          <List size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-surface-3 transition-colors",
            editor.isActive("orderedList") ? "bg-surface-3 text-accent" : "text-muted"
          )}
        >
          <ListOrdered size={14} />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="p-4 min-h-[150px] text-sm text-secondary prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
}
