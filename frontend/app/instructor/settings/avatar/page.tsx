'use client';

import { MediaPicker } from '@/components/media/MediaPicker';
import { Button } from '@/components/ui/button';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

// ============================================================================
// GRAPHQL OPERATIONS
// ============================================================================

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      name
      email
      image
      avatar {
        id
        urlMedium
        urlLarge
      }
    }
  }
`;

const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($avatarMediaId: String!) {
    updateUserAvatar(avatarMediaId: $avatarMediaId) {
      id
      email
      name
      image
      avatar {
        id
        urlThumbnail
        urlMedium
        urlLarge
      }
    }
  }
`;

// ============================================================================
// PAGE: AVATAR SETTINGS
// ============================================================================

interface MediaAsset {
  id: string;
  urlMedium: string;
  urlLarge: string;
  [key: string]: any;
}

export default function AvatarSettingsPage() {
  const [showPicker, setShowPicker] = useState(false);

  // Get current user
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const user = data?.getCurrentUser;

  // Update avatar mutation
  const [updateAvatar, { loading: isUpdating }] = useMutation(
    UPDATE_USER_AVATAR,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      onCompleted: () => {
        toast.success('Avatar updated successfully');
        setShowPicker(false);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update avatar');
      },
    }
  );

  /**
   * Handle avatar selection from MediaPicker
   */
  const handleSelectAvatarAction = async (media: MediaAsset) => {
    try {
      await updateAvatar({
        variables: {
          avatarMediaId: media.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Current avatar URL - fallback to image or default
  const currentAvatarUrl =
    user?.avatar?.urlMedium || user?.image || '/default-avatar.png';

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Picture</h1>

      {/* Current avatar preview */}
      <div className="mb-6">
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src={currentAvatarUrl}
            alt="Current avatar"
            fill
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
            <Camera className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Change avatar button */}
      <Button
        onClick={() => setShowPicker(true)}
        className="w-full"
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Change Avatar'}
      </Button>

      {/* Media picker modal */}
      {showPicker && (
        <div className="mt-4">
          <MediaPicker
            onSelectAction={handleSelectAvatarAction}
            previewSize="medium"
            buttonLabel="Choose Avatar"
            showUpload={true}
          />
        </div>
      )}
    </div>
  );
}
