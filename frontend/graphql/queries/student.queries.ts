import { gql } from '@apollo/client';

export const GET_MY_ENROLLED_COURSES = gql`
  query GetMyEnrolledCourses {
    myEnrolledCourses {
      id
      title
      slug
      description
      imageUrl
      createdBy {
        id
        name
        email
      }
      progress {
        completedCount
        totalCount
        percentage
      }
    }
  }
`;


export const GET_COURSE_WITH_CURRICULUM = gql`
  query GetCourseWithCurriculum($id: String!) {
    course(id: $id) {
      id
      title
      slug
      description
      imageUrl
      chapters {
        id
        title
        position
        lessons {
          id
          title
          description
          order
          isFree
          duration
          videoUrl
        }
      }
    }
  }
`;
