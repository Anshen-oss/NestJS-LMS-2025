'use client';

import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface UploadProgress {
  filename: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadedMedia {
  mediaId: string;
  filename: string;
  urlOriginal: string;
  urlLarge: string;
  urlMedium: string;
  urlThumbnail: string;
  width: number;
  height: number;
  size: number;
  isDeduped: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useMediaUpload() {
  const { getToken } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Upload multiple files
   * Handles progress tracking and error handling per file
   */
  const uploadFiles = async (files: File[]): Promise<UploadedMedia[]> => {
    setIsUploading(true);
    const results: UploadedMedia[] = [];

    // Initialize progress for all files
    const initialProgress: UploadProgress[] = files.map((file) => ({
      filename: file.name,
      progress: 0,
      status: 'pending' as const,
    }));
    setUploads(initialProgress);

    // Get auth token
    const token = await getToken();
    if (!token) {
      const error = 'Not authenticated';
      setUploads((prev) =>
        prev.map((u) => ({
          ...u,
          status: 'error' as const,
          error,
        }))
      );
      setIsUploading(false);
      return [];
    }

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Update status to uploading
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: 'uploading' as const } : u
          )
        );

        const formData = new FormData();
        formData.append('file', file);

        // Upload with XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<UploadedMedia>((resolve, reject) => {
          const uploadUrl = `${process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace('/graphql', '')}/api/media/upload`;
          console.log('📤 Upload URL:', uploadUrl);
          console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

          // ================================================================
          // Progress tracking
          // ================================================================
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setUploads((prev) =>
                prev.map((u, idx) =>
                  idx === i ? { ...u, progress } : u
                )
              );
            }
          });

          // ================================================================
          // Success handler
          // ================================================================
          xhr.addEventListener('load', () => {
            if (xhr.status === 200 || xhr.status === 201) {
              try {
                const response = JSON.parse(xhr.responseText);
                const media = response.data || response;

                // Validate response
                if (!media.mediaId) {
                  throw new Error('Invalid response: missing mediaId');
                }

                const uploadedMedia: UploadedMedia = {
                  mediaId: media.mediaId,
                  filename: media.filename || file.name,
                  urlOriginal: media.urlOriginal || '',
                  urlLarge: media.urlLarge || '',
                  urlMedium: media.urlMedium || '',
                  urlThumbnail: media.urlThumbnail || '',
                  width: media.width || 0,
                  height: media.height || 0,
                  size: media.size || file.size,
                  isDeduped: media.isDeduped || false,
                };

                console.log('✅ Upload success:', uploadedMedia);
                setUploads((prev) =>
                  prev.map((u, idx) =>
                    idx === i
                      ? { ...u, status: 'success' as const, progress: 100 }
                      : u
                  )
                );

                resolve(uploadedMedia);
              } catch (e) {
                const errorMsg =
                  e instanceof Error ? e.message : 'Failed to parse response';
                console.error('❌ Parse error:', errorMsg);
                setUploads((prev) =>
                  prev.map((u, idx) =>
                    idx === i
                      ? { ...u, status: 'error' as const, error: errorMsg }
                      : u
                  )
                );
                reject(new Error(errorMsg));
              }
            } else {
              // Server error - affiche le message détaillé du backend
              let errorMsg = `Upload failed: ${xhr.status}`;
              try {
                const response = JSON.parse(xhr.responseText);
                errorMsg = response.message || response.error || errorMsg;
              } catch (e) {
                // Parse error, use default
              }

              console.error('❌ Upload server error:', errorMsg);
              setUploads((prev) =>
                prev.map((u, idx) =>
                  idx === i
                    ? { ...u, status: 'error' as const, error: errorMsg }
                    : u
                )
              );
              reject(new Error(errorMsg));
            }
          });

          // ================================================================
          // Error handlers
          // ================================================================
          xhr.addEventListener('error', () => {
            let errorMsg = 'Network error during upload';
            try {
              const response = JSON.parse(xhr.responseText);
              errorMsg = response.message || response.error || errorMsg;
            } catch (e) {
              // Parse error, use default
            }

            console.error('❌ Network error:', errorMsg);
            setUploads((prev) =>
              prev.map((u, idx) =>
                idx === i
                  ? { ...u, status: 'error' as const, error: errorMsg }
                  : u
              )
            );
            reject(new Error(errorMsg));
          });

          xhr.addEventListener('abort', () => {
            const errorMsg = 'Upload cancelled';
            console.error('❌ Abort:', errorMsg);
            setUploads((prev) =>
              prev.map((u, idx) =>
                idx === i
                  ? { ...u, status: 'error' as const, error: errorMsg }
                  : u
              )
            );
            reject(new Error(errorMsg));
          });

          // ================================================================
          // Send request
          // ================================================================
          xhr.open('POST', uploadUrl);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });

        const result = await uploadPromise;
        results.push(result);
      } catch (error) {
        // Error already handled in xhr event listeners
        const errorMsg =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Upload failed for ${file.name}:`, errorMsg);
      }
    }

    setUploadedMedia((prev) => [...prev, ...results]);
    setIsUploading(false);

    return results;
  };

  /**
   * Reset upload state
   */
  const reset = () => {
    setUploads([]);
    setUploadedMedia([]);
    setIsUploading(false);
  };

  return {
    uploads,
    uploadedMedia,
    isUploading,
    uploadFiles,
    reset,
  };
}
