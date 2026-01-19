'use client';

import { useToast } from '@/hooks/use-toast';
import { useUpdateUserAvatarMutation } from '@/lib/generated/graphql';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  currentUserName: string;
  onSuccess?: (newUrl: string) => void;
  onUploadComplete?: () => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  currentUserName,
  onSuccess,
  onUploadComplete,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [updateUserAvatar] = useUpdateUserAvatarMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📤 Début upload du fichier:', selectedFile.name);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Upload échoué: ${errorData.message}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('✅ Upload réussi:', uploadData);

      if (!uploadData.success || !uploadData.avatarUrl) {
        throw new Error(uploadData.message || 'Erreur lors de l\'upload');
      }

      const { avatarUrl, avatarKey } = uploadData;
      console.log('📸 Avatar URL reçue:', avatarUrl);
      console.log('🔑 Avatar Key:', avatarKey);

      // ✅ Mutation GraphQL SANS refetchQueries
      console.log('🔄 Appelant mutation updateUserAvatar...');
      const result = await updateUserAvatar({
        variables: { avatarUrl, avatarKey },
      });

      console.log('📋 Résultat mutation:', result);

      if (result.data?.updateUserAvatar?.success) {
        console.log('✅ Mutation réussie, user:', result.data.updateUserAvatar.user);

        toast({
          title: 'Avatar changé!',
          description: 'Votre photo a été mise à jour.',
          variant: 'default',
        });

        // ✅ Appelle onSuccess IMMÉDIATEMENT (avant d'effacer preview)
        console.log('📞 Appelant onSuccess avec URL:', avatarUrl);
        onSuccess?.(avatarUrl);

        // ✅ Appelle onUploadComplete pour refetch les données
        console.log('🔄 Appelant onUploadComplete...');
        onUploadComplete?.();

        // ✅ EFFACE le preview APRÈS que refetch soit complètement terminé
        // Attends 500ms (au lieu de 100ms) pour que:
        // 1. Le parent reçoive les nouvelles données du refetch
        // 2. Le composant re-render avec la nouvelle image
        // 3. PUIS on efface la preview locale
        setTimeout(() => {
          setPreview(null);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          console.log('✅ Preview et selectedFile effacés');
        }, 500);
      } else {
        throw new Error('La sauvegarde en BD a échoué');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      console.error('❌ Avatar upload error:', err);
      setError(msg);
      toast({
        title: 'Erreur',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ IMPORTANT: Afficher l'image du serveur si elle existe ET qu'on n'a pas de preview local
  // Sinon afficher la preview locale (pendant l'upload)
  const displayImage = preview || currentAvatarUrl;

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isLoading ? 'Upload...' : 'Upload'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Afficher l'avatar actuel du serveur s'il existe */}
          {currentAvatarUrl && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={currentAvatarUrl}
                alt={currentUserName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Choisir une image
          </button>
        </div>
      )}
    </div>
  );
}
