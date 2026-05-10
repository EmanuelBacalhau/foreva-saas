"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Highlighter, Italic, Underline as UnderlineIcon } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

export default function RichEditor({ value, onChange, onBlur, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "input-bubble textarea text-base leading-[1.85] outline-none",
          "min-h-[280px]",
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onBlur: () => onBlur?.(),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="space-y-2">
        <div className="glass-soft pill px-2 py-1.5 inline-flex items-center gap-1 flex-wrap h-9" />
        <div className="input-bubble textarea min-h-[280px]" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="glass-soft pill px-2 py-1.5 inline-flex items-center gap-1 flex-wrap">
        <ToolbarBtn
          label="Negrito (Cmd+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" strokeWidth={2.4} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Itálico (Cmd+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" strokeWidth={2.4} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Sublinhado (Cmd+U)"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-3.5" strokeWidth={2.4} />
        </ToolbarBtn>
        <span className="w-px h-4 bg-pink-soft mx-1" aria-hidden />
        <ToolbarBtn
          label="Destaque rosa"
          tone="hot"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="size-3.5" strokeWidth={2.2} />
        </ToolbarBtn>
        <span className="ml-2 eyebrow-y2k !text-[9px] text-ink-mute">
          Selecione e clique ✦
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({
  children,
  label,
  active,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  tone?: "hot";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "size-7 grid place-items-center rounded-full transition-colors",
        active
          ? tone === "hot"
            ? "bg-pink-hot text-white"
            : "bg-ink text-white"
          : tone === "hot"
            ? "text-pink-hot hover:bg-pink-soft"
            : "text-ink-soft hover:bg-pink-soft hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
