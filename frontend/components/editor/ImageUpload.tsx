"use client";

import { gql, useMutation } from "@apollo/client";
import { Upload } from "lucide-react";
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

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
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

        // 3. Retourner l'URL publique
        onImageUploaded(publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
    },
    [getUploadUrl, onImageUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6
        cursor-pointer transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Uploading..."
            : isDragActive
            ? "Drop the image here"
            : "Click or drag an image to upload"}
        </p>
      </div>
    </div>
  );
}
