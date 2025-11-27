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

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      slug
      description
      smallDescription
      imageUrl
      requirements
      outcomes
      price
      category
      level
      status
      duration
      createdAt
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      id
      title
      slug
      description
      smallDescription
      imageUrl
      requirements
      outcomes
      price
      category
      level
      status
      duration
      updatedAt
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: String!) {
    deleteCourse(id: $id)
  }
`;

export const GET_MY_COURSES = gql`
  query GetMyCourses {
    myCourses {
      id
      title
      slug
      smallDescription
      imageUrl
      price
      category
      level
      status
      duration
      createdAt
      updatedAt
    }
  }
`;
