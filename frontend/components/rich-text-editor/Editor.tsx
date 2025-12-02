"use client";
import TiptapImage from "@tiptap/extension-image"; // ← Change "Image" en "TiptapImage"
import TiptapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Menubar } from "../editor/Menubar";

export function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage.configure({  // ← Utilise TiptapImage
        inline: true,
        allowBase64: true,
      }),
      TiptapLink.configure({   // ← Utilise TiptapLink
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer hover:text-primary/80",
        },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
content: (() => {
  try {
    return field.value && field.value !== ""
      ? JSON.parse(field.value)
      : { type: "doc", content: [] };
  } catch (e) {
    return { type: "doc", content: [] };
  }
})(),  });

  // ✅ Mettre à jour le contenu quand field.value change
  useEffect(() => {
    if (editor && field.value) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = field.value;

      // Ne mettre à jour que si le contenu a vraiment changé
      if (currentContent !== newContent) {
        try {
          const parsedContent = JSON.parse(newContent);
          editor.commands.setContent(parsedContent);
        } catch (e) {
          console.error("Error parsing Tiptap content:", e);
        }
      }
    }
  }, [editor, field.value]);

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
