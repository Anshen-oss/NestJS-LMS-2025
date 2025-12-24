"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useGetUploadUrlForVideoMutation } from "@/lib/generated/graphql";
import { Loader2, Upload, Video, X } from "lucide-react";
import { useRef, useState } from "react";

interface VideoUploadProps {
  videoUrl?: string;        // URL actuelle de la vidéo
  videoKey?: string;        // Key actuelle de la vidéo
  onChange: (data: { videoUrl: string; videoKey: string }) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function VideoUpload({
  videoUrl,
  videoKey,
  onChange,
  onRemove,
  disabled = false,
}: VideoUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mutation GraphQL pour obtenir le signed URL
  const [getUploadUrl] = useGetUploadUrlForVideoMutation();

  // Constantes de validation
  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
  const ALLOWED_TYPES = ["video/mp4", "video/webm"];
  const ALLOWED_EXTENSIONS = [".mp4", ".webm"];

  // Valider le fichier
  const validateFile = (file: File): string | null => {
    // Vérifier le type MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Format non supporté. Utilisez ${ALLOWED_EXTENSIONS.join(" ou ")}`;
    }

    // Vérifier l'extension
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      return `Extension non valide. Utilisez ${ALLOWED_EXTENSIONS.join(" ou ")}`;
    }

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      return `La vidéo ne doit pas dépasser 2GB (taille: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB)`;
    }

    return null;
  };

  // Gérer la sélection du fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valider le fichier
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Erreur de validation",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  // Upload vers S3
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Obtenir le signed URL + key
      const { data } = await getUploadUrl({
        variables: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        },
      });

      if (!data?.getUploadUrlForVideo) {
        throw new Error("Impossible d'obtenir l'URL de téléchargement");
      }

      const { uploadUrl, publicUrl, key } = data.getUploadUrlForVideo;

      // 2. Upload direct vers S3 avec progression
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          // Retourner videoUrl ET videoKey
          onChange({ videoUrl: publicUrl, videoKey: key });

          toast({
            title: "✅ Vidéo uploadée",
            description: "La vidéo a été téléchargée avec succès",
          });
          setSelectedFile(null);
          setIsUploading(false);
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
      });

      xhr.addEventListener("error", () => {
        throw new Error("Erreur réseau pendant l'upload");
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", selectedFile.type);
      xhr.send(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible de télécharger la vidéo. Réessayez.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Supprimer la vidéo
  const handleRemove = () => {
    onRemove();
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview de la vidéo existante */}
      {videoUrl && !selectedFile && (
        <div className="relative rounded-lg overflow-hidden border bg-slate-50">
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video object-cover"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            type="button"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Zone de sélection de fichier */}
      {!videoUrl && !selectedFile && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition">
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
            onChange={handleFileChange}
            className="hidden"
            id="video-upload"
            disabled={disabled}
          />
          <label
            htmlFor="video-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Video className="h-10 w-10 text-slate-400" />
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-blue-600 hover:text-blue-700">
                Cliquez pour choisir
              </span>{" "}
              ou glissez une vidéo
            </div>
            <p className="text-xs text-slate-500 mt-2">
              MP4 ou WebM (max 2GB) • Recommandé : 1080p
            </p>
          </label>
        </div>
      )}

      {/* Fichier sélectionné */}
      {selectedFile && (
        <div className="border rounded-lg p-4 bg-slate-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Video className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>

                {/* Barre de progression */}
                {isUploading && (
                  <div className="mt-3 space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-slate-600">
                      Upload en cours... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!isUploading && (
                <>
                  <Button
                    onClick={handleUpload}
                    size="sm"
                    className="flex items-center gap-2"
                    type="button"
                    disabled={disabled}
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                  <Button
                    onClick={handleRemove}
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
              {isUploading && (
                <Button disabled size="sm" type="button">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
