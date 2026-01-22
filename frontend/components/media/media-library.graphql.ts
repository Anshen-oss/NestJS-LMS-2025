import { gql } from '@apollo/client';

// ============================================================================
// GRAPHQL OPERATIONS FOR MEDIALIBRARY
// ============================================================================

/**
 * Query: Get user's media library
 * Returns own uploads + public images from others
 */
export const GET_MY_MEDIA_LIBRARY = gql`
  query GetMyMediaLibrary($skip: Int! = 0, $take: Int! = 20) {
    getMyMediaLibrary(skip: $skip, take: $take) {
      id
      filename
      urlThumbnail
      urlMedium
      urlLarge
      urlOriginal
      width
      height
      size
      createdAt
      usageCount
      isPublic
    }
  }
`;

/**
 * Query: Get single media by ID
 */
export const GET_MEDIA_BY_ID = gql`
  query GetMediaById($id: String!) {
    getMediaById(id: $id) {
      id
      filename
      urlOriginal
      urlLarge
      urlMedium
      urlThumbnail
      width
      height
      size
      createdAt
      usageCount
    }
  }
`;

/**
 * Mutation: Delete media asset
 */
export const DELETE_MEDIA = gql`
  mutation DeleteMedia($mediaId: String!) {
    deleteMedia(mediaId: $mediaId) {
      success
      message
    }
  }
`;

/**
 * Mutation: Track media usage
 */
export const TRACK_MEDIA_USAGE = gql`
  mutation TrackMediaUsage($mediaId: String!) {
    trackMediaUsage(mediaId: $mediaId)
  }
`;
