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
