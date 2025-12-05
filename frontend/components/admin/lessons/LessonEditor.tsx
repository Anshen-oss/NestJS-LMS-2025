"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetUploadUrlMutation,
  useUpdateLessonContentMutation,
} from "@/lib/generated/graphql";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import {
  Code,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const lowlight = createLowlight(common);

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
  const [getUploadUrl] = useGetUploadUrlMutation();

  // States pour les liens
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // States pour les images
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Initialiser Tiptap avec Image extension
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-gray-900 text-gray-100 p-4 font-mono text-sm",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
    ],
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4 max-w-none",
      },
    },
  });

  // Mettre à jour l'éditeur quand initialContent change
  useEffect(() => {
    if (!editor) return;

    if (editor.isFocused) {
      return;
    }

    const currentContent = editor.getHTML();
    if (currentContent !== (initialContent || "")) {
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

      toast.success("Content saved successfully!");

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      toast.error("Failed to save content");
    }
  };

  // Ajouter un lien
  const handleAddLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setShowLinkDialog(true);
  };

  const handleSetLink = () => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkDialog(false);
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();

    setShowLinkDialog(false);
    setLinkUrl("");
  };

  // Gérer la sélection d'image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Uploader l'image
  const handleUploadImage = async () => {
    if (!selectedFile || !editor) return;

    setUploadingImage(true);

    try {
      // 1. Demander l'URL pré-signée
      const { data } = await getUploadUrl({
        variables: {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
        },
      });

      if (!data?.getUploadUrl) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, publicUrl } = data.getUploadUrl;

      // 2. Uploader vers S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // 3. Insérer dans l'éditeur
      editor.chain().focus().setImage({ src: publicUrl }).run();

      toast.success("Image uploaded successfully!");
      setShowImageDialog(false);
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar enrichie */}
      <div className="flex items-center gap-1 p-2 border rounded-lg bg-muted/50 flex-wrap">
        {/* Formatage de base */}
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
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-muted" : ""}
        >
          <s>S</s>
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
        >
          H1
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        >
          H3
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Listes */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          • List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          1. List
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lien */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddLink}
          className={editor.isActive("link") ? "bg-muted" : ""}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {/* Code block */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-muted" : ""}
        >
          <Code className="w-4 h-4" />
        </Button>

        {/* Image */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageDialog(true)}
        >
          <ImageIcon className="w-4 h-4" />
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

      {/* Dialog pour ajouter un lien */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>
              Enter the URL you want to link to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSetLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowLinkDialog(false);
                setLinkUrl("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSetLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour uploader une image */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Select an image to insert into your lesson content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image File</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploadingImage}
              />
              <p className="text-xs text-muted-foreground">
                Max size: 5MB. Formats: JPG, PNG, GIF, WebP
              </p>
            </div>

            {/* Prévisualisation */}
            {imagePreview && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImageDialog(false);
                setSelectedFile(null);
                setImagePreview(null);
              }}
              disabled={uploadingImage}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadImage}
              disabled={!selectedFile || uploadingImage}
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
