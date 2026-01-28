
import { gql } from '@apollo/client';

export const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($avatarMediaId: String!) {
    updateUserAvatar(avatarMediaId: $avatarMediaId) {
      success
      message
      user {
        id
        email
        name
        role
        image
        createdAt
        updatedAt
        avatar {
          id
          urlMedium
          urlLarge
          urlOriginal
        }
      }
    }
  }
`;
