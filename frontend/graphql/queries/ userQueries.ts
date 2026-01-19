// src/graphql/queries/userQueries.ts

import { gql } from '@apollo/client';

/**
 * Query: Récupérer l'utilisateur courant
 *
 * Cette query est refetchée après les mutations d'avatar
 * pour mettre à jour le cache Apollo automatiquement
 *
 * Utilisée par:
 * - AvatarUpload (refetchQueries)
 * - Settings page (afficher l'avatar actuel)
 * - Dashboard (afficher les infos utilisateur)
 * - Partout où tu as besoin des infos de l'user courant
 */
export const GET_CURRENT_USER = gql`
  query GetCurrentUserApp {    ← Renomme la query!
    getCurrentUser {
      id
      email
      name
      role
      avatarUrl
      avatarKey
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query: Récupérer un utilisateur par ID
 *
 * Utile pour afficher le profil d'un autre utilisateur
 */
export const GET_USER_BY_ID = gql`
  query GetUserByIdApp($id: String!) {
    getUserById(id: $id) {
      id
      email
      name
      role
      createdAt
    }
  }
`;

/**
 * Query: Lister les utilisateurs
 *
 * Utile pour l'admin ou les listes d'utilisateurs
 */
export const GET_USERS = gql`
  query GetUsers($skip: Int, $take: Int) {
    getUsers(skip: $skip, take: $take) {
      id
      email
      name
      role
      avatarUrl
      createdAt
    }
  }
`;

/**
 * Query: Rechercher des utilisateurs
 *
 * Utile pour les listes avec recherche
 */
export const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $limit: Int) {
    searchUsers(query: $query, limit: $limit) {
      id
      email
      name
      role
      avatarUrl
    }
  }
`;
