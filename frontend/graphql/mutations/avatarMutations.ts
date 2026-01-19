// avatarMutations.ts

import { gql } from '@apollo/client';

export const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($avatarUrl: String!, $avatarKey: String!) {
    updateUserAvatar(avatarUrl: $avatarUrl, avatarKey: $avatarKey) {
      success
      message
      user {
        id
        email
        name
        role
        avatarUrl
        createdAt
        updatedAt
      }
    }
  }
`;
