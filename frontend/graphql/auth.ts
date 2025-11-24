import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
 mutation Login($input:LoginInput!) {
  login(input: $input) {
   accessToken
   user {
    id
    email
    name
    role
   }
  }
 }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
   accessToken
    user {
      id
      email
      name
      role
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
   me {
    id
    email
    name
    role
   }
  }
`;
