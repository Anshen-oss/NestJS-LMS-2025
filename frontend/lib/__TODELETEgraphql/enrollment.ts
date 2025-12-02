import { gql } from '@apollo/client';

export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: String!) {
    enrollInCourse(input: { courseId: $courseId }) {
      success
      message
      checkoutUrl
      enrollmentId
    }
  }
`;

// 🆕 NOUVELLE QUERY pour le dashboard
export const GET_MY_ENROLLMENTS = gql`
  query GetMyEnrollments {
    myEnrollments {
      id
      status
      createdAt
      course {
        id
        title
        slug
        description
        smallDescription
        imageUrl
        price
        category
        level
        duration
      }
    }
  }
`;
