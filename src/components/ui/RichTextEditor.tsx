"use client";

import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import tippy, { Instance } from 'tippy.js';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  mentions?: { id: string; label: string }[];
}

interface MentionListProps {
  items: { id: string; label: string }[];
  command: (item: { id: string; label: string }) => void;
}

const MentionList = forwardRef<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  // Reset selected index when items change without useEffect to avoid lint error
  const [lastItems, setLastItems] = useState(props.items);
  if (props.items !== lastItems) {
    setSelectedIndex(0);
    setLastItems(props.items);
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-lg overflow-hidden min-w-[120px] p-1">
      {props.items.length ? (
        props.items.map((item, index: number) => (
          <button
            key={item.id}
            onClick={() => selectItem(index)}
            className={cn(
              "w-full text-left px-2 py-1.5 text-xs rounded transition-colors",
              index === selectedIndex ? "bg-accent text-white" : "hover:bg-surface-2 text-primary"
            )}
          >
            {item.label}
          </button>
        ))
      ) : (
        <div className="px-2 py-1.5 text-xs text-muted">No results</div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';

export function RichTextEditor({ content, onChange, placeholder, mentions }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Add a description...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }) => {
            if (!mentions) return [];
            return mentions
              .filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5);
          },
          render: () => {
            let component: ReactRenderer<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }>;
            let popup: Instance[];

            return {
              onStart: props => {
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) {
                  return;
                }

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },
              onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                  return;
                }

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                });
              },
              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup[0].hide();
                  return true;
                }

                return component.ref?.onKeyDown(props) || false;
              },
              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="prose prose-sm max-w-none border border-border rounded-md p-3 focus-within:ring-1 focus-within:ring-accent min-h-[100px]">
      <EditorContent editor={editor} />
      <style jsx global>{`
        .mention {
          background-color: var(--accent);
          color: white;
          border-radius: 4px;
          padding: 0 4px;
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
