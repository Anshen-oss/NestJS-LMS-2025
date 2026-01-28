'use client';

import { useAdminUser } from '@/app/contexts/AdminUserContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MediaAsset {
  id: string;
  filename: string;
  urlMedium: string;
  urlLarge: string;
}

export default function AdminAvatarSettingsPage() {
  const { user: adminUser, loading: adminLoading, refetch } = useAdminUser();
  const { getToken } = useAuth();

  const [currentAvatar, setCurrentAvatar] = useState<string>('/default-avatar.png');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaAsset | null>(null);
  const [images, setImages] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ Initialiser depuis le contexte
  useEffect(() => {
    if (adminUser) {
      setCurrentAvatar(adminUser.avatar?.urlMedium || adminUser.image || '/default-avatar.png');
      setUserName(adminUser.name);
      setUserEmail(adminUser.email);
    }
  }, [adminUser]);

  // ✅ Charger la media library
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) return;

        const res = await fetch('http://localhost:4000/api/user/media?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setImages(data.assets || []);
      } catch (error) {
        console.error('❌ [ADMIN AVATAR] Error loading images:', error);
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [getToken]);

  // ✅ Upload nouvelle image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = await getToken();
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:4000/api/user/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();
      console.log('✅ [ADMIN AVATAR] Upload success:', data);

      // Recharger la library
      const mediaRes = await fetch('http://localhost:4000/api/user/media?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const mediaData = await mediaRes.json();
      setImages(mediaData.assets || []);

      toast.success('Image uploaded!');
      setIsUploading(false);
    } catch (error) {
      console.error('❌ [ADMIN AVATAR] Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      setIsUploading(false);
    }
  };

  // ✅ Confirmer l'avatar
  const handleConfirmAvatar = async () => {
    if (!selectedImage) return;

    try {
      setIsUpdating(true);
      const token = await getToken();
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      const res = await fetch('http://localhost:4000/api/user/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatarMediaId: selectedImage.id })
      });

      if (!res.ok) throw new Error('Failed to update');

      console.log('✅ [ADMIN AVATAR] Avatar updated successfully');

      // ✅ Dispatcher event pour sync
      window.dispatchEvent(new CustomEvent('avatar-updated'));
      console.log('📢 [ADMIN AVATAR] avatar-updated event dispatched!');

      // ✅ Refetch du contexte
      await refetch();
      console.log('✅ [ADMIN AVATAR] Context refetched!');

      setCurrentAvatar(selectedImage.urlMedium);
      setSelectedImage(null);

      toast.success('Avatar updated! 🎉');
      setIsUpdating(false);

    } catch (error) {
      console.error('❌ [ADMIN AVATAR] Error updating avatar:', error);
      toast.error('Failed to update avatar');
      setIsUpdating(false);
    }
  };

  const displayedImages = images.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Change Profile Picture</h1>

      {/* Current Avatar & Preview */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        {/* Current Avatar */}
        <div>
          <h2 className="text-lg font-bold mb-4">Current Avatar</h2>
          <div className="relative w-40 h-40 bg-gray-100 rounded-full overflow-hidden">
            <Image
              src={currentAvatar}
              alt="current avatar"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-600 mt-4">{userEmail}</p>
          <p className="text-sm text-gray-500">{userName}</p>
        </div>

        {/* Selected Avatar Preview */}
        {selectedImage && (
          <div>
            <h2 className="text-lg font-bold mb-4">Preview</h2>
            <div className="relative w-40 h-40 bg-gray-100 rounded-full overflow-hidden">
              <Image
                src={selectedImage.urlMedium}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedImage(null)}
              >
                Change
              </Button>
              <Button
                onClick={handleConfirmAvatar}
                disabled={isUpdating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isUpdating ? 'Saving...' : '✅ Confirm'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="border-t pt-8 mb-8">
        <h2 className="text-lg font-bold mb-4">📤 Upload a new image</h2>
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Drag & drop or click to upload</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </div>
        </label>
        {isUploading && <p className="mt-2 text-blue-600">Uploading...</p>}
      </div>

      {/* Image Library */}
      <div className="border-t pt-8">
        <h2 className="text-lg font-bold mb-4">Select from your library ({images.length} images)</h2>

        {loading ? (
          <p className="text-gray-600">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-600">No images yet. Upload one above!</p>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {displayedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-full h-32 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage?.id === img.id
                      ? 'border-purple-500 ring-2 ring-purple-300'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={img.urlMedium}
                    alt={img.filename}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </Button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
