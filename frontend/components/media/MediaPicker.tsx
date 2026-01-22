'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation, useQuery } from '@apollo/client';
import { Image, Loader2, Upload } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  GET_MY_MEDIA_LIBRARY,
  TRACK_MEDIA_USAGE,
} from './media-library.graphql';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MediaAsset {
  id: string;
  filename: string;
  urlThumbnail: string;
  urlMedium: string;
  urlLarge: string;
  urlOriginal: string;
  width: number;
  height: number;
  createdAt: string;
  usageCount: number;
}

interface MediaPickerProps {
  onSelectAction: (media: MediaAsset) => void;  // ← Renamed with "Action" suffix
  onUploadAction?: (media: MediaAsset) => void; // ← Renamed with "Action" suffix
  previewSize?: 'thumb' | 'medium' | 'large';
  autoOpen?: boolean;
  showUpload?: boolean;
  buttonLabel?: string;
}

// ============================================================================
// MEDIA PICKER COMPONENT
// ============================================================================

export function MediaPicker({
  onSelectAction,
  onUploadAction,
  previewSize = 'medium',
  autoOpen = false,
  showUpload = true,
  buttonLabel = 'Select Image',
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, refetch } = useQuery(GET_MY_MEDIA_LIBRARY, {
    skip: !isOpen,
  });

  const [trackUsage] = useMutation(TRACK_MEDIA_USAGE);

  const library = data?.getMyMediaLibrary ?? [];

  const handleSelectMedia = useCallback(
    async (media: MediaAsset) => {
      try {
        await trackUsage({
          variables: { mediaId: media.id },
        });

        onSelectAction(media); // ← Use the renamed prop
        setIsOpen(false);
        toast.success('Image selected');
      } catch (error) {
        toast.error('Failed to select image');
        console.error(error);
      }
    },
    [onSelectAction, trackUsage]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploadingNew(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }

        const result = await response.json();

        const newMedia: MediaAsset = {
          id: result.mediaId,
          filename: result.filename,
          urlThumbnail: result.urlThumbnail,
          urlMedium: result.urlMedium,
          urlLarge: result.urlLarge,
          urlOriginal: result.urlOriginal,
          width: result.width,
          height: result.height,
          createdAt: new Date().toISOString(),
          usageCount: 0,
        };

        onSelectAction(newMedia);
        onUploadAction?.(newMedia); // ← Use the renamed prop

        await refetch();

        toast.success(
          result.isDeduped
            ? 'File already existed, reused!'
            : 'Image uploaded successfully'
        );

        setIsOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Upload failed'
        );
        console.error(error);
      } finally {
        setIsUploadingNew(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onSelectAction, onUploadAction, refetch]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getPreviewUrl = (media: MediaAsset): string => {
    switch (previewSize) {
      case 'thumb':
        return media.urlThumbnail;
      case 'large':
        return media.urlLarge;
      case 'medium':
      default:
        return media.urlMedium;
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Image className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select or Upload Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {showUpload && (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  Drag & drop or click to upload
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingNew}
                  className="hidden"
                />
                <Button
                  onClick={handleUploadClick}
                  disabled={isUploadingNew}
                  size="sm"
                >
                  {isUploadingNew ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Choose File'
                  )}
                </Button>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-3">Your Library</h3>

              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>Failed to load library</p>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {!loading && !error && library.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No images yet. Upload one to get started!</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {library.map((media: MediaAsset) => (
                  <MediaAssetThumbnail
                    key={media.id}
                    media={media}
                    previewUrl={getPreviewUrl(media)}
                    isSelected={selectedMedia?.id === media.id}
                    onClick={() => setSelectedMedia(media)}
                  />
                ))}
              </div>

              {selectedMedia && (
                <div className="mt-4 flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSelectMedia(selectedMedia)}
                  >
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================================
// MEDIA ASSET THUMBNAIL COMPONENT
// ============================================================================

interface MediaAssetThumbnailProps {
  media: MediaAsset;
  previewUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

function MediaAssetThumbnail({
  media,
  previewUrl,
  isSelected,
  onClick,
}: MediaAssetThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-square rounded-lg overflow-hidden
        border-2 transition cursor-pointer
        ${
          isSelected
            ? 'border-blue-500 ring-2 ring-blue-500'
            : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <img
        src={previewUrl}
        alt={media.filename}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center">
        <span className="text-xs text-white text-center px-2 truncate">
          {media.filename}
        </span>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
