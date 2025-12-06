"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLessonAttachmentMutation,
  useDeleteLessonAttachmentMutation,
  useGetUploadUrlMutation,
  useLessonAttachmentsQuery,
} from "@/lib/generated/graphql";
import { Download, FileText, Loader2, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AttachmentUploaderProps {
  lessonId: string;
}

export function AttachmentUploader({ lessonId }: AttachmentUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data, loading, refetch } = useLessonAttachmentsQuery({
    variables: { lessonId },
  });

  const [getUploadUrl] = useGetUploadUrlMutation();
  const [createAttachment] = useCreateLessonAttachmentMutation();
  const [deleteAttachment] = useDeleteLessonAttachmentMutation();

  // Gérer la sélection de fichier
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  // Uploader le fichier
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // 1. Demander l'URL pré-signée
      const { data: urlData } = await getUploadUrl({
        variables: {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
        },
      });

      if (!urlData?.getUploadUrl) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, publicUrl } = urlData.getUploadUrl;

      // 2. Uploader vers S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // 3. Créer l'attachement en BDD
      await createAttachment({
        variables: {
          input: {
            lessonId,
            fileName: selectedFile.name,
            fileUrl: publicUrl,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
          },
        },
      });

      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Supprimer un fichier
  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;

    try {
      await deleteAttachment({
        variables: { id },
      });

      toast.success("File deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const attachments = data?.lessonAttachments || [];

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-semibold mb-3">Attach Files</h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max size: 10MB. Supported: PDF, DOC, DOCX, XLS, XLSX, ZIP, TXT
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Liste des fichiers */}
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : attachments.length > 0 ? (
        <div className="space-y-2">
          <h3 className="font-semibold">Attached Files ({attachments.length})</h3>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors"
              >
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachment.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.fileSize)} • {new Date(attachment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attachment.id, attachment.fileName)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No files attached yet
        </p>
      )}
    </div>
  );
}
