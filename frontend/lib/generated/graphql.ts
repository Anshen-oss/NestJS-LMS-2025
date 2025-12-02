import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type Chapter = {
  __typename?: 'Chapter';
  completedLessonsCount?: Maybe<Scalars['Int']['output']>;
  course: Course;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Lesson>>;
  lessonsCount?: Maybe<Scalars['Int']['output']>;
  position: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChapterPositionInput = {
  id: Scalars['String']['input'];
  position: Scalars['Int']['input'];
};

export type Course = {
  __typename?: 'Course';
  category: Scalars['String']['output'];
  chapters?: Maybe<Array<Chapter>>;
  chaptersCount?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: CourseCreator;
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  enrollmentsCount?: Maybe<Scalars['Int']['output']>;
  fileKey?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  level: CourseLevel;
  outcomes?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  requirements?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  smallDescription: Scalars['String']['output'];
  status: CourseStatus;
  stripePriceId?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CourseCreator = {
  __typename?: 'CourseCreator';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
};

/** The difficulty level of a course */
export enum CourseLevel {
  /** Advanced level course */
  Advanced = 'Advanced',
  /** Beginner level course */
  Beginner = 'Beginner',
  /** Intermediate level course */
  Intermediate = 'Intermediate'
}

/** The publication status of a course */
export enum CourseStatus {
  /** Course is archived */
  Archived = 'Archived',
  /** Course is in draft mode */
  Draft = 'Draft',
  /** Course is published and visible to users */
  Published = 'Published'
}

export type CreateChapterInput = {
  courseId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type CreateCourseInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  duration?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<CourseLevel>;
  outcomes?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  requirements?: InputMaybe<Scalars['String']['input']>;
  smallDescription?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  stripePriceId?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateLessonInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  thumbnailKey?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  videoKey?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type EnrollInCourseInput = {
  courseId: Scalars['String']['input'];
};

export type Enrollment = {
  __typename?: 'Enrollment';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  course: Course;
  courseId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type EnrollmentResponse = {
  __typename?: 'EnrollmentResponse';
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  enrollmentId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Lesson = {
  __typename?: 'Lesson';
  chapter?: Maybe<Chapter>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isFree: Scalars['Boolean']['output'];
  lessonProgress?: Maybe<Array<LessonProgress>>;
  position: Scalars['Int']['output'];
  thumbnailKey?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  videoKey?: Maybe<Scalars['String']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

export type LessonPositionInput = {
  id: Scalars['String']['input'];
  position: Scalars['Int']['input'];
};

export type LessonProgress = {
  __typename?: 'LessonProgress';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  lastWatchedAt?: Maybe<Scalars['DateTime']['output']>;
  lesson: Lesson;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  watchedDuration?: Maybe<Scalars['Int']['output']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  archiveCourse: Course;
  createChapter: Chapter;
  createCourse: Course;
  createLesson: Lesson;
  deleteChapter: Scalars['Boolean']['output'];
  deleteCourse: Scalars['Boolean']['output'];
  deleteFile: Scalars['Boolean']['output'];
  deleteLesson: Scalars['Boolean']['output'];
  enrollInCourse: EnrollmentResponse;
  getUploadUrl: UploadUrlResponse;
  login: AuthPayload;
  markLessonAsCompleted: LessonProgress;
  publishCourse: Course;
  register: AuthPayload;
  reorderChapters: Array<Chapter>;
  reorderLessons: Array<Lesson>;
  updateChapter: Chapter;
  updateCourse: Course;
  updateLesson: Lesson;
  updateLessonProgress: LessonProgress;
};


export type MutationArchiveCourseArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateChapterArgs = {
  input: CreateChapterInput;
};


export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};


export type MutationCreateLessonArgs = {
  chapterId: Scalars['String']['input'];
  input: CreateLessonInput;
};


export type MutationDeleteChapterArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCourseArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFileArgs = {
  url: Scalars['String']['input'];
};


export type MutationDeleteLessonArgs = {
  id: Scalars['String']['input'];
};


export type MutationEnrollInCourseArgs = {
  input: EnrollInCourseInput;
};


export type MutationGetUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkLessonAsCompletedArgs = {
  lessonId: Scalars['String']['input'];
};


export type MutationPublishCourseArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationReorderChaptersArgs = {
  input: ReorderChaptersInput;
};


export type MutationReorderLessonsArgs = {
  input: ReorderLessonsInput;
};


export type MutationUpdateChapterArgs = {
  input: UpdateChapterInput;
};


export type MutationUpdateCourseArgs = {
  input: UpdateCourseInput;
};


export type MutationUpdateLessonArgs = {
  id: Scalars['String']['input'];
  input: UpdateLessonInput;
};


export type MutationUpdateLessonProgressArgs = {
  input: UpdateProgressInput;
  lessonId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  chaptersByCourse: Array<Chapter>;
  course: Course;
  courseBySlug: Course;
  courses: Array<Course>;
  getCourseForEdit: Course;
  hello: Scalars['String']['output'];
  isEnrolled: Scalars['Boolean']['output'];
  lesson: Lesson;
  lessonsByChapter: Array<Lesson>;
  me: User;
  myCourses: Array<Course>;
  myEnrollments: Array<Enrollment>;
  /** API version */
  version: Scalars['String']['output'];
};


export type QueryChaptersByCourseArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryCourseArgs = {
  id: Scalars['String']['input'];
};


export type QueryCourseBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryCoursesArgs = {
  status?: InputMaybe<CourseStatus>;
};


export type QueryGetCourseForEditArgs = {
  id: Scalars['String']['input'];
};


export type QueryIsEnrolledArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryLessonArgs = {
  id: Scalars['String']['input'];
};


export type QueryLessonsByChapterArgs = {
  chapterId: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type ReorderChaptersInput = {
  chapters: Array<ChapterPositionInput>;
  courseId: Scalars['String']['input'];
};

export type ReorderLessonsInput = {
  chapterId: Scalars['String']['input'];
  lessons: Array<LessonPositionInput>;
};

export type UpdateChapterInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCourseInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<CourseLevel>;
  outcomes?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  requirements?: InputMaybe<Scalars['String']['input']>;
  smallDescription?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  stripePriceId?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLessonInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  thumbnailKey?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoKey?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProgressInput = {
  watchedDuration: Scalars['Int']['input'];
};

export type UploadUrlResponse = {
  __typename?: 'UploadUrlResponse';
  key: Scalars['String']['output'];
  publicUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRole>;
};

/** The role of a user in the system */
export enum UserRole {
  /** Administrator with full permissions */
  Admin = 'ADMIN',
  /** Instructor who can create and manage courses */
  Instructor = 'INSTRUCTOR',
  /** Regular user with basic permissions */
  User = 'USER'
}

export type CreateChapterMutationVariables = Exact<{
  input: CreateChapterInput;
}>;


export type CreateChapterMutation = { __typename?: 'Mutation', createChapter: { __typename?: 'Chapter', id: string, title: string, position: number, createdAt: any, updatedAt: any, course: { __typename?: 'Course', id: string, title: string }, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, position: number }> | null } };

export type UpdateChapterMutationVariables = Exact<{
  input: UpdateChapterInput;
}>;


export type UpdateChapterMutation = { __typename?: 'Mutation', updateChapter: { __typename?: 'Chapter', id: string, title: string, position: number, updatedAt: any, course: { __typename?: 'Course', id: string, title: string } } };

export type DeleteChapterMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteChapterMutation = { __typename?: 'Mutation', deleteChapter: boolean };

export type ReorderChaptersMutationVariables = Exact<{
  input: ReorderChaptersInput;
}>;


export type ReorderChaptersMutation = { __typename?: 'Mutation', reorderChapters: Array<{ __typename?: 'Chapter', id: string, title: string, position: number }> };

export type UpdateCourseMutationVariables = Exact<{
  input: UpdateCourseInput;
}>;


export type UpdateCourseMutation = { __typename?: 'Mutation', updateCourse: { __typename?: 'Course', id: string, title: string, slug: string, description: string, smallDescription: string, requirements?: string | null, outcomes?: string | null, imageUrl?: string | null, fileKey?: string | null, price: number, category: string, stripePriceId?: string | null, status: CourseStatus, level: CourseLevel, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email: string, role: UserRole }, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number }> | null } };

export type DeleteCourseMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCourseMutation = { __typename?: 'Mutation', deleteCourse: boolean };

export type EnrollInCourseMutationVariables = Exact<{
  input: EnrollInCourseInput;
}>;


export type EnrollInCourseMutation = { __typename?: 'Mutation', enrollInCourse: { __typename?: 'EnrollmentResponse', success: boolean, message: string, checkoutUrl?: string | null } };

export type CreateLessonMutationVariables = Exact<{
  chapterId: Scalars['String']['input'];
  input: CreateLessonInput;
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, videoUrl?: string | null, duration?: number | null, position: number, isFree: boolean, createdAt: any, updatedAt: any, chapter?: { __typename?: 'Chapter', id: string, title: string } | null } };

export type UpdateLessonMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateLessonInput;
}>;


export type UpdateLessonMutation = { __typename?: 'Mutation', updateLesson: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, videoUrl?: string | null, duration?: number | null, position: number, isFree: boolean, updatedAt: any, chapter?: { __typename?: 'Chapter', id: string, title: string } | null } };

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson: boolean };

export type ReorderLessonsMutationVariables = Exact<{
  input: ReorderLessonsInput;
}>;


export type ReorderLessonsMutation = { __typename?: 'Mutation', reorderLessons: Array<{ __typename?: 'Lesson', id: string, title: string, position: number }> };

export type GetChaptersByCourseQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type GetChaptersByCourseQuery = { __typename?: 'Query', chaptersByCourse: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, createdAt: any, updatedAt: any, lessonsCount?: number | null, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, videoUrl?: string | null, duration?: number | null, position: number, isFree: boolean, createdAt: any, updatedAt: any }> | null }> };

export type GetCourseBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCourseBySlugQuery = { __typename?: 'Query', courseBySlug: { __typename?: 'Course', id: string, title: string, slug: string, description: string, smallDescription: string, imageUrl?: string | null, price: number, category: string, level: CourseLevel, duration?: number | null, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, position: number }> | null }> | null } };

export type GetMyCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCoursesQuery = { __typename?: 'Query', myCourses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, smallDescription: string, imageUrl?: string | null, price: number, category: string, level: CourseLevel, status: CourseStatus, duration?: number | null, createdAt: any, updatedAt: any, chaptersCount?: number | null, enrollmentsCount?: number | null }> };

export type IsEnrolledQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type IsEnrolledQuery = { __typename?: 'Query', isEnrolled: boolean };

export type GetCourseForEditQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCourseForEditQuery = { __typename?: 'Query', getCourseForEdit: { __typename?: 'Course', id: string, title: string, description: string, smallDescription: string, requirements?: string | null, outcomes?: string | null, imageUrl?: string | null, price: number, category: string, stripePriceId?: string | null, status: CourseStatus, level: CourseLevel, slug: string, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email: string, role: UserRole }, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, videoUrl?: string | null, position: number, isFree: boolean }> | null }> | null } };

export type GetLessonsByChapterQueryVariables = Exact<{
  chapterId: Scalars['String']['input'];
}>;


export type GetLessonsByChapterQuery = { __typename?: 'Query', lessonsByChapter: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, videoUrl?: string | null, thumbnailKey?: string | null, videoKey?: string | null, duration?: number | null, position: number, isFree: boolean, createdAt: any, updatedAt: any }> };

export type GetCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, title: string }> };


export const CreateChapterDocument = gql`
    mutation CreateChapter($input: CreateChapterInput!) {
  createChapter(input: $input) {
    id
    title
    position
    createdAt
    updatedAt
    course {
      id
      title
    }
    lessons {
      id
      title
      position
    }
  }
}
    `;
export type CreateChapterMutationFn = Apollo.MutationFunction<CreateChapterMutation, CreateChapterMutationVariables>;

/**
 * __useCreateChapterMutation__
 *
 * To run a mutation, you first call `useCreateChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChapterMutation, { data, loading, error }] = useCreateChapterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateChapterMutation(baseOptions?: Apollo.MutationHookOptions<CreateChapterMutation, CreateChapterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChapterMutation, CreateChapterMutationVariables>(CreateChapterDocument, options);
      }
export type CreateChapterMutationHookResult = ReturnType<typeof useCreateChapterMutation>;
export type CreateChapterMutationResult = Apollo.MutationResult<CreateChapterMutation>;
export type CreateChapterMutationOptions = Apollo.BaseMutationOptions<CreateChapterMutation, CreateChapterMutationVariables>;
export const UpdateChapterDocument = gql`
    mutation UpdateChapter($input: UpdateChapterInput!) {
  updateChapter(input: $input) {
    id
    title
    position
    updatedAt
    course {
      id
      title
    }
  }
}
    `;
export type UpdateChapterMutationFn = Apollo.MutationFunction<UpdateChapterMutation, UpdateChapterMutationVariables>;

/**
 * __useUpdateChapterMutation__
 *
 * To run a mutation, you first call `useUpdateChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChapterMutation, { data, loading, error }] = useUpdateChapterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateChapterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChapterMutation, UpdateChapterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChapterMutation, UpdateChapterMutationVariables>(UpdateChapterDocument, options);
      }
export type UpdateChapterMutationHookResult = ReturnType<typeof useUpdateChapterMutation>;
export type UpdateChapterMutationResult = Apollo.MutationResult<UpdateChapterMutation>;
export type UpdateChapterMutationOptions = Apollo.BaseMutationOptions<UpdateChapterMutation, UpdateChapterMutationVariables>;
export const DeleteChapterDocument = gql`
    mutation DeleteChapter($id: String!) {
  deleteChapter(id: $id)
}
    `;
export type DeleteChapterMutationFn = Apollo.MutationFunction<DeleteChapterMutation, DeleteChapterMutationVariables>;

/**
 * __useDeleteChapterMutation__
 *
 * To run a mutation, you first call `useDeleteChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChapterMutation, { data, loading, error }] = useDeleteChapterMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteChapterMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChapterMutation, DeleteChapterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChapterMutation, DeleteChapterMutationVariables>(DeleteChapterDocument, options);
      }
export type DeleteChapterMutationHookResult = ReturnType<typeof useDeleteChapterMutation>;
export type DeleteChapterMutationResult = Apollo.MutationResult<DeleteChapterMutation>;
export type DeleteChapterMutationOptions = Apollo.BaseMutationOptions<DeleteChapterMutation, DeleteChapterMutationVariables>;
export const ReorderChaptersDocument = gql`
    mutation ReorderChapters($input: ReorderChaptersInput!) {
  reorderChapters(input: $input) {
    id
    title
    position
  }
}
    `;
export type ReorderChaptersMutationFn = Apollo.MutationFunction<ReorderChaptersMutation, ReorderChaptersMutationVariables>;

/**
 * __useReorderChaptersMutation__
 *
 * To run a mutation, you first call `useReorderChaptersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderChaptersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderChaptersMutation, { data, loading, error }] = useReorderChaptersMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReorderChaptersMutation(baseOptions?: Apollo.MutationHookOptions<ReorderChaptersMutation, ReorderChaptersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderChaptersMutation, ReorderChaptersMutationVariables>(ReorderChaptersDocument, options);
      }
export type ReorderChaptersMutationHookResult = ReturnType<typeof useReorderChaptersMutation>;
export type ReorderChaptersMutationResult = Apollo.MutationResult<ReorderChaptersMutation>;
export type ReorderChaptersMutationOptions = Apollo.BaseMutationOptions<ReorderChaptersMutation, ReorderChaptersMutationVariables>;
export const UpdateCourseDocument = gql`
    mutation UpdateCourse($input: UpdateCourseInput!) {
  updateCourse(input: $input) {
    id
    title
    slug
    description
    smallDescription
    requirements
    outcomes
    imageUrl
    fileKey
    price
    category
    stripePriceId
    status
    level
    duration
    createdAt
    updatedAt
    publishedAt
    createdBy {
      id
      name
      email
      role
    }
    chapters {
      id
      title
      position
    }
  }
}
    `;
export type UpdateCourseMutationFn = Apollo.MutationFunction<UpdateCourseMutation, UpdateCourseMutationVariables>;

/**
 * __useUpdateCourseMutation__
 *
 * To run a mutation, you first call `useUpdateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCourseMutation, { data, loading, error }] = useUpdateCourseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCourseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseMutation, UpdateCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCourseMutation, UpdateCourseMutationVariables>(UpdateCourseDocument, options);
      }
export type UpdateCourseMutationHookResult = ReturnType<typeof useUpdateCourseMutation>;
export type UpdateCourseMutationResult = Apollo.MutationResult<UpdateCourseMutation>;
export type UpdateCourseMutationOptions = Apollo.BaseMutationOptions<UpdateCourseMutation, UpdateCourseMutationVariables>;
export const DeleteCourseDocument = gql`
    mutation DeleteCourse($id: String!) {
  deleteCourse(id: $id)
}
    `;
export type DeleteCourseMutationFn = Apollo.MutationFunction<DeleteCourseMutation, DeleteCourseMutationVariables>;

/**
 * __useDeleteCourseMutation__
 *
 * To run a mutation, you first call `useDeleteCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCourseMutation, { data, loading, error }] = useDeleteCourseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCourseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCourseMutation, DeleteCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCourseMutation, DeleteCourseMutationVariables>(DeleteCourseDocument, options);
      }
export type DeleteCourseMutationHookResult = ReturnType<typeof useDeleteCourseMutation>;
export type DeleteCourseMutationResult = Apollo.MutationResult<DeleteCourseMutation>;
export type DeleteCourseMutationOptions = Apollo.BaseMutationOptions<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const EnrollInCourseDocument = gql`
    mutation EnrollInCourse($input: EnrollInCourseInput!) {
  enrollInCourse(input: $input) {
    success
    message
    checkoutUrl
  }
}
    `;
export type EnrollInCourseMutationFn = Apollo.MutationFunction<EnrollInCourseMutation, EnrollInCourseMutationVariables>;

/**
 * __useEnrollInCourseMutation__
 *
 * To run a mutation, you first call `useEnrollInCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnrollInCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enrollInCourseMutation, { data, loading, error }] = useEnrollInCourseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnrollInCourseMutation(baseOptions?: Apollo.MutationHookOptions<EnrollInCourseMutation, EnrollInCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnrollInCourseMutation, EnrollInCourseMutationVariables>(EnrollInCourseDocument, options);
      }
export type EnrollInCourseMutationHookResult = ReturnType<typeof useEnrollInCourseMutation>;
export type EnrollInCourseMutationResult = Apollo.MutationResult<EnrollInCourseMutation>;
export type EnrollInCourseMutationOptions = Apollo.BaseMutationOptions<EnrollInCourseMutation, EnrollInCourseMutationVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($chapterId: String!, $input: CreateLessonInput!) {
  createLesson(chapterId: $chapterId, input: $input) {
    id
    title
    description
    content
    videoUrl
    duration
    position
    isFree
    createdAt
    updatedAt
    chapter {
      id
      title
    }
  }
}
    `;
export type CreateLessonMutationFn = Apollo.MutationFunction<CreateLessonMutation, CreateLessonMutationVariables>;

/**
 * __useCreateLessonMutation__
 *
 * To run a mutation, you first call `useCreateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonMutation, { data, loading, error }] = useCreateLessonMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLessonMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonMutation, CreateLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, options);
      }
export type CreateLessonMutationHookResult = ReturnType<typeof useCreateLessonMutation>;
export type CreateLessonMutationResult = Apollo.MutationResult<CreateLessonMutation>;
export type CreateLessonMutationOptions = Apollo.BaseMutationOptions<CreateLessonMutation, CreateLessonMutationVariables>;
export const UpdateLessonDocument = gql`
    mutation UpdateLesson($id: String!, $input: UpdateLessonInput!) {
  updateLesson(id: $id, input: $input) {
    id
    title
    description
    content
    videoUrl
    duration
    position
    isFree
    updatedAt
    chapter {
      id
      title
    }
  }
}
    `;
export type UpdateLessonMutationFn = Apollo.MutationFunction<UpdateLessonMutation, UpdateLessonMutationVariables>;

/**
 * __useUpdateLessonMutation__
 *
 * To run a mutation, you first call `useUpdateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonMutation, { data, loading, error }] = useUpdateLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLessonMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonMutation, UpdateLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLessonMutation, UpdateLessonMutationVariables>(UpdateLessonDocument, options);
      }
export type UpdateLessonMutationHookResult = ReturnType<typeof useUpdateLessonMutation>;
export type UpdateLessonMutationResult = Apollo.MutationResult<UpdateLessonMutation>;
export type UpdateLessonMutationOptions = Apollo.BaseMutationOptions<UpdateLessonMutation, UpdateLessonMutationVariables>;
export const DeleteLessonDocument = gql`
    mutation DeleteLesson($id: String!) {
  deleteLesson(id: $id)
}
    `;
export type DeleteLessonMutationFn = Apollo.MutationFunction<DeleteLessonMutation, DeleteLessonMutationVariables>;

/**
 * __useDeleteLessonMutation__
 *
 * To run a mutation, you first call `useDeleteLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonMutation, { data, loading, error }] = useDeleteLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonMutation, DeleteLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, options);
      }
export type DeleteLessonMutationHookResult = ReturnType<typeof useDeleteLessonMutation>;
export type DeleteLessonMutationResult = Apollo.MutationResult<DeleteLessonMutation>;
export type DeleteLessonMutationOptions = Apollo.BaseMutationOptions<DeleteLessonMutation, DeleteLessonMutationVariables>;
export const ReorderLessonsDocument = gql`
    mutation ReorderLessons($input: ReorderLessonsInput!) {
  reorderLessons(input: $input) {
    id
    title
    position
  }
}
    `;
export type ReorderLessonsMutationFn = Apollo.MutationFunction<ReorderLessonsMutation, ReorderLessonsMutationVariables>;

/**
 * __useReorderLessonsMutation__
 *
 * To run a mutation, you first call `useReorderLessonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderLessonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderLessonsMutation, { data, loading, error }] = useReorderLessonsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReorderLessonsMutation(baseOptions?: Apollo.MutationHookOptions<ReorderLessonsMutation, ReorderLessonsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderLessonsMutation, ReorderLessonsMutationVariables>(ReorderLessonsDocument, options);
      }
export type ReorderLessonsMutationHookResult = ReturnType<typeof useReorderLessonsMutation>;
export type ReorderLessonsMutationResult = Apollo.MutationResult<ReorderLessonsMutation>;
export type ReorderLessonsMutationOptions = Apollo.BaseMutationOptions<ReorderLessonsMutation, ReorderLessonsMutationVariables>;
export const GetChaptersByCourseDocument = gql`
    query GetChaptersByCourse($courseId: String!) {
  chaptersByCourse(courseId: $courseId) {
    id
    title
    position
    createdAt
    updatedAt
    lessonsCount
    lessons {
      id
      title
      description
      videoUrl
      duration
      position
      isFree
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetChaptersByCourseQuery__
 *
 * To run a query within a React component, call `useGetChaptersByCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChaptersByCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChaptersByCourseQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetChaptersByCourseQuery(baseOptions: Apollo.QueryHookOptions<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables> & ({ variables: GetChaptersByCourseQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>(GetChaptersByCourseDocument, options);
      }
export function useGetChaptersByCourseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>(GetChaptersByCourseDocument, options);
        }
export function useGetChaptersByCourseSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>(GetChaptersByCourseDocument, options);
        }
export type GetChaptersByCourseQueryHookResult = ReturnType<typeof useGetChaptersByCourseQuery>;
export type GetChaptersByCourseLazyQueryHookResult = ReturnType<typeof useGetChaptersByCourseLazyQuery>;
export type GetChaptersByCourseSuspenseQueryHookResult = ReturnType<typeof useGetChaptersByCourseSuspenseQuery>;
export type GetChaptersByCourseQueryResult = Apollo.QueryResult<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>;
export const GetCourseBySlugDocument = gql`
    query GetCourseBySlug($slug: String!) {
  courseBySlug(slug: $slug) {
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
    chapters {
      id
      title
      position
      lessons {
        id
        title
        position
      }
    }
  }
}
    `;

/**
 * __useGetCourseBySlugQuery__
 *
 * To run a query within a React component, call `useGetCourseBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCourseBySlugQuery(baseOptions: Apollo.QueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables> & ({ variables: GetCourseBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>(GetCourseBySlugDocument, options);
      }
export function useGetCourseBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>(GetCourseBySlugDocument, options);
        }
export function useGetCourseBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>(GetCourseBySlugDocument, options);
        }
export type GetCourseBySlugQueryHookResult = ReturnType<typeof useGetCourseBySlugQuery>;
export type GetCourseBySlugLazyQueryHookResult = ReturnType<typeof useGetCourseBySlugLazyQuery>;
export type GetCourseBySlugSuspenseQueryHookResult = ReturnType<typeof useGetCourseBySlugSuspenseQuery>;
export type GetCourseBySlugQueryResult = Apollo.QueryResult<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>;
export const GetMyCoursesDocument = gql`
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
    chaptersCount
    enrollmentsCount
  }
}
    `;

/**
 * __useGetMyCoursesQuery__
 *
 * To run a query within a React component, call `useGetMyCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyCoursesQuery, GetMyCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyCoursesQuery, GetMyCoursesQueryVariables>(GetMyCoursesDocument, options);
      }
export function useGetMyCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCoursesQuery, GetMyCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyCoursesQuery, GetMyCoursesQueryVariables>(GetMyCoursesDocument, options);
        }
export function useGetMyCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyCoursesQuery, GetMyCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyCoursesQuery, GetMyCoursesQueryVariables>(GetMyCoursesDocument, options);
        }
export type GetMyCoursesQueryHookResult = ReturnType<typeof useGetMyCoursesQuery>;
export type GetMyCoursesLazyQueryHookResult = ReturnType<typeof useGetMyCoursesLazyQuery>;
export type GetMyCoursesSuspenseQueryHookResult = ReturnType<typeof useGetMyCoursesSuspenseQuery>;
export type GetMyCoursesQueryResult = Apollo.QueryResult<GetMyCoursesQuery, GetMyCoursesQueryVariables>;
export const IsEnrolledDocument = gql`
    query IsEnrolled($courseId: String!) {
  isEnrolled(courseId: $courseId)
}
    `;

/**
 * __useIsEnrolledQuery__
 *
 * To run a query within a React component, call `useIsEnrolledQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEnrolledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEnrolledQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useIsEnrolledQuery(baseOptions: Apollo.QueryHookOptions<IsEnrolledQuery, IsEnrolledQueryVariables> & ({ variables: IsEnrolledQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsEnrolledQuery, IsEnrolledQueryVariables>(IsEnrolledDocument, options);
      }
export function useIsEnrolledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsEnrolledQuery, IsEnrolledQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsEnrolledQuery, IsEnrolledQueryVariables>(IsEnrolledDocument, options);
        }
export function useIsEnrolledSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsEnrolledQuery, IsEnrolledQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsEnrolledQuery, IsEnrolledQueryVariables>(IsEnrolledDocument, options);
        }
export type IsEnrolledQueryHookResult = ReturnType<typeof useIsEnrolledQuery>;
export type IsEnrolledLazyQueryHookResult = ReturnType<typeof useIsEnrolledLazyQuery>;
export type IsEnrolledSuspenseQueryHookResult = ReturnType<typeof useIsEnrolledSuspenseQuery>;
export type IsEnrolledQueryResult = Apollo.QueryResult<IsEnrolledQuery, IsEnrolledQueryVariables>;
export const GetCourseForEditDocument = gql`
    query GetCourseForEdit($id: String!) {
  getCourseForEdit(id: $id) {
    id
    title
    description
    smallDescription
    requirements
    outcomes
    imageUrl
    price
    category
    stripePriceId
    status
    level
    slug
    duration
    createdAt
    updatedAt
    publishedAt
    createdBy {
      id
      name
      email
      role
    }
    chapters {
      id
      title
      position
      lessons {
        id
        title
        description
        videoUrl
        position
        isFree
      }
    }
  }
}
    `;

/**
 * __useGetCourseForEditQuery__
 *
 * To run a query within a React component, call `useGetCourseForEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseForEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseForEditQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCourseForEditQuery(baseOptions: Apollo.QueryHookOptions<GetCourseForEditQuery, GetCourseForEditQueryVariables> & ({ variables: GetCourseForEditQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseForEditQuery, GetCourseForEditQueryVariables>(GetCourseForEditDocument, options);
      }
export function useGetCourseForEditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseForEditQuery, GetCourseForEditQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseForEditQuery, GetCourseForEditQueryVariables>(GetCourseForEditDocument, options);
        }
export function useGetCourseForEditSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseForEditQuery, GetCourseForEditQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseForEditQuery, GetCourseForEditQueryVariables>(GetCourseForEditDocument, options);
        }
export type GetCourseForEditQueryHookResult = ReturnType<typeof useGetCourseForEditQuery>;
export type GetCourseForEditLazyQueryHookResult = ReturnType<typeof useGetCourseForEditLazyQuery>;
export type GetCourseForEditSuspenseQueryHookResult = ReturnType<typeof useGetCourseForEditSuspenseQuery>;
export type GetCourseForEditQueryResult = Apollo.QueryResult<GetCourseForEditQuery, GetCourseForEditQueryVariables>;
export const GetLessonsByChapterDocument = gql`
    query GetLessonsByChapter($chapterId: String!) {
  lessonsByChapter(chapterId: $chapterId) {
    id
    title
    description
    content
    videoUrl
    thumbnailKey
    videoKey
    duration
    position
    isFree
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetLessonsByChapterQuery__
 *
 * To run a query within a React component, call `useGetLessonsByChapterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonsByChapterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonsByChapterQuery({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useGetLessonsByChapterQuery(baseOptions: Apollo.QueryHookOptions<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables> & ({ variables: GetLessonsByChapterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>(GetLessonsByChapterDocument, options);
      }
export function useGetLessonsByChapterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>(GetLessonsByChapterDocument, options);
        }
export function useGetLessonsByChapterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>(GetLessonsByChapterDocument, options);
        }
export type GetLessonsByChapterQueryHookResult = ReturnType<typeof useGetLessonsByChapterQuery>;
export type GetLessonsByChapterLazyQueryHookResult = ReturnType<typeof useGetLessonsByChapterLazyQuery>;
export type GetLessonsByChapterSuspenseQueryHookResult = ReturnType<typeof useGetLessonsByChapterSuspenseQuery>;
export type GetLessonsByChapterQueryResult = Apollo.QueryResult<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>;
export const GetCoursesDocument = gql`
    query GetCourses {
  courses {
    id
    title
  }
}
    `;

/**
 * __useGetCoursesQuery__
 *
 * To run a query within a React component, call `useGetCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCoursesQuery, GetCoursesQueryVariables>(GetCoursesDocument, options);
      }
export function useGetCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCoursesQuery, GetCoursesQueryVariables>(GetCoursesDocument, options);
        }
export function useGetCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCoursesQuery, GetCoursesQueryVariables>(GetCoursesDocument, options);
        }
export type GetCoursesQueryHookResult = ReturnType<typeof useGetCoursesQuery>;
export type GetCoursesLazyQueryHookResult = ReturnType<typeof useGetCoursesLazyQuery>;
export type GetCoursesSuspenseQueryHookResult = ReturnType<typeof useGetCoursesSuspenseQuery>;
export type GetCoursesQueryResult = Apollo.QueryResult<GetCoursesQuery, GetCoursesQueryVariables>;