"use client";

import { Button } from "@/components/ui/button";
import { gql, useMutation } from "@apollo/client";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const GET_UPLOAD_URL = gql`
  mutation GetUploadUrl($fileName: String!, $contentType: String!) {
    getUploadUrl(fileName: $fileName, contentType: $contentType) {
      uploadUrl
      publicUrl
    }
  }
`;

interface ThumbnailUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const [getUploadUrl, { loading }] = useMutation(GET_UPLOAD_URL);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        // 1. Obtenir l'URL pré-signée
        const { data } = await getUploadUrl({
          variables: {
            fileName: file.name,
            contentType: file.type,
          },
        });

        const { uploadUrl, publicUrl } = data.getUploadUrl;

        // 2. Upload vers S3
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        // 3. Mettre à jour la valeur
        onChange(publicUrl);
        toast.success("Thumbnail uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload thumbnail");
      }
    },
    [getUploadUrl, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: loading,
  });

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
        <Image src={value} alt="Thumbnail" fill className="object-cover" />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12
        cursor-pointer transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {loading
              ? "Uploading..."
              : isDragActive
              ? "Drop the image here"
              : "Click or drag a thumbnail image"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended: 16:9 aspect ratio, max 2MB
          </p>
        </div>
      </div>
    </div>
  );
}
