'use client';

import {
  DELETE_MEDIA,
  GET_MY_MEDIA_LIBRARY,
} from '@/components/media/media-library.graphql';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApolloClient } from '@/lib/apollo-client';
import { ApolloProvider, useMutation, useQuery } from '@apollo/client';
import { Download, Loader2, Plus, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UploadModal } from './UploadModal';

// ============================================================================
// PAGE: MEDIA LIBRARY
// ============================================================================

interface MediaAsset {
  id: string;
  filename: string;
  urlThumbnail: string;
  urlMedium: string;
  urlLarge: string;
  size: number;
  createdAt: string;
  usageCount: number;
}

function MediaLibraryPageContent() {
  const [skip, setSkip] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const pageSize = 20;

  const { data, loading, error, refetch } = useQuery(GET_MY_MEDIA_LIBRARY, {
    variables: { skip, take: pageSize },
  });

  const [deleteMedia] = useMutation(DELETE_MEDIA, {
    onCompleted: () => {
      toast.success('Image deleted');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });

  const library = data?.getMyMediaLibrary ?? [];
  const total = library.length;
  const hasNextPage = library.length === pageSize;
  const hasPreviousPage = skip > 0;

  // ──────────────────────────────────────────────────────────────────────
  // 🎬 HANDLERS
  // ──────────────────────────────────────────────────────────────────────

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;

    await deleteMedia({
      variables: { mediaId },
    });
  };

  const handleDownload = async (urlOriginal: string, filename: string) => {
    try {
      const response = await fetch(urlOriginal, { mode: 'no-cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = (mediaId: string) => {
    const url = `${window.location.origin}/media/${mediaId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleUploadComplete = (mediaIds: string[]) => {
    toast.success(`${mediaIds.length} image(s) uploaded!`);
    setIsUploadModalOpen(false);
    refetch(); // Refresh the library
  };

  // 📊 COMPUTED
  const filteredLibrary = library.filter((media: MediaAsset) =>
    media.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ──────────────────────────────────────────────────────────────────────
  // 🎨 RENDER
  // ──────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Media Library</h1>
            <p className="text-gray-600">
              Manage your images. Total: {total} images
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <Input
              placeholder="Search images by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md placeholder:text-gray-700"
            />
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              <p>Failed to load library: {error.message}</p>
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

          {/* Empty state */}
          {!loading && !error && library.length === 0 && (
            <div className="bg-white p-16 rounded-lg shadow-sm border text-center">
              <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-6 text-lg">No images yet</p>
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload First Image
              </Button>
            </div>
          )}

          {/* Image grid */}
          {!loading && !error && filteredLibrary.length > 0 && (
            <>
              {/* Upload button (top right) */}
              <div className="mb-6 flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {filteredLibrary.map((media: MediaAsset) => (
                  <MediaLibraryCard
                    key={media.id}
                    media={media}
                    onDelete={() => handleDelete(media.id)}
                    onDownload={() =>
                      handleDownload(media.urlLarge, media.filename)
                    }
                    onShare={() => handleShare(media.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {skip + 1}-{Math.min(skip + pageSize, total)} of{' '}
                  {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSkip(Math.max(0, skip - pageSize))}
                    disabled={!hasPreviousPage}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setSkip(skip + pageSize)}
                    disabled={!hasNextPage}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}

export default function MediaLibraryPage() {
  const apolloClient = useApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <MediaLibraryPageContent />
    </ApolloProvider>
  );
}

// ============================================================================
// MEDIA CARD COMPONENT
// ============================================================================

interface MediaCardProps {
  media: MediaAsset;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
}

function MediaLibraryCard({
  media,
  onDelete,
  onDownload,
  onShare,
}: MediaCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
      {/* Image preview */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={media.urlMedium}
          alt={media.filename}
          className="w-full h-full object-cover hover:scale-105 transition"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium truncate">{media.filename}</p>
        <p className="text-xs text-gray-500">
          {new Date(media.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Used {media.usageCount} times
        </p>
      </div>

      {/* Actions */}
      <div className="p-3 border-t flex gap-2">
        <Button
          onClick={onDownload}
          variant="ghost"
          size="sm"
          className="flex-1"
          title="Download original"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          onClick={onShare}
          variant="ghost"
          size="sm"
          className="flex-1"
          title="Copy share link"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onDelete}
          variant="ghost"
          size="sm"
          className="flex-1 text-red-500 hover:text-red-700"
          title="Delete image"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
