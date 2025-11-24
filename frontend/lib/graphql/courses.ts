import { gql } from '@apollo/client';

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      id
      title
      slug
      smallDescription
      price
      duration
      level
      category
      imageUrl
      status
      createdAt
    }
  }
`;

export const GET_COURSE_BY_SLUG = gql`
  query GetCourseBySlug($slug: String!) {
    courseBySlug(slug: $slug) {
      id
      title
      slug
      description
      smallDescription
      price
      duration
      level
      category
      imageUrl
      status
      chapters {
        id
        title
        position
        lessons {
          id
          title
          position
          duration
        }
      }
      createdAt
    }
  }
`;

export const CHECK_ENROLLMENT = gql`
  query CheckEnrollment($courseId: String!) {
    isEnrolled(courseId: $courseId)
  }
`;
