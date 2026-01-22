'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useMediaUpload } from './useMediaUpload';

// ============================================================================
// TYPES
// ============================================================================

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (mediaIds: string[]) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

// ============================================================================
// MODAL
// ============================================================================

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadModalProps) {
  const { uploads, isUploading, uploadFiles, reset } = useMediaUpload();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  /**
   * Validate files before upload
   */
  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    if (files.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed at once`);
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type (JPG, PNG, WebP, GIF only)`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 10MB)`);
      } else {
        valid.push(file);
      }
    }

    return { valid, errors };
  };

  /**
   * Handle file selection from input or drag & drop
   */
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const { valid, errors } = validateFiles(fileArray);

      if (errors.length > 0) {
        errors.forEach((error) => alert(error));
      }

      setSelectedFiles(valid);
    },
    []
  );

  /**
   * Drag & drop handlers
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    handleFiles(e.dataTransfer.files);
  };

  /**
   * Handle file input click
   */
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle upload
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const results = await uploadFiles(selectedFiles);

    if (onUploadComplete && results.length > 0) {
      onUploadComplete(results.map((m) => m.mediaId));
    }
  };

  /**
   * Handle close and cleanup
   */
  const handleClose = () => {
    if (!isUploading) {
      setSelectedFiles([]);
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  const successCount = uploads.filter((u) => u.status === 'success').length;
  const errorCount = uploads.filter((u) => u.status === 'error').length;
  const hasErrors = errorCount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {uploads.length === 0 ? (
            // No uploads yet - show file picker
            <>
              {/* Drag & drop area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-700 font-medium mb-2">
                  Drop files here or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  from your computer
                </p>
                <Button
                  onClick={handleFileInputClick}
                  variant="outline"
                  disabled={isUploading}
                  className="text-gray-600"
                >
                  📁 Select Files
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_TYPES.join(',')}
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                <p className="font-medium mb-2">Requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Supported: JPG, PNG, WebP, GIF</li>
                  <li>✓ Max 10MB per file</li>
                  <li>✓ Max {MAX_FILES} files at once</li>
                </ul>
              </div>

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">
                    Selected ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-700 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)}MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Upload in progress or complete - show progress
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.filename} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {upload.filename}
                    </span>
                    {upload.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                    {upload.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  {upload.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}

                  {upload.error && (
                    <p className="text-xs text-red-600">{upload.error}</p>
                  )}

                  {upload.status === 'success' && (
                    <p className="text-xs text-green-600">Upload complete</p>
                  )}
                </div>
              ))}

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-700">
                  Uploaded: <span className="font-medium">{successCount}</span> /
                  Errors: <span className="font-medium">{errorCount}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            onClick={handleClose}
            variant="outline"
            disabled={isUploading}
            className="text-gray-600"
          >
            {uploads.length > 0 ? 'Close' : 'Cancel'}
          </Button>
          {uploads.length === 0 && selectedFiles.length > 0 && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload ({selectedFiles.length})
            </Button>
          )}
          {uploads.length > 0 && !isUploading && (
            <Button
              onClick={() => {
                setSelectedFiles([]);
                reset();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
