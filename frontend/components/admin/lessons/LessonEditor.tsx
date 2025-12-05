"use client";

import { Button } from "@/components/ui/button";
import { useUpdateLessonContentMutation } from "@/lib/generated/graphql";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface LessonEditorProps {
  lessonId: string;
  initialContent?: string | null;
  isPublished?: boolean;
  onSave?: () => void;
}

export function LessonEditor({
  lessonId,
  initialContent = "",
  isPublished = false,
  onSave,
}: LessonEditorProps) {
  const [updateLessonContent, { loading }] = useUpdateLessonContentMutation();

  // Initialiser Tiptap
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // 👇 UN SEUL useEffect - Mettre à jour l'éditeur quand initialContent change
  useEffect(() => {
    if (!editor) return;

    // Ne pas mettre à jour si l'éditeur a le focus (l'utilisateur est en train d'éditer)
    if (editor.isFocused) {
      console.log("⚠️ Éditeur a le focus, pas de mise à jour");
      return;
    }

    const currentContent = editor.getHTML();

    // Ne mettre à jour que si le contenu est vraiment différent
    if (currentContent !== (initialContent || "")) {
      console.log("🔄 Mise à jour du contenu de l'éditeur");
      editor.commands.setContent(initialContent || "");
    }
  }, [editor, initialContent]);

  // Sauvegarder le contenu
  const handleSave = async () => {
    if (!editor) return;

    const content = editor.getHTML();

    try {
      await updateLessonContent({
        variables: {
          input: {
            lessonId,
            content,
          },
        },
      });

      console.log("✅ Sauvegarde OK");
      toast.success("Content saved successfully!");

      if (onSave) {
        console.log("🔄 Appel de onSave()");
        onSave();
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      toast.error("Failed to save content");
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="space-y-4">

      {/* Toolbar basique */}
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <strong>B</strong>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <em>I</em>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          H2
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          • List
        </Button>

        <div className="flex-1" />

        {/* Bouton sauvegarder */}
        <Button onClick={handleSave} disabled={loading} size="sm">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>

      {/* Zone d'édition */}
      <div className="border rounded-lg bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
