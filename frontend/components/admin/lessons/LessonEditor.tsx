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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetUploadUrlMutation,
  useUpdateLessonContentMutation,
} from "@/lib/generated/graphql";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import {
  Code,
  Edit,
  Eye,
  FileText,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Paperclip,
  Save,
  TableIcon,
  Upload
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AttachmentUploader } from "./AttachmentUploader";

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
  if (!lessonId) {
    console.error("❌ LessonEditor: lessonId is missing!");
    return <div className="text-red-500">Error: Lesson ID is missing</div>;
  }
  // 👇 AJOUTE CETTE SÉCURITÉ
  const safeContent = initialContent || "";

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

  // States pour publication et preview
  const [isPublishedLocal, setIsPublishedLocal] = useState(isPublished);
  const [showPreview, setShowPreview] = useState(false);
  // States pour les vidéos YouTube
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Fonction pour nettoyer les vidéos YouTube invalides
// function sanitizeYoutubeContent(html: string): string {
//   if (!html) return "";

//   // Supprimer les iframes YouTube SANS src
//   return html.replace(
//     /<div[^>]*data-youtube-video[^>]*>([\s\S]*?)<\/div>/gi,
//     (match, inner) => {
//       // Si l'iframe contient src="http...", on garde
//       if (/src="https?:\/\/[^"]+"/i.test(inner)) {
//         return match;
//       }
//       // Sinon on supprime
//       console.log("🗑️ Suppression vidéo YouTube sans src");
//       return '';
//     }
//   );
// }
  // Fonction pour toggle la publication
  const handleTogglePublish = async () => {

    if (!lessonId) {
      console.error("❌ No lessonId!");
      return;
    }

    if (!editor) return;

    const newPublishedState = !isPublishedLocal;


    try {
      const result = await updateLessonContent({
        variables: {
          input: {
            lessonId,
            isPublished: newPublishedState,
          },
        },
      });

      setIsPublishedLocal(newPublishedState);
      toast.success(
        newPublishedState
          ? "Lesson published successfully!"
          : "Lesson unpublished successfully!"
      );

      if (onSave) {
        onSave();
      }
    } catch (error: any) {
      console.error("❌ Full error:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error graphQLErrors:", error.graphQLErrors);
      toast.error("Failed to update publication status");
    }
  };

  // Sync avec les props
  useEffect(() => {
    setIsPublishedLocal(isPublished);
  }, [isPublished]);


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
    //   Youtube.configure({
    //   controls: true,
    //   nocookie: true, // Utilise youtube-nocookie.com (RGPD friendly)
    //   width: 640,
    //   height: 360,
    //   HTMLAttributes: {
    //     class: "rounded-lg my-6",
    //   },
    // }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse table-auto w-full my-4",
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: "border border-gray-300",
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: "border border-gray-300 bg-gray-100 font-bold p-2 text-left",
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border border-gray-300 p-2",
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
    // 👇 Ajoute ça pour gérer les erreurs silencieusement
  onError: ({ error }) => {
    console.warn("⚠️ Tiptap error (ignoré):", error.message);
  },
  });


useEffect(() => {
  if (!editor) return;
  if (editor.isFocused) return;

  console.log("📥 useEffect déclenché");
  console.log("📥 initialContent from DB:", initialContent);

  const currentContent = editor.getHTML();
  console.log("📝 Current editor content:", currentContent);

  // 👇 AJOUTE sanitize ICI AUSSI
   const newContent = initialContent || "";
  console.log("🆕 New content to set:", newContent);

  if (currentContent !== newContent) {
    console.log("⚠️ Content différent - mise à jour de l'éditeur");
    editor.commands.setContent(newContent);
  } else {
    console.log("✅ Content identique - pas de mise à jour");
  }
}, [editor, initialContent]);


  // Sauvegarder le contenu
const handleSave = async () => {
  if (!editor) return;

  const content = editor.getHTML();
  console.log("💾 Contenu sauvegardé:", content);

  // Cherche spécifiquement les vidéos YouTube
  const youtubeMatch = content.match(/<div[^>]*data-youtube-video[^>]*>[\s\S]*?<\/div>/gi);
  console.log("🎥 Vidéos YouTube trouvées:", youtubeMatch);

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

  // Insérer une vidéo YouTube
const handleAddYoutube = () => {
  if (!editor) return;
  setYoutubeUrl("");
  setShowYoutubeDialog(true);
};

const handleSetYoutube = () => {
  if (!editor || !youtubeUrl) return;

  // L'extension extrait automatiquement l'ID de l'URL
  editor.commands.setYoutubeVideo({
    src: youtubeUrl,
  });

  toast.success("Video added successfully!");
  setShowYoutubeDialog(false);
  setYoutubeUrl("");
};

  if (!editor) {
    return <div>Loading editor...</div>;
  }

return (
  <div className="space-y-4">
    {/* Section Publication Status - EN HAUT */}
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={isPublishedLocal}
            onCheckedChange={handleTogglePublish}
            disabled={loading}
          />
          <Label className="cursor-pointer font-medium">
            {isPublishedLocal ? "Published" : "Draft"}
          </Label>
        </div>
        {isPublishedLocal ? (
          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            ✓ Visible to students
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            ⚠ Not visible to students
          </span>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? (
          <>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </>
        )}
      </Button>
    </div>

    {/* Tabs Content et Attachments */}
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">
          <FileText className="w-4 h-4 mr-2" />
          Content
        </TabsTrigger>
        <TabsTrigger value="attachments">
          <Paperclip className="w-4 h-4 mr-2" />
          Attachments
        </TabsTrigger>
      </TabsList>

      {/* TAB CONTENT */}
      <TabsContent value="content" className="space-y-4 mt-4">
        {!showPreview ? (
          <>
            {/* Toolbar */}
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
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
                }
              >
                H1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
                }
              >
                H2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
                }
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

              {/* Table */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={editor.isActive("table") ? "bg-muted" : ""}
                  >
                    <TableIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                  >
                    Insert Table (3x3)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    disabled={!editor.can().addColumnBefore()}
                  >
                    Add Column Before
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    disabled={!editor.can().addColumnAfter()}
                  >
                    Add Column After
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    disabled={!editor.can().deleteColumn()}
                  >
                    Delete Column
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    disabled={!editor.can().addRowBefore()}
                  >
                    Add Row Before
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    disabled={!editor.can().addRowAfter()}
                  >
                    Add Row After
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    disabled={!editor.can().deleteRow()}
                  >
                    Delete Row
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    disabled={!editor.can().deleteTable()}
                    className="text-destructive"
                  >
                    Delete Table
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1" />

              {/* Bouton Save */}
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
            <div className="border rounded-lg bg-white min-h-[400px]">
              <EditorContent editor={editor} />
            </div>
          </>
        ) : (
          <>
            {/* Mode Preview */}
            <div className="border rounded-lg bg-white p-8 min-h-[400px]">
              <div
                className="prose prose-lg max-w-none
                 prose-ul:list-disc prose-ul:pl-6
                 prose-ol:list-decimal prose-ol:pl-6
                 prose-li:ml-0"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
                />
              </div>
            </div>
          </>
        )}
      </TabsContent>

      {/* TAB ATTACHMENTS */}
      <TabsContent value="attachments" className="mt-4">
        <AttachmentUploader lessonId={lessonId} />
      </TabsContent>
    </Tabs>

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
