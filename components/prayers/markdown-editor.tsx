"use client";

import { Markdown } from "@tiptap/markdown";
import { Extension, type Editor } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Italic, List, ListOrdered, MessageSquareQuote, Quote, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { FIELD } from "@/components/field";

type Tool = { label: string; icon: LucideIcon; active?: string | [string, object]; run: (e: Editor) => void };

/** Highlights “curly quoted” spans while typing, matching how PrayerBody renders them. */
const QuoteHighlight = Extension.create({
  name: "quoteHighlight",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc }) => {
            const found: Decoration[] = [];
            doc.descendants((node, pos) => {
              if (!node.isText || !node.text) return;
              for (const m of node.text.matchAll(/\u201c[^\u201d\n]+\u201d/g)) {
                found.push(Decoration.inline(pos + m.index, pos + m.index + m[0].length, { class: "prayer-mark" }));
              }
            });
            return DecorationSet.create(doc, found);
          },
        },
      }),
    ];
  },
});

/** Wrap the selection in curly quotes (plain text, so it needs no markdown), or unwrap it. */
function toggleQuotes(editor: Editor) {
  const { from, to, empty } = editor.state.selection;
  const doc = editor.state.doc;
  const chain = editor.chain().focus();
  if (empty) {
    chain.insertContent("\u201c\u201d").setTextSelection(from + 1).run();
  } else if (doc.textBetween(from - 1, from) === "\u201c" && doc.textBetween(to, to + 1) === "\u201d") {
    chain.deleteRange({ from: to, to: to + 1 }).deleteRange({ from: from - 1, to: from }).run();
  } else {
    chain.insertContentAt(to, "\u201d").insertContentAt(from, "\u201c").setTextSelection({ from: from + 1, to: to + 1 }).run();
  }
}

const TOOLS: Tool[] = [
  { label: "Bold", icon: Bold, active: "bold", run: (e) => e.chain().focus().toggleBold().run() },
  { label: "Italic", icon: Italic, active: "italic", run: (e) => e.chain().focus().toggleItalic().run() },
  { label: "Heading", icon: Heading2, active: ["heading", { level: 2 }], run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: "Bullet list", icon: List, active: "bulletList", run: (e) => e.chain().focus().toggleBulletList().run() },
  { label: "Numbered list", icon: ListOrdered, active: "orderedList", run: (e) => e.chain().focus().toggleOrderedList().run() },
  { label: "Quote", icon: Quote, active: "blockquote", run: (e) => e.chain().focus().toggleBlockquote().run() },
  { label: "Quotation marks", icon: MessageSquareQuote, run: toggleQuotes },
];

/**
 * WYSIWYG prayer editor. Stored as markdown in a hidden `body` input, restricted to what
 * `PrayerBody` can render (bold, italic, ## headings, lists, quotes, rules, line breaks).
 */
export function MarkdownEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const [markdown, setMarkdown] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ code: false, codeBlock: false, strike: false, link: false, underline: false, heading: { levels: [1, 2] } }),
      Markdown.configure({ markedOptions: { breaks: true } }),
      QuoteHighlight,
    ],
    content: defaultValue,
    contentType: "markdown",
    editorProps: {
      attributes: {
        id: "body",
        "aria-label": "Prayer",
        class: `${FIELD} prayer-text prayer-editor min-h-72 py-3`,
      },
    },
    onUpdate: ({ editor }) => setMarkdown(editor.getMarkdown()),
  });

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="body" value={markdown} />
      <div role="toolbar" aria-label="Formatting" className="-ml-2 flex overflow-x-auto">
        {TOOLS.map(({ label, icon: Icon, active, run }) => {
          const on = editor && active ? (Array.isArray(active) ? editor.isActive(active[0], active[1]) : editor.isActive(active)) : false;
          return (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-pressed={on}
              title={label}
              disabled={!editor}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor && run(editor)}
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-muted active:bg-muted ${on ? "bg-muted text-primary" : "text-foreground"}`}
            >
              <Icon className="size-5" aria-hidden />
            </button>
          );
        })}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
