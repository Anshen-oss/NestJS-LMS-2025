// // 'use client';

// // import { Button } from '@/components/ui/button';
// // import { useQuery } from '@apollo/client';
// // import {
// //   AlertCircle,
// //   CheckCircle,
// //   Image as ImageIcon,
// //   Loader2,
// //   Upload,
// //   X,
// // } from 'lucide-react';
// // import { useState } from 'react';
// // import { GET_MY_MEDIA_LIBRARY } from './media-library.graphql';
// // import { UploadModal } from './UploadModal';

// // // ============================================================================
// // // TYPES
// // // ============================================================================

// // interface ImageLibraryModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   onImageSelected: (imageUrl: string) => void;
// // }

// // interface MediaItem {
// //   id: string;
// //   filename: string;
// //   urlThumbnail: string;
// //   urlMedium: string;
// //   urlLarge: string;
// //   urlOriginal: string;
// //   width: number;
// //   height: number;
// //   size: number;
// //   createdAt: string;
// //   usageCount: number;
// //   isPublic: boolean;
// // }

// // // ============================================================================
// // // MODAL
// // // ============================================================================

// // export function ImageLibraryModal({
// //   isOpen,
// //   onClose,
// //   onImageSelected,
// // }: ImageLibraryModalProps) {
// //   const [showUploadModal, setShowUploadModal] = useState(false);
// //   const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

// //   // Fetch media library
// //   const { data, loading, error, refetch } = useQuery(GET_MY_MEDIA_LIBRARY, {
// //     variables: { skip: 0, take: 50 },
// //     skip: !isOpen, // Ne fetch que quand le modal est ouvert
// //   });

// //   if (!isOpen) return null;

// //   const mediaLibrary = data?.getMyMediaLibrary || [];

// //   const handleImageSelect = (image: MediaItem) => {
// //     console.log('🖼️ Image sélectionnée:', {
// //       id: image.id,
// //       filename: image.filename,
// //       urlLarge: image.urlLarge,
// //     });
// //     onImageSelected(image.urlLarge); // Utilise la version large pour l'éditeur
// //     onClose();
// //   };

// //   const handleUploadComplete = (mediaIds: string[]) => {
// //     console.log('✅ Upload complété, mediaIds:', mediaIds);
// //     // Refetch la galerie après upload
// //     refetch();
// //     setShowUploadModal(false);

// //     // ✅ Si une seule image a été uploadée, l'insérer automatiquement
// //     if (mediaIds.length === 1 && data?.getMyMediaLibrary) {
// //       // Attendre que le refetch soit terminé
// //       setTimeout(() => {
// //         const uploadedImage = data.getMyMediaLibrary.find(
// //           (img: MediaItem) => img.id === mediaIds[0]
// //         );
// //         if (uploadedImage) {
// //           console.log('🎯 Insertion automatique:', uploadedImage.filename);
// //           handleImageSelect(uploadedImage);
// //         }
// //       }, 500);
// //     }
// //   };

// //   const handleImageError = (imageId: string) => {
// //     console.warn(`⚠️ Erreur de chargement image: ${imageId}`);
// //     setImageErrors((prev) => ({
// //       ...prev,
// //       [imageId]: true,
// //     }));
// //   };

// //   // Génère une couleur "déterministe" basée sur l'ID
// //   const getColorForImage = (id: string): string => {
// //     const colors = [
// //       '#3B82F6', // blue
// //       '#8B5CF6', // purple
// //       '#EC4899', // pink
// //       '#F59E0B', // amber
// //       '#10B981', // emerald
// //       '#06B6D4', // cyan
// //     ];
// //     const index = id.charCodeAt(0) % colors.length;
// //     return colors[index];
// //   };

// //   return (
// //     <>
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //         <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
// //           {/* Header */}
// //           <div className="flex items-center justify-between p-6 border-b">
// //             <h2 className="text-2xl font-bold text-gray-800">
// //               Sélectionner une image
// //             </h2>
// //             <button
// //               onClick={onClose}
// //               className="text-gray-500 hover:text-gray-700"
// //             >
// //               <X className="w-6 h-6" />
// //             </button>
// //           </div>

// //           {/* Content */}
// //           <div className="flex-1 overflow-y-auto p-6">
// //             {/* Upload Section */}
// //             <div className="mb-8">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <Upload className="w-5 h-5 text-blue-600" />
// //                 <h3 className="text-lg font-semibold">
// //                   Uploader une nouvelle image
// //                 </h3>
// //               </div>
// //               <Button
// //                 onClick={() => setShowUploadModal(true)}
// //                 className="bg-blue-600 hover:bg-blue-700"
// //               >
// //                 <Upload className="mr-2 h-4 w-4" />
// //                 Uploader une image
// //               </Button>
// //             </div>

// //             <div className="border-t pt-6">
// //               {/* Media Library Section */}
// //               <div className="flex items-center gap-3 mb-4">
// //                 <ImageIcon className="w-5 h-5 text-blue-600" />
// //                 <h3 className="text-lg font-semibold">
// //                   Mes images ({mediaLibrary.length})
// //                 </h3>
// //               </div>

// //               {/* Loading State */}
// //               {loading && (
// //                 <div className="flex items-center justify-center py-12">
// //                   <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
// //                 </div>
// //               )}

// //               {/* Error State */}
// //               {error && (
// //                 <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
// //                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
// //                   <div>
// //                     <p className="font-medium text-red-900">Erreur</p>
// //                     <p className="text-sm text-red-700">{error.message}</p>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Empty State */}
// //               {!loading && !error && mediaLibrary.length === 0 && (
// //                 <div className="text-center py-12">
// //                   <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
// //                   <p className="text-gray-500 font-medium">Aucune image</p>
// //                   <p className="text-sm text-gray-400 mt-1">
// //                     Commencez par uploader votre première image
// //                   </p>
// //                 </div>
// //               )}

// //               {/* Gallery Grid */}
// //               {!loading && !error && mediaLibrary.length > 0 && (
// //                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
// //                   {mediaLibrary.map((image: MediaItem, idx: number) => {
// //                     const bgColor = getColorForImage(image.id);

// //                     return (
// //                       <button
// //                         key={image.id}
// //                         onClick={() => handleImageSelect(image)}
// //                         className="relative group rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
// //                         style={{ backgroundColor: bgColor }}
// //                       >
// //                         {/* Placeholder avec icône */}
// //                         <div className="w-full aspect-square flex items-center justify-center">
// //                           <ImageIcon className="w-8 h-8 text-white opacity-50" />
// //                         </div>

// //                         {/* Overlay */}
// //                         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
// //                           <CheckCircle className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
// //                         </div>

// //                         {/* Filename Tooltip */}
// //                         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-all">
// //                           <p className="text-xs truncate">{image.filename}</p>
// //                           <p className="text-xs text-gray-300">
// //                             {(image.size / 1024 / 1024).toFixed(1)}MB
// //                           </p>
// //                         </div>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Footer */}
// //           <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
// //             <Button
// //               onClick={onClose}
// //               variant="outline"
// //               className="text-gray-600"
// //             >
// //               Fermer
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Upload Modal */}
// //       <UploadModal
// //         isOpen={showUploadModal}
// //         onClose={() => setShowUploadModal(false)}
// //         onUploadComplete={handleUploadComplete}
// //       />
// //     </>
// //   );
// // }


// 'use client';

// import { Button } from '@/components/ui/button';
// import { useQuery } from '@apollo/client';
// import {
//   AlertCircle,
//   CheckCircle,
//   Image as ImageIcon,
//   Loader2,
//   Upload,
//   X,
// } from 'lucide-react';
// import { useState } from 'react';
// import { GET_MY_MEDIA_LIBRARY } from './media-library.graphql';
// import { UploadModal } from './UploadModal';

// // ============================================================================
// // TYPES
// // ============================================================================

// interface ImageLibraryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onImageSelected: (imageUrl: string) => void;
// }

// interface MediaItem {
//   id: string;
//   filename: string;
//   urlThumbnail: string;
//   urlMedium: string;
//   urlLarge: string;
//   urlOriginal: string;
//   width: number;
//   height: number;
//   size: number;
//   createdAt: string;
//   usageCount: number;
//   isPublic: boolean;
// }

// // ============================================================================
// // MODAL
// // ============================================================================

// export function ImageLibraryModal({
//   isOpen,
//   onClose,
//   onImageSelected,
// }: ImageLibraryModalProps) {
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   // Fetch media library
//   const { data, loading, error, refetch } = useQuery(GET_MY_MEDIA_LIBRARY, {
//     variables: { skip: 0, take: 50 },
//     skip: !isOpen,
//   });

//   if (!isOpen) return null;

//   const mediaLibrary = data?.getMyMediaLibrary || [];

//   const handleImageSelect = (image: MediaItem) => {
//     console.log('🖼️ Image sélectionnée:', {
//       id: image.id,
//       filename: image.filename,
//       urlLarge: image.urlLarge,
//     });
//     onImageSelected(image.urlLarge);
//     onClose();
//   };

//   const handleUploadComplete = (mediaIds: string[]) => {
//     console.log('✅ Upload complété, mediaIds:', mediaIds);
//     refetch();
//     setShowUploadModal(false);

//     // ✅ Si une seule image a été uploadée, l'insérer automatiquement
//     if (mediaIds.length === 1 && data?.getMyMediaLibrary) {
//       setTimeout(() => {
//         const uploadedImage = data.getMyMediaLibrary.find(
//           (img: MediaItem) => img.id === mediaIds[0]
//         );
//         if (uploadedImage) {
//           console.log('🎯 Insertion automatique:', uploadedImage.filename);
//           handleImageSelect(uploadedImage);
//         }
//       }, 500);
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Sélectionner une image
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {/* Upload Section */}
//             <div className="mb-8">
//               <div className="flex items-center gap-3 mb-4">
//                 <Upload className="w-5 h-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold">
//                   Uploader une nouvelle image
//                 </h3>
//               </div>
//               <Button
//                 onClick={() => setShowUploadModal(true)}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 <Upload className="mr-2 h-4 w-4" />
//                 Uploader une image
//               </Button>
//             </div>

//             <div className="border-t pt-6">
//               {/* Media Library Section */}
//               <div className="flex items-center gap-3 mb-4">
//                 <ImageIcon className="w-5 h-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold">
//                   Mes images ({mediaLibrary.length})
//                 </h3>
//               </div>

//               {/* Loading State */}
//               {loading && (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
//                 </div>
//               )}

//               {/* Error State */}
//               {error && (
//                 <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
//                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-red-900">Erreur</p>
//                     <p className="text-sm text-red-700">{error.message}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Empty State */}
//               {!loading && !error && mediaLibrary.length === 0 && (
//                 <div className="text-center py-12">
//                   <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                   <p className="text-gray-500 font-medium">Aucune image</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Commencez par uploader votre première image
//                   </p>
//                 </div>
//               )}

//               {/* Simple List - Guaranteed to work! */}
//               {!loading && !error && mediaLibrary.length > 0 && (
//                 <div className="space-y-2">
//                   {mediaLibrary.map((image: MediaItem) => (
//                     <button
//                       key={image.id}
//                       onClick={() => handleImageSelect(image)}
//                       className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center"
//                     >
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {image.filename}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {(image.size / 1024 / 1024).toFixed(1)}MB
//                         </p>
//                       </div>
//                       <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
//             <Button
//               onClick={onClose}
//               variant="outline"
//               className="text-gray-600"
//             >
//               Fermer
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Upload Modal */}
//       <UploadModal
//         isOpen={showUploadModal}
//         onClose={() => setShowUploadModal(false)}
//         onUploadComplete={handleUploadComplete}
//       />
//     </>
//   );
// }

'use client';

import { Button } from '@/components/ui/button';
import { useQuery } from '@apollo/client';
import {
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { GET_MY_MEDIA_LIBRARY } from './media-library.graphql';
import { UploadModal } from './UploadModal';

// ============================================================================
// TYPES
// ============================================================================

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (imageUrl: string) => void;
}

interface MediaItem {
  id: string;
  filename: string;
  urlThumbnail: string;
  urlMedium: string;
  urlLarge: string;
  urlOriginal: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
  usageCount: number;
  isPublic: boolean;
}

// ============================================================================
// MODAL
// ============================================================================

export function ImageLibraryModal({
  isOpen,
  onClose,
  onImageSelected,
}: ImageLibraryModalProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Fetch media library
  const { data, loading, error, refetch } = useQuery(GET_MY_MEDIA_LIBRARY, {
    variables: { skip: 0, take: 50 },
    skip: !isOpen,
  });

  if (!isOpen) return null;

  const mediaLibrary = data?.getMyMediaLibrary || [];

  const handleImageSelect = (image: MediaItem) => {
    console.log('🖼️ Image sélectionnée:', {
      id: image.id,
      filename: image.filename,
      urlLarge: image.urlLarge,
    });
    onImageSelected(image.urlLarge);
    onClose();
  };

  const handleUploadComplete = (mediaIds: string[]) => {
    console.log('✅ Upload complété, mediaIds:', mediaIds);
    refetch();
    setShowUploadModal(false);

    // ✅ Si une seule image a été uploadée, l'insérer automatiquement
    if (mediaIds.length === 1 && data?.getMyMediaLibrary) {
      setTimeout(() => {
        const uploadedImage = data.getMyMediaLibrary.find(
          (img: MediaItem) => img.id === mediaIds[0]
        );
        if (uploadedImage) {
          console.log('🎯 Insertion automatique:', uploadedImage.filename);
          handleImageSelect(uploadedImage);
        }
      }, 500);
    }
  };

  const getColorForImage = (id: string): string => {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#10B981', // emerald
      '#06B6D4', // cyan
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              Sélectionner une image
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">
                  Uploader une nouvelle image
                </h3>
              </div>
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                Uploader une image
              </Button>
            </div>

            <div className="border-t pt-6">
              {/* Media Library Section */}
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">
                  Mes images ({mediaLibrary.length})
                </h3>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Erreur</p>
                    <p className="text-sm text-red-700">{error.message}</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && mediaLibrary.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium">Aucune image</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Commencez par uploader votre première image
                  </p>
                </div>
              )}

              {/* Gallery Grid avec background-image */}
              {!loading && !error && mediaLibrary.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaLibrary.map((image: MediaItem) => {
                    const bgColor = getColorForImage(image.id);
                    const isLoaded = loadedImages[image.id];

                    return (
                      <button
                        key={image.id}
                        onClick={() => handleImageSelect(image)}
                        className="relative group rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all aspect-square"
                        style={{
                          backgroundColor: bgColor,
                        }}
                      >
                        {/* Background image */}
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${image.urlMedium}')`,
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                          }}
                          onLoad={() => {
                            setLoadedImages((prev) => ({
                              ...prev,
                              [image.id]: true,
                            }));
                          }}
                        />

                        {/* Placeholder icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white opacity-50" />
                        </div>

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </div>

                        {/* Filename Tooltip */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-all">
                          <p className="text-xs truncate">{image.filename}</p>
                          <p className="text-xs text-gray-300">
                            {(image.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button
              onClick={onClose}
              variant="outline"
              className="text-gray-600"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}
