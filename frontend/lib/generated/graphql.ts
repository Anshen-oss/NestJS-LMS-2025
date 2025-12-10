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
  progress?: Maybe<CourseProgressOutput>;
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

export type CourseProgressOutput = {
  __typename?: 'CourseProgressOutput';
  completedCount: Scalars['Int']['output'];
  percentage: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

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

export type CreateLessonAttachmentInput = {
  fileName: Scalars['String']['input'];
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  lessonId: Scalars['String']['input'];
};

export type CreateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
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
  completed: Scalars['Boolean']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  lessonProgress?: Maybe<Array<LessonProgress>>;
  order: Scalars['Int']['output'];
  thumbnailKey?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  videoKey?: Maybe<Scalars['String']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

export type LessonAttachment = {
  __typename?: 'LessonAttachment';
  createdAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lessonId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LessonPositionInput = {
  id: Scalars['String']['input'];
  position: Scalars['Int']['input'];
};

export type LessonProgress = {
  __typename?: 'LessonProgress';
  completed: Scalars['Boolean']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  courseId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lessonId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
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
  createLessonAttachment: LessonAttachment;
  deleteChapter: Scalars['Boolean']['output'];
  deleteCourse: Scalars['Boolean']['output'];
  deleteFile: Scalars['Boolean']['output'];
  deleteLesson: Scalars['Boolean']['output'];
  deleteLessonAttachment: Scalars['Boolean']['output'];
  enrollInCourse: EnrollmentResponse;
  getUploadUrl: UploadUrlResponse;
  login: AuthPayload;
  markLessonAsCompleted: LessonProgress;
  publishCourse: Course;
  register: AuthPayload;
  reorderChapters: Array<Chapter>;
  reorderLessons: Array<Lesson>;
  toggleLessonCompletion: LessonProgress;
  updateChapter: Chapter;
  updateCourse: Course;
  updateLesson: Lesson;
  updateLessonContent: Lesson;
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


export type MutationCreateLessonAttachmentArgs = {
  input: CreateLessonAttachmentInput;
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


export type MutationDeleteLessonAttachmentArgs = {
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


export type MutationToggleLessonCompletionArgs = {
  lessonId: Scalars['String']['input'];
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


export type MutationUpdateLessonContentArgs = {
  input: UpdateLessonContentInput;
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
  courseProgress: CourseProgressOutput;
  courses: Array<Course>;
  getCourseForEdit: Course;
  hello: Scalars['String']['output'];
  isEnrolled: Scalars['Boolean']['output'];
  lesson: Lesson;
  lessonAttachments: Array<LessonAttachment>;
  lessonProgress?: Maybe<LessonProgress>;
  lessonsByChapter: Array<Lesson>;
  me: User;
  myCourses: Array<Course>;
  myEnrolledCourses: Array<Course>;
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


export type QueryCourseProgressArgs = {
  courseId: Scalars['String']['input'];
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


export type QueryLessonAttachmentsArgs = {
  lessonId: Scalars['String']['input'];
};


export type QueryLessonProgressArgs = {
  lessonId: Scalars['String']['input'];
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

export type UpdateLessonContentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  lessonId: Scalars['String']['input'];
};

export type UpdateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
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

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'User', id: string, email: string, name?: string | null, role?: UserRole | null } } };

export type CreateChapterMutationVariables = Exact<{
  input: CreateChapterInput;
}>;


export type CreateChapterMutation = { __typename?: 'Mutation', createChapter: { __typename?: 'Chapter', id: string, title: string, position: number, createdAt: any, updatedAt: any, course: { __typename?: 'Course', id: string, title: string }, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, order: number }> | null } };

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

export type CreateCourseMutationVariables = Exact<{
  input: CreateCourseInput;
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: { __typename?: 'Course', id: string, title: string, slug: string, description: string, price: number, createdAt: any } };

export type CreateLessonAttachmentMutationVariables = Exact<{
  input: CreateLessonAttachmentInput;
}>;


export type CreateLessonAttachmentMutation = { __typename?: 'Mutation', createLessonAttachment: { __typename?: 'LessonAttachment', id: string, lessonId: string, fileName: string, fileUrl: string, fileSize: number, fileType: string, createdAt: any } };

export type DeleteLessonAttachmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLessonAttachmentMutation = { __typename?: 'Mutation', deleteLessonAttachment: boolean };

export type EnrollInCourseMutationVariables = Exact<{
  input: EnrollInCourseInput;
}>;


export type EnrollInCourseMutation = { __typename?: 'Mutation', enrollInCourse: { __typename?: 'EnrollmentResponse', success: boolean, message: string, checkoutUrl?: string | null } };

export type GetUploadUrlMutationVariables = Exact<{
  fileName: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
}>;


export type GetUploadUrlMutation = { __typename?: 'Mutation', getUploadUrl: { __typename?: 'UploadUrlResponse', uploadUrl: string, key: string, publicUrl: string } };

export type CreateLessonMutationVariables = Exact<{
  chapterId: Scalars['String']['input'];
  input: CreateLessonInput;
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, videoUrl?: string | null, duration?: number | null, order: number, isFree: boolean, createdAt: any, updatedAt: any, chapter?: { __typename?: 'Chapter', id: string, title: string } | null } };

export type UpdateLessonMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateLessonInput;
}>;


export type UpdateLessonMutation = { __typename?: 'Mutation', updateLesson: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, videoUrl?: string | null, duration?: number | null, order: number, isFree: boolean, updatedAt: any, chapter?: { __typename?: 'Chapter', id: string, title: string } | null } };

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson: boolean };

export type ReorderLessonsMutationVariables = Exact<{
  input: ReorderLessonsInput;
}>;


export type ReorderLessonsMutation = { __typename?: 'Mutation', reorderLessons: Array<{ __typename?: 'Lesson', id: string, title: string, order: number }> };

export type ToggleLessonCompletionMutationVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type ToggleLessonCompletionMutation = { __typename?: 'Mutation', toggleLessonCompletion: { __typename?: 'LessonProgress', userId: string, lessonId: string, courseId: string, completed: boolean, completedAt?: any | null } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'User', id: string, email: string, name?: string | null, role?: UserRole | null } } };

export type UpdateLessonContentMutationVariables = Exact<{
  input: UpdateLessonContentInput;
}>;


export type UpdateLessonContentMutation = { __typename?: 'Mutation', updateLessonContent: { __typename?: 'Lesson', id: string, title: string, content?: string | null, isPublished: boolean, updatedAt: any } };

export type GetChaptersByCourseQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type GetChaptersByCourseQuery = { __typename?: 'Query', chaptersByCourse: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, createdAt: any, updatedAt: any, lessonsCount?: number | null, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, videoUrl?: string | null, duration?: number | null, order: number, isFree: boolean, createdAt: any, updatedAt: any }> | null }> };

export type GetCourseProgressQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type GetCourseProgressQuery = { __typename?: 'Query', courseProgress: { __typename?: 'CourseProgressOutput', completedCount: number, totalCount: number, percentage: number } };

export type GetCourseBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCourseBySlugQuery = { __typename?: 'Query', courseBySlug: { __typename?: 'Course', id: string, title: string, slug: string, description: string, smallDescription: string, imageUrl?: string | null, price: number, category: string, level: CourseLevel, duration?: number | null, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, order: number }> | null }> | null } };

export type GetMyCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCoursesQuery = { __typename?: 'Query', myCourses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, smallDescription: string, imageUrl?: string | null, price: number, category: string, level: CourseLevel, status: CourseStatus, duration?: number | null, createdAt: any, updatedAt: any, chaptersCount?: number | null, enrollmentsCount?: number | null }> };

export type IsEnrolledQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type IsEnrolledQuery = { __typename?: 'Query', isEnrolled: boolean };

export type GetAllCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, smallDescription: string, price: number, duration?: number | null, level: CourseLevel, category: string, imageUrl?: string | null }> };

export type GetCourseForEditQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCourseForEditQuery = { __typename?: 'Query', getCourseForEdit: { __typename?: 'Course', id: string, title: string, description: string, smallDescription: string, requirements?: string | null, outcomes?: string | null, imageUrl?: string | null, price: number, category: string, stripePriceId?: string | null, status: CourseStatus, level: CourseLevel, slug: string, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email: string, role: UserRole }, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, isPublished: boolean, videoUrl?: string | null, order: number, isFree: boolean, completed: boolean }> | null }> | null } };

export type GetLessonQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetLessonQuery = { __typename?: 'Query', lesson: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, isPublished: boolean, videoUrl?: string | null, duration?: number | null, isFree: boolean, order: number } };

export type GetMyEnrollmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEnrollmentsQuery = { __typename?: 'Query', myEnrollments: Array<{ __typename?: 'Enrollment', id: string, createdAt: any, course: { __typename?: 'Course', id: string, title: string, slug: string, description: string, price: number } }> };

export type LessonAttachmentsQueryVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type LessonAttachmentsQuery = { __typename?: 'Query', lessonAttachments: Array<{ __typename?: 'LessonAttachment', id: string, lessonId: string, fileName: string, fileUrl: string, fileSize: number, fileType: string, createdAt: any }> };

export type GetLessonProgressQueryVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type GetLessonProgressQuery = { __typename?: 'Query', lessonProgress?: { __typename?: 'LessonProgress', userId: string, lessonId: string, completed: boolean, completedAt?: any | null } | null };

export type GetLessonsByChapterQueryVariables = Exact<{
  chapterId: Scalars['String']['input'];
}>;


export type GetLessonsByChapterQuery = { __typename?: 'Query', lessonsByChapter: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, videoUrl?: string | null, thumbnailKey?: string | null, videoKey?: string | null, duration?: number | null, order: number, isFree: boolean, createdAt: any, updatedAt: any }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, name?: string | null, role?: UserRole | null } };

export type GetMyEnrolledCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEnrolledCoursesQuery = { __typename?: 'Query', myEnrolledCourses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, description: string, imageUrl?: string | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email: string }, progress?: { __typename?: 'CourseProgressOutput', completedCount: number, totalCount: number, percentage: number } | null }> };

export type GetCourseWithCurriculumQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCourseWithCurriculumQuery = { __typename?: 'Query', course: { __typename?: 'Course', id: string, title: string, slug: string, description: string, imageUrl?: string | null, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, order: number, isFree: boolean, duration?: number | null, videoUrl?: string | null }> | null }> | null } };

export type GetCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, title: string }> };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
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
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
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
      order
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
export const CreateCourseDocument = gql`
    mutation CreateCourse($input: CreateCourseInput!) {
  createCourse(input: $input) {
    id
    title
    slug
    description
    price
    createdAt
  }
}
    `;
export type CreateCourseMutationFn = Apollo.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;

/**
 * __useCreateCourseMutation__
 *
 * To run a mutation, you first call `useCreateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCourseMutation, { data, loading, error }] = useCreateCourseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCourseMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, options);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = Apollo.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = Apollo.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const CreateLessonAttachmentDocument = gql`
    mutation CreateLessonAttachment($input: CreateLessonAttachmentInput!) {
  createLessonAttachment(input: $input) {
    id
    lessonId
    fileName
    fileUrl
    fileSize
    fileType
    createdAt
  }
}
    `;
export type CreateLessonAttachmentMutationFn = Apollo.MutationFunction<CreateLessonAttachmentMutation, CreateLessonAttachmentMutationVariables>;

/**
 * __useCreateLessonAttachmentMutation__
 *
 * To run a mutation, you first call `useCreateLessonAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonAttachmentMutation, { data, loading, error }] = useCreateLessonAttachmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLessonAttachmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonAttachmentMutation, CreateLessonAttachmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonAttachmentMutation, CreateLessonAttachmentMutationVariables>(CreateLessonAttachmentDocument, options);
      }
export type CreateLessonAttachmentMutationHookResult = ReturnType<typeof useCreateLessonAttachmentMutation>;
export type CreateLessonAttachmentMutationResult = Apollo.MutationResult<CreateLessonAttachmentMutation>;
export type CreateLessonAttachmentMutationOptions = Apollo.BaseMutationOptions<CreateLessonAttachmentMutation, CreateLessonAttachmentMutationVariables>;
export const DeleteLessonAttachmentDocument = gql`
    mutation DeleteLessonAttachment($id: String!) {
  deleteLessonAttachment(id: $id)
}
    `;
export type DeleteLessonAttachmentMutationFn = Apollo.MutationFunction<DeleteLessonAttachmentMutation, DeleteLessonAttachmentMutationVariables>;

/**
 * __useDeleteLessonAttachmentMutation__
 *
 * To run a mutation, you first call `useDeleteLessonAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonAttachmentMutation, { data, loading, error }] = useDeleteLessonAttachmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonAttachmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonAttachmentMutation, DeleteLessonAttachmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLessonAttachmentMutation, DeleteLessonAttachmentMutationVariables>(DeleteLessonAttachmentDocument, options);
      }
export type DeleteLessonAttachmentMutationHookResult = ReturnType<typeof useDeleteLessonAttachmentMutation>;
export type DeleteLessonAttachmentMutationResult = Apollo.MutationResult<DeleteLessonAttachmentMutation>;
export type DeleteLessonAttachmentMutationOptions = Apollo.BaseMutationOptions<DeleteLessonAttachmentMutation, DeleteLessonAttachmentMutationVariables>;
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
export const GetUploadUrlDocument = gql`
    mutation GetUploadUrl($fileName: String!, $contentType: String!) {
  getUploadUrl(fileName: $fileName, contentType: $contentType) {
    uploadUrl
    key
    publicUrl
  }
}
    `;
export type GetUploadUrlMutationFn = Apollo.MutationFunction<GetUploadUrlMutation, GetUploadUrlMutationVariables>;

/**
 * __useGetUploadUrlMutation__
 *
 * To run a mutation, you first call `useGetUploadUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetUploadUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getUploadUrlMutation, { data, loading, error }] = useGetUploadUrlMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *      contentType: // value for 'contentType'
 *   },
 * });
 */
export function useGetUploadUrlMutation(baseOptions?: Apollo.MutationHookOptions<GetUploadUrlMutation, GetUploadUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetUploadUrlMutation, GetUploadUrlMutationVariables>(GetUploadUrlDocument, options);
      }
export type GetUploadUrlMutationHookResult = ReturnType<typeof useGetUploadUrlMutation>;
export type GetUploadUrlMutationResult = Apollo.MutationResult<GetUploadUrlMutation>;
export type GetUploadUrlMutationOptions = Apollo.BaseMutationOptions<GetUploadUrlMutation, GetUploadUrlMutationVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($chapterId: String!, $input: CreateLessonInput!) {
  createLesson(chapterId: $chapterId, input: $input) {
    id
    title
    description
    content
    videoUrl
    duration
    order
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
    order
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
    order
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
export const ToggleLessonCompletionDocument = gql`
    mutation ToggleLessonCompletion($lessonId: String!) {
  toggleLessonCompletion(lessonId: $lessonId) {
    userId
    lessonId
    courseId
    completed
    completedAt
  }
}
    `;
export type ToggleLessonCompletionMutationFn = Apollo.MutationFunction<ToggleLessonCompletionMutation, ToggleLessonCompletionMutationVariables>;

/**
 * __useToggleLessonCompletionMutation__
 *
 * To run a mutation, you first call `useToggleLessonCompletionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLessonCompletionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLessonCompletionMutation, { data, loading, error }] = useToggleLessonCompletionMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useToggleLessonCompletionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleLessonCompletionMutation, ToggleLessonCompletionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleLessonCompletionMutation, ToggleLessonCompletionMutationVariables>(ToggleLessonCompletionDocument, options);
      }
export type ToggleLessonCompletionMutationHookResult = ReturnType<typeof useToggleLessonCompletionMutation>;
export type ToggleLessonCompletionMutationResult = Apollo.MutationResult<ToggleLessonCompletionMutation>;
export type ToggleLessonCompletionMutationOptions = Apollo.BaseMutationOptions<ToggleLessonCompletionMutation, ToggleLessonCompletionMutationVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($input: RegisterInput!) {
  register(input: $input) {
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
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const UpdateLessonContentDocument = gql`
    mutation UpdateLessonContent($input: UpdateLessonContentInput!) {
  updateLessonContent(input: $input) {
    id
    title
    content
    isPublished
    updatedAt
  }
}
    `;
export type UpdateLessonContentMutationFn = Apollo.MutationFunction<UpdateLessonContentMutation, UpdateLessonContentMutationVariables>;

/**
 * __useUpdateLessonContentMutation__
 *
 * To run a mutation, you first call `useUpdateLessonContentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonContentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonContentMutation, { data, loading, error }] = useUpdateLessonContentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLessonContentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonContentMutation, UpdateLessonContentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLessonContentMutation, UpdateLessonContentMutationVariables>(UpdateLessonContentDocument, options);
      }
export type UpdateLessonContentMutationHookResult = ReturnType<typeof useUpdateLessonContentMutation>;
export type UpdateLessonContentMutationResult = Apollo.MutationResult<UpdateLessonContentMutation>;
export type UpdateLessonContentMutationOptions = Apollo.BaseMutationOptions<UpdateLessonContentMutation, UpdateLessonContentMutationVariables>;
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
      order
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
export const GetCourseProgressDocument = gql`
    query GetCourseProgress($courseId: String!) {
  courseProgress(courseId: $courseId) {
    completedCount
    totalCount
    percentage
  }
}
    `;

/**
 * __useGetCourseProgressQuery__
 *
 * To run a query within a React component, call `useGetCourseProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseProgressQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetCourseProgressQuery(baseOptions: Apollo.QueryHookOptions<GetCourseProgressQuery, GetCourseProgressQueryVariables> & ({ variables: GetCourseProgressQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseProgressQuery, GetCourseProgressQueryVariables>(GetCourseProgressDocument, options);
      }
export function useGetCourseProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseProgressQuery, GetCourseProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseProgressQuery, GetCourseProgressQueryVariables>(GetCourseProgressDocument, options);
        }
export function useGetCourseProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseProgressQuery, GetCourseProgressQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseProgressQuery, GetCourseProgressQueryVariables>(GetCourseProgressDocument, options);
        }
export type GetCourseProgressQueryHookResult = ReturnType<typeof useGetCourseProgressQuery>;
export type GetCourseProgressLazyQueryHookResult = ReturnType<typeof useGetCourseProgressLazyQuery>;
export type GetCourseProgressSuspenseQueryHookResult = ReturnType<typeof useGetCourseProgressSuspenseQuery>;
export type GetCourseProgressQueryResult = Apollo.QueryResult<GetCourseProgressQuery, GetCourseProgressQueryVariables>;
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
        order
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
export const GetAllCoursesDocument = gql`
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
  }
}
    `;

/**
 * __useGetAllCoursesQuery__
 *
 * To run a query within a React component, call `useGetAllCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCoursesQuery, GetAllCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCoursesQuery, GetAllCoursesQueryVariables>(GetAllCoursesDocument, options);
      }
export function useGetAllCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCoursesQuery, GetAllCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCoursesQuery, GetAllCoursesQueryVariables>(GetAllCoursesDocument, options);
        }
export function useGetAllCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCoursesQuery, GetAllCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCoursesQuery, GetAllCoursesQueryVariables>(GetAllCoursesDocument, options);
        }
export type GetAllCoursesQueryHookResult = ReturnType<typeof useGetAllCoursesQuery>;
export type GetAllCoursesLazyQueryHookResult = ReturnType<typeof useGetAllCoursesLazyQuery>;
export type GetAllCoursesSuspenseQueryHookResult = ReturnType<typeof useGetAllCoursesSuspenseQuery>;
export type GetAllCoursesQueryResult = Apollo.QueryResult<GetAllCoursesQuery, GetAllCoursesQueryVariables>;
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
        content
        isPublished
        videoUrl
        order
        isFree
        completed
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
export const GetLessonDocument = gql`
    query GetLesson($id: String!) {
  lesson(id: $id) {
    id
    title
    description
    content
    isPublished
    videoUrl
    duration
    isFree
    order
  }
}
    `;

/**
 * __useGetLessonQuery__
 *
 * To run a query within a React component, call `useGetLessonQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLessonQuery(baseOptions: Apollo.QueryHookOptions<GetLessonQuery, GetLessonQueryVariables> & ({ variables: GetLessonQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonQuery, GetLessonQueryVariables>(GetLessonDocument, options);
      }
export function useGetLessonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonQuery, GetLessonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonQuery, GetLessonQueryVariables>(GetLessonDocument, options);
        }
export function useGetLessonSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonQuery, GetLessonQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonQuery, GetLessonQueryVariables>(GetLessonDocument, options);
        }
export type GetLessonQueryHookResult = ReturnType<typeof useGetLessonQuery>;
export type GetLessonLazyQueryHookResult = ReturnType<typeof useGetLessonLazyQuery>;
export type GetLessonSuspenseQueryHookResult = ReturnType<typeof useGetLessonSuspenseQuery>;
export type GetLessonQueryResult = Apollo.QueryResult<GetLessonQuery, GetLessonQueryVariables>;
export const GetMyEnrollmentsDocument = gql`
    query GetMyEnrollments {
  myEnrollments {
    id
    createdAt
    course {
      id
      title
      slug
      description
      price
    }
  }
}
    `;

/**
 * __useGetMyEnrollmentsQuery__
 *
 * To run a query within a React component, call `useGetMyEnrollmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyEnrollmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyEnrollmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyEnrollmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>(GetMyEnrollmentsDocument, options);
      }
export function useGetMyEnrollmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>(GetMyEnrollmentsDocument, options);
        }
export function useGetMyEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>(GetMyEnrollmentsDocument, options);
        }
export type GetMyEnrollmentsQueryHookResult = ReturnType<typeof useGetMyEnrollmentsQuery>;
export type GetMyEnrollmentsLazyQueryHookResult = ReturnType<typeof useGetMyEnrollmentsLazyQuery>;
export type GetMyEnrollmentsSuspenseQueryHookResult = ReturnType<typeof useGetMyEnrollmentsSuspenseQuery>;
export type GetMyEnrollmentsQueryResult = Apollo.QueryResult<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>;
export const LessonAttachmentsDocument = gql`
    query LessonAttachments($lessonId: String!) {
  lessonAttachments(lessonId: $lessonId) {
    id
    lessonId
    fileName
    fileUrl
    fileSize
    fileType
    createdAt
  }
}
    `;

/**
 * __useLessonAttachmentsQuery__
 *
 * To run a query within a React component, call `useLessonAttachmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonAttachmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonAttachmentsQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useLessonAttachmentsQuery(baseOptions: Apollo.QueryHookOptions<LessonAttachmentsQuery, LessonAttachmentsQueryVariables> & ({ variables: LessonAttachmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>(LessonAttachmentsDocument, options);
      }
export function useLessonAttachmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>(LessonAttachmentsDocument, options);
        }
export function useLessonAttachmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>(LessonAttachmentsDocument, options);
        }
export type LessonAttachmentsQueryHookResult = ReturnType<typeof useLessonAttachmentsQuery>;
export type LessonAttachmentsLazyQueryHookResult = ReturnType<typeof useLessonAttachmentsLazyQuery>;
export type LessonAttachmentsSuspenseQueryHookResult = ReturnType<typeof useLessonAttachmentsSuspenseQuery>;
export type LessonAttachmentsQueryResult = Apollo.QueryResult<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>;
export const GetLessonProgressDocument = gql`
    query GetLessonProgress($lessonId: String!) {
  lessonProgress(lessonId: $lessonId) {
    userId
    lessonId
    completed
    completedAt
  }
}
    `;

/**
 * __useGetLessonProgressQuery__
 *
 * To run a query within a React component, call `useGetLessonProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonProgressQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useGetLessonProgressQuery(baseOptions: Apollo.QueryHookOptions<GetLessonProgressQuery, GetLessonProgressQueryVariables> & ({ variables: GetLessonProgressQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonProgressQuery, GetLessonProgressQueryVariables>(GetLessonProgressDocument, options);
      }
export function useGetLessonProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonProgressQuery, GetLessonProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonProgressQuery, GetLessonProgressQueryVariables>(GetLessonProgressDocument, options);
        }
export function useGetLessonProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonProgressQuery, GetLessonProgressQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonProgressQuery, GetLessonProgressQueryVariables>(GetLessonProgressDocument, options);
        }
export type GetLessonProgressQueryHookResult = ReturnType<typeof useGetLessonProgressQuery>;
export type GetLessonProgressLazyQueryHookResult = ReturnType<typeof useGetLessonProgressLazyQuery>;
export type GetLessonProgressSuspenseQueryHookResult = ReturnType<typeof useGetLessonProgressSuspenseQuery>;
export type GetLessonProgressQueryResult = Apollo.QueryResult<GetLessonProgressQuery, GetLessonProgressQueryVariables>;
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
    order
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
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    name
    role
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetMyEnrolledCoursesDocument = gql`
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

/**
 * __useGetMyEnrolledCoursesQuery__
 *
 * To run a query within a React component, call `useGetMyEnrolledCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyEnrolledCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyEnrolledCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyEnrolledCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>(GetMyEnrolledCoursesDocument, options);
      }
export function useGetMyEnrolledCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>(GetMyEnrolledCoursesDocument, options);
        }
export function useGetMyEnrolledCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>(GetMyEnrolledCoursesDocument, options);
        }
export type GetMyEnrolledCoursesQueryHookResult = ReturnType<typeof useGetMyEnrolledCoursesQuery>;
export type GetMyEnrolledCoursesLazyQueryHookResult = ReturnType<typeof useGetMyEnrolledCoursesLazyQuery>;
export type GetMyEnrolledCoursesSuspenseQueryHookResult = ReturnType<typeof useGetMyEnrolledCoursesSuspenseQuery>;
export type GetMyEnrolledCoursesQueryResult = Apollo.QueryResult<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>;
export const GetCourseWithCurriculumDocument = gql`
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

/**
 * __useGetCourseWithCurriculumQuery__
 *
 * To run a query within a React component, call `useGetCourseWithCurriculumQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseWithCurriculumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseWithCurriculumQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCourseWithCurriculumQuery(baseOptions: Apollo.QueryHookOptions<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables> & ({ variables: GetCourseWithCurriculumQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>(GetCourseWithCurriculumDocument, options);
      }
export function useGetCourseWithCurriculumLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>(GetCourseWithCurriculumDocument, options);
        }
export function useGetCourseWithCurriculumSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>(GetCourseWithCurriculumDocument, options);
        }
export type GetCourseWithCurriculumQueryHookResult = ReturnType<typeof useGetCourseWithCurriculumQuery>;
export type GetCourseWithCurriculumLazyQueryHookResult = ReturnType<typeof useGetCourseWithCurriculumLazyQuery>;
export type GetCourseWithCurriculumSuspenseQueryHookResult = ReturnType<typeof useGetCourseWithCurriculumSuspenseQuery>;
export type GetCourseWithCurriculumQueryResult = Apollo.QueryResult<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>;
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