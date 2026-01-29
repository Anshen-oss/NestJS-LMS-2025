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
  Upload: { input: any; output: any; }
};

export type ActivityCourse = {
  __typename?: 'ActivityCourse';
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ActivityStudent = {
  __typename?: 'ActivityStudent';
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

/** Type d'activité récente */
export enum ActivityType {
  Completion = 'COMPLETION',
  Enrollment = 'ENROLLMENT',
  LessonCompleted = 'LESSON_COMPLETED',
  Question = 'QUESTION',
  Review = 'REVIEW'
}

export type AdminActionResponse = {
  __typename?: 'AdminActionResponse';
  /** Message de confirmation ou d'erreur */
  message: Scalars['String']['output'];
  /** Indique si l'action a réussi */
  success: Scalars['Boolean']['output'];
};

export type AdminStats = {
  __typename?: 'AdminStats';
  /** Nombre d'étudiants actifs */
  activeStudents: Scalars['Int']['output'];
  /** Nombre d'inscriptions récentes */
  recentEnrollments: Scalars['Int']['output'];
  /** Nombre total de cours */
  totalCourses: Scalars['Int']['output'];
  /** Revenus totaux générés */
  totalRevenue: Scalars['Float']['output'];
  /** Nombre total d'utilisateurs */
  totalUsers: Scalars['Int']['output'];
};

export type AnalyticsOverview = {
  __typename?: 'AnalyticsOverview';
  averageCompletionRate: Scalars['Float']['output'];
  averageWatchTime: Scalars['Float']['output'];
  comparisonPeriod: DateRangeType;
  completionRateChange: PercentageChange;
  currentPeriod: DateRangeType;
  enrollmentsChange: PercentageChange;
  revenueChange: PercentageChange;
  studentsChange: PercentageChange;
  totalEnrollments: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
  totalStudents: Scalars['Int']['output'];
};

export enum ChangeDirection {
  Down = 'DOWN',
  Stable = 'STABLE',
  Up = 'UP'
}

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

export type CheckoutSessionResponse = {
  __typename?: 'CheckoutSessionResponse';
  url: Scalars['String']['output'];
};

export type ConversationDetailOutput = {
  __typename?: 'ConversationDetailOutput';
  courseId?: Maybe<Scalars['String']['output']>;
  courseTitle?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  messages: Array<MessageOutput>;
  participantEmail?: Maybe<Scalars['String']['output']>;
  participantId: Scalars['String']['output'];
  participantImage?: Maybe<Scalars['String']['output']>;
  participantName: Scalars['String']['output'];
  totalMessages: Scalars['Int']['output'];
};

export type ConversationListResponseOutput = {
  __typename?: 'ConversationListResponseOutput';
  conversations: Array<ConversationPreviewOutput>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ConversationPreviewOutput = {
  __typename?: 'ConversationPreviewOutput';
  courseId?: Maybe<Scalars['String']['output']>;
  courseTitle?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastMessage?: Maybe<Scalars['String']['output']>;
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  participantEmail?: Maybe<Scalars['String']['output']>;
  participantId: Scalars['String']['output'];
  participantImage?: Maybe<Scalars['String']['output']>;
  participantName: Scalars['String']['output'];
  unreadCount: Scalars['Int']['output'];
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
  totalRevenue?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type CourseCreator = {
  __typename?: 'CourseCreator';
  email?: Maybe<Scalars['String']['output']>;
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

export type CoursePerformance = {
  __typename?: 'CoursePerformance';
  activeStudents: Scalars['Int']['output'];
  averageProgress: Scalars['Float']['output'];
  completionRate: Scalars['Float']['output'];
  courseId: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  enrollmentTrend: PercentageChange;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  totalEnrollments: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type CoursePerformanceOutput = {
  __typename?: 'CoursePerformanceOutput';
  activeStudentsCount: Scalars['Int']['output'];
  averageRating?: Maybe<Scalars['Float']['output']>;
  chaptersCount: Scalars['Int']['output'];
  completionRate: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  lessonsCount: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  revenue: Scalars['Float']['output'];
  reviewsCount?: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  status: CourseStatus;
  studentsCount: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

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
  externalVideoUrl?: InputMaybe<Scalars['String']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  thumbnailKey?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  videoKey?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type DateRangeInput = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type DateRangeType = {
  __typename?: 'DateRangeType';
  endDate: Scalars['DateTime']['output'];
  startDate: Scalars['DateTime']['output'];
};

export type DeleteMediaResponse = {
  __typename?: 'DeleteMediaResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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

export type ExportRevenueResponse = {
  __typename?: 'ExportRevenueResponse';
  downloadUrl: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type InstructorRevenueResponse = {
  __typename?: 'InstructorRevenueResponse';
  availableBalance: Scalars['Float']['output'];
  averageDailyRevenue: Scalars['Float']['output'];
  changeDirection: RevenueInstructorChangeDirection;
  changePercentage: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  dataPoints: Array<RevenueChartDataPoint>;
  nextPayoutDate: Scalars['DateTime']['output'];
  payoutHistory: Array<RevenueInstructorPayout>;
  periodEnd: Scalars['DateTime']['output'];
  periodStart: Scalars['DateTime']['output'];
  previousPeriodRevenue: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
  transactionCount: Scalars['Int']['output'];
  transactions: Array<RevenueInstructorTransaction>;
};

export type InstructorStatsOutput = {
  __typename?: 'InstructorStatsOutput';
  activeStudents: Scalars['Int']['output'];
  archivedCourses: Scalars['Int']['output'];
  averageCompletionRate: Scalars['Float']['output'];
  averageRating?: Maybe<Scalars['Float']['output']>;
  draftCourses: Scalars['Int']['output'];
  monthlyRevenue: Scalars['Float']['output'];
  publishedCourses: Scalars['Int']['output'];
  totalCourses: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
  totalStudents: Scalars['Int']['output'];
  totalViews: Scalars['Int']['output'];
  weeklyViews: Scalars['Int']['output'];
};

export type Lesson = {
  __typename?: 'Lesson';
  chapter?: Maybe<Chapter>;
  completed?: Maybe<Scalars['Boolean']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  externalVideoUrl?: Maybe<Scalars['String']['output']>;
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

export type MediaAsset = {
  __typename?: 'MediaAsset';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fileHash: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isPublic: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  mimeType: Scalars['String']['output'];
  size: Scalars['Float']['output'];
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  uploadedById: Scalars['String']['output'];
  urlLarge: Scalars['String']['output'];
  urlMedium: Scalars['String']['output'];
  urlOriginal: Scalars['String']['output'];
  urlThumbnail: Scalars['String']['output'];
  usageCount: Scalars['Float']['output'];
  width: Scalars['Float']['output'];
};

export type MediaAssetType = {
  __typename?: 'MediaAssetType';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isPublic: Scalars['Boolean']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  size: Scalars['Int']['output'];
  tags: Array<Scalars['String']['output']>;
  urlLarge: Scalars['String']['output'];
  urlMedium: Scalars['String']['output'];
  urlOriginal: Scalars['String']['output'];
  urlThumbnail: Scalars['String']['output'];
  usageCount: Scalars['Int']['output'];
  width: Scalars['Int']['output'];
};

export type MessageOutput = {
  __typename?: 'MessageOutput';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  senderId: Scalars['String']['output'];
  senderImage?: Maybe<Scalars['String']['output']>;
  senderName: Scalars['String']['output'];
  status: MessageStatus;
};

export enum MessageStatus {
  Delivered = 'DELIVERED',
  Read = 'READ',
  Sent = 'SENT'
}

export type MessagesStatsOutput = {
  __typename?: 'MessagesStatsOutput';
  lastMessageReceivedAt?: Maybe<Scalars['DateTime']['output']>;
  totalConversations: Scalars['Int']['output'];
  totalUnreadMessages: Scalars['Int']['output'];
  unreadConversations: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminUpdateUserRole: AdminActionResponse;
  archiveCourse: Course;
  /** Ban user (ADMIN only) */
  banUser: User;
  createChapter: Chapter;
  /** Créer une session Stripe Checkout pour acheter un cours */
  createCheckoutSession: CheckoutSessionResponse;
  createCourse: Course;
  createLesson: Lesson;
  createLessonAttachment: LessonAttachment;
  /** Désactiver un compte utilisateur (ADMIN uniquement) */
  deactivateUser: AdminActionResponse;
  deleteChapter: Scalars['Boolean']['output'];
  deleteCourse: Scalars['Boolean']['output'];
  deleteFile: Scalars['Boolean']['output'];
  deleteLesson: Scalars['Boolean']['output'];
  deleteLessonAttachment: Scalars['Boolean']['output'];
  /** Soft delete media (recoverable for 30 days) */
  deleteMedia: DeleteMediaResponse;
  /** Delete video progress (reset) */
  deleteVideoProgress: Scalars['Boolean']['output'];
  enrollInCourse: EnrollmentResponse;
  getUploadUrl: UploadUrlResponse;
  getUploadUrlForVideo: UploadUrlResponse;
  /** Marque tous les messages d'une conversation comme lus */
  markConversationAsRead: Scalars['Boolean']['output'];
  markLessonAsCompleted: LessonProgress;
  /** Manually mark a lesson as completed */
  markLessonCompleted: VideoProgress;
  /** Promote STUDENT to INSTRUCTOR (ADMIN only) */
  promoteToInstructor: User;
  publishCourse: Course;
  reorderChapters: Array<Chapter>;
  reorderLessons: Array<Lesson>;
  /** Save video progress (auto-save every 5 seconds) */
  saveVideoProgress: VideoProgress;
  /** Envoie un message à un étudiant */
  sendMessage: SendMessageOutput;
  setupUserRole: User;
  /** Envoie un message à l'instructor du cours */
  studentSendMessage: SendMessageOutput;
  toggleLessonCompletion: LessonProgress;
  /** Track media usage for analytics */
  trackMediaUsage: Scalars['Boolean']['output'];
  /** Unban user (ADMIN only) */
  unbanUser: User;
  updateChapter: Chapter;
  updateCourse: Course;
  updateLesson: Lesson;
  updateLessonContent: Lesson;
  updateLessonProgress: LessonProgress;
  /** Met à jour l'avatar de l'utilisateur actuellement authentifié */
  updateUserAvatar: UpdateUserAvatarResponse;
  /** Update user preferences */
  updateUserPreferences: UserPreferences;
  /** Update user profile */
  updateUserProfile: User;
  /** Update user role (ADMIN only) */
  updateUserRole: User;
  /** Upload un avatar utilisateur. Compresse automatiquement en WEBP 200x200. */
  uploadUserAvatar: UploadAvatarResponse;
};


export type MutationAdminUpdateUserRoleArgs = {
  input: UpdateUserRoleInput;
};


export type MutationArchiveCourseArgs = {
  id: Scalars['String']['input'];
};


export type MutationBanUserArgs = {
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationCreateChapterArgs = {
  input: CreateChapterInput;
};


export type MutationCreateCheckoutSessionArgs = {
  courseId: Scalars['String']['input'];
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


export type MutationDeactivateUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationDeleteChapterArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCourseArgs = {
  courseId: Scalars['String']['input'];
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


export type MutationDeleteMediaArgs = {
  mediaId: Scalars['String']['input'];
};


export type MutationDeleteVideoProgressArgs = {
  lessonId: Scalars['String']['input'];
};


export type MutationEnrollInCourseArgs = {
  input: EnrollInCourseInput;
};


export type MutationGetUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
};


export type MutationGetUploadUrlForVideoArgs = {
  fileName: Scalars['String']['input'];
  fileSize: Scalars['Float']['input'];
  fileType: Scalars['String']['input'];
};


export type MutationMarkConversationAsReadArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationMarkLessonAsCompletedArgs = {
  lessonId: Scalars['String']['input'];
};


export type MutationMarkLessonCompletedArgs = {
  lessonId: Scalars['String']['input'];
};


export type MutationPromoteToInstructorArgs = {
  input: PromoteUserInput;
};


export type MutationPublishCourseArgs = {
  id: Scalars['String']['input'];
};


export type MutationReorderChaptersArgs = {
  input: ReorderChaptersInput;
};


export type MutationReorderLessonsArgs = {
  input: ReorderLessonsInput;
};


export type MutationSaveVideoProgressArgs = {
  input: SaveVideoProgressInput;
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  courseId?: InputMaybe<Scalars['String']['input']>;
  studentId: Scalars['String']['input'];
};


export type MutationSetupUserRoleArgs = {
  clerkUserId: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationStudentSendMessageArgs = {
  content: Scalars['String']['input'];
  courseId?: InputMaybe<Scalars['String']['input']>;
  instructorId: Scalars['String']['input'];
};


export type MutationToggleLessonCompletionArgs = {
  lessonId: Scalars['String']['input'];
};


export type MutationTrackMediaUsageArgs = {
  mediaId: Scalars['String']['input'];
};


export type MutationUnbanUserArgs = {
  userId: Scalars['String']['input'];
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


export type MutationUpdateUserAvatarArgs = {
  avatarMediaId: Scalars['String']['input'];
};


export type MutationUpdateUserPreferencesArgs = {
  input: UpdateUserPreferencesInput;
};


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};


export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRoleInput;
};


export type MutationUploadUserAvatarArgs = {
  file: Scalars['Upload']['input'];
};

export type PercentageChange = {
  __typename?: 'PercentageChange';
  direction: ChangeDirection;
  isSignificant: Scalars['Boolean']['output'];
  value: Scalars['Float']['output'];
};

export type PromoteUserInput = {
  userId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Statistiques globales de la plateforme (ADMIN uniquement) */
  adminStats: AdminStats;
  allCoursesAdmin: Array<Course>;
  chaptersByCourse: Array<Chapter>;
  /** Détails complets d'une conversation avec tous les messages */
  conversationDetail: ConversationDetailOutput;
  course: Course;
  courseBySlug: Course;
  /** Performances détaillées d'un cours */
  coursePerformance: CoursePerformanceOutput;
  courseProgress: CourseProgressOutput;
  /** Liste de tous les cours, publiés ou non (ADMIN uniquement) */
  courses: Array<Course>;
  exportAnalytics: Scalars['String']['output'];
  /** Exporte les revenus en CSV */
  exportRevenue: ExportRevenueResponse;
  /** Get all users (ADMIN only) */
  getAllUsers: Array<User>;
  getCourseForEdit: Course;
  /** Get current user profile */
  getCurrentUser: User;
  /** Données complètes des revenus de l'instructeur */
  getInstructorRevenue: InstructorRevenueResponse;
  /** Get single media by ID */
  getMediaById?: Maybe<MediaAssetType>;
  /** Get total count of user media */
  getMyMediaCount: Scalars['Float']['output'];
  /** Get paginated list of user media library */
  getMyMediaLibrary: Array<MediaAssetType>;
  /** Get user by ID */
  getUserById: User;
  /** Get user statistics */
  getUserStats: UserStats;
  /** Get all video progress for current user (sorted by recent) */
  getUserVideoProgress: Array<VideoProgress>;
  /** Get video progress for a specific lesson */
  getVideoProgress?: Maybe<VideoProgress>;
  hello: Scalars['String']['output'];
  instructorAnalytics: AnalyticsOverview;
  /** Liste paginée des conversations de l'instructeur */
  instructorConversations: ConversationListResponseOutput;
  instructorCoursePerformance: Array<CoursePerformance>;
  /** Liste des cours de l'instructeur avec performances */
  instructorCourses: Array<CoursePerformanceOutput>;
  instructorRevenue: RevenueAnalytics;
  /** Statistiques globales de l'instructeur (dashboard) */
  instructorStats: InstructorStatsOutput;
  /** Liste paginée des étudiants de l'instructeur */
  instructorStudents: StudentListResponse;
  isEnrolled: Scalars['Boolean']['output'];
  lesson: Lesson;
  lessonAttachments: Array<LessonAttachment>;
  lessonForEdit: Lesson;
  lessonProgress?: Maybe<LessonProgress>;
  lessonsByChapter: Array<Lesson>;
  me: User;
  /** Statistiques des messages (conversations, unread count) */
  messagesStats: MessagesStatsOutput;
  myCourses: Array<Course>;
  myEnrolledCourses: Array<Course>;
  myEnrollments: Array<Enrollment>;
  /** Liste publique des cours publiés */
  publicCourses: Array<Course>;
  /** Activités récentes de l'instructeur (enrollments, completions) */
  recentActivity: Array<RecentActivityOutput>;
  /** Détails complets d'une conversation avec tous les messages */
  studentConversationDetail: ConversationDetailOutput;
  /** Liste des conversations de l'étudiant connecté */
  studentConversations: ConversationListResponseOutput;
  /** Détails complets d'un étudiant */
  studentDetail: StudentDetail;
  /** Étudiants inscrits à un cours spécifique */
  studentsByCourse: StudentListResponse;
  /** Liste de tous les utilisateurs (ADMIN uniquement) */
  users: Array<User>;
  /** API version */
  version: Scalars['String']['output'];
};


export type QueryAllCoursesAdminArgs = {
  status?: InputMaybe<CourseStatus>;
};


export type QueryChaptersByCourseArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryConversationDetailArgs = {
  conversationId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCourseArgs = {
  id: Scalars['String']['input'];
};


export type QueryCourseBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryCoursePerformanceArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryCourseProgressArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryExportAnalyticsArgs = {
  dateRange: DateRangeInput;
  type: Scalars['String']['input'];
};


export type QueryExportRevenueArgs = {
  period: RevenueInstructorPeriod;
};


export type QueryGetCourseForEditArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetInstructorRevenueArgs = {
  period?: RevenueInstructorPeriod;
};


export type QueryGetMediaByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMyMediaLibraryArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetVideoProgressArgs = {
  lessonId: Scalars['String']['input'];
};


export type QueryInstructorAnalyticsArgs = {
  dateRange: DateRangeInput;
};


export type QueryInstructorConversationsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstructorCoursePerformanceArgs = {
  dateRange: DateRangeInput;
};


export type QueryInstructorCoursesArgs = {
  status?: InputMaybe<CourseStatus>;
};


export type QueryInstructorRevenueArgs = {
  dateRange: DateRangeInput;
};


export type QueryInstructorStudentsArgs = {
  courseId?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
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


export type QueryLessonForEditArgs = {
  id: Scalars['String']['input'];
};


export type QueryLessonProgressArgs = {
  lessonId: Scalars['String']['input'];
};


export type QueryLessonsByChapterArgs = {
  chapterId: Scalars['String']['input'];
};


export type QueryRecentActivityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStudentConversationDetailArgs = {
  conversationId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStudentConversationsArgs = {
  courseId?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStudentDetailArgs = {
  studentId: Scalars['String']['input'];
};


export type QueryStudentsByCourseArgs = {
  courseId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};

export type RecentActivityOutput = {
  __typename?: 'RecentActivityOutput';
  course: ActivityCourse;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lessonTitle?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  reviewText?: Maybe<Scalars['String']['output']>;
  student: ActivityStudent;
  type: ActivityType;
};

export type ReorderChaptersInput = {
  chapters: Array<ChapterPositionInput>;
  courseId: Scalars['String']['input'];
};

export type ReorderLessonsInput = {
  chapterId: Scalars['String']['input'];
  lessons: Array<LessonPositionInput>;
};

export type RevenueAnalytics = {
  __typename?: 'RevenueAnalytics';
  dataPoints: Array<RevenueDataPoint>;
  totalRevenue: Scalars['Float']['output'];
};

export type RevenueChartDataPoint = {
  __typename?: 'RevenueChartDataPoint';
  date: Scalars['String']['output'];
  revenue: Scalars['Float']['output'];
  transactionCount: Scalars['Int']['output'];
};

export type RevenueDataPoint = {
  __typename?: 'RevenueDataPoint';
  date: Scalars['DateTime']['output'];
  enrollments: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
};

export enum RevenueInstructorChangeDirection {
  Down = 'DOWN',
  Stable = 'STABLE',
  Up = 'UP'
}

export type RevenueInstructorPayout = {
  __typename?: 'RevenueInstructorPayout';
  amount: Scalars['Float']['output'];
  bankAccount: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  status: RevenueInstructorPayoutStatus;
};

export enum RevenueInstructorPayoutStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum RevenueInstructorPeriod {
  Last_7Days = 'LAST_7_DAYS',
  Last_30Days = 'LAST_30_DAYS',
  Last_90Days = 'LAST_90_DAYS',
  Year = 'YEAR'
}

export type RevenueInstructorTransaction = {
  __typename?: 'RevenueInstructorTransaction';
  amount: Scalars['Float']['output'];
  courseId: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  status: RevenueInstructorTransactionStatus;
  studentName: Scalars['String']['output'];
};

export enum RevenueInstructorTransactionStatus {
  Paid = 'PAID',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export type SaveVideoProgressInput = {
  currentTime: Scalars['Float']['input'];
  duration: Scalars['Float']['input'];
  lessonId: Scalars['String']['input'];
};

export type SendMessageOutput = {
  __typename?: 'SendMessageOutput';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<MessageOutput>;
  success: Scalars['Boolean']['output'];
};

export type StudentAchievement = {
  __typename?: 'StudentAchievement';
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  unlockedAt: Scalars['DateTime']['output'];
};

export type StudentCourseProgress = {
  __typename?: 'StudentCourseProgress';
  courseId: Scalars['String']['output'];
  courseImage?: Maybe<Scalars['String']['output']>;
  courseSlug: Scalars['String']['output'];
  courseTitle: Scalars['String']['output'];
  enrollment: StudentEnrollment;
  price: Scalars['Float']['output'];
};

export type StudentDetail = {
  __typename?: 'StudentDetail';
  achievements: Array<StudentAchievement>;
  averageTimePerLesson: Scalars['Int']['output'];
  courses: Array<StudentCourseProgress>;
  email?: Maybe<Scalars['String']['output']>;
  enrolledAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  joinedAt: Scalars['DateTime']['output'];
  lastActivityAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  overallCompletionRate: Scalars['Float']['output'];
  totalCoursesCompleted: Scalars['Int']['output'];
  totalCoursesEnrolled: Scalars['Int']['output'];
  totalTimeSpent: Scalars['Int']['output'];
};

export type StudentEnrollment = {
  __typename?: 'StudentEnrollment';
  completionRate: Scalars['Int']['output'];
  enrolledAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lastActivityAt?: Maybe<Scalars['DateTime']['output']>;
  lessonsCompleted: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  totalLessons: Scalars['Int']['output'];
};

export type StudentListItem = {
  __typename?: 'StudentListItem';
  courses: Array<StudentCourseProgress>;
  email?: Maybe<Scalars['String']['output']>;
  enrolledAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastActivityAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  overallCompletionRate: Scalars['Float']['output'];
  totalCoursesCompleted: Scalars['Int']['output'];
  totalCoursesEnrolled: Scalars['Int']['output'];
};

export type StudentListResponse = {
  __typename?: 'StudentListResponse';
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  students: Array<StudentListItem>;
  total: Scalars['Int']['output'];
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
  externalVideoUrl?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateUserAvatarResponse = {
  __typename?: 'UpdateUserAvatarResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type UpdateUserPreferencesInput = {
  autoplay?: InputMaybe<Scalars['Boolean']['input']>;
  courseUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  emailNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  marketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
  subtitles?: InputMaybe<Scalars['Boolean']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  videoQuality?: InputMaybe<Scalars['String']['input']>;
  weeklyDigest?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  profession?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserRoleInput = {
  /** Nouveau rôle à attribuer */
  newRole: UserRole;
  /** ID de l'utilisateur */
  userId: Scalars['String']['input'];
};

export type UploadAvatarResponse = {
  __typename?: 'UploadAvatarResponse';
  avatarUrl: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UploadUrlResponse = {
  __typename?: 'UploadUrlResponse';
  key: Scalars['String']['output'];
  publicUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  _count?: Maybe<UserCounts>;
  avatar?: Maybe<MediaAsset>;
  avatarKey?: Maybe<Scalars['String']['output']>;
  avatarMediaId?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  banExpires?: Maybe<Scalars['DateTime']['output']>;
  banReason?: Maybe<Scalars['String']['output']>;
  banned?: Maybe<Scalars['Boolean']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  clerkId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  preferences?: Maybe<UserPreferences>;
  profession?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRole>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserCounts = {
  __typename?: 'UserCounts';
  coursesCreated: Scalars['Float']['output'];
  enrollments: Scalars['Float']['output'];
};

export type UserPreferences = {
  __typename?: 'UserPreferences';
  autoplay: Scalars['Boolean']['output'];
  courseUpdates: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  marketingEmails: Scalars['Boolean']['output'];
  subtitles: Scalars['Boolean']['output'];
  theme: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
  videoQuality: Scalars['String']['output'];
  weeklyDigest: Scalars['Boolean']['output'];
};

/** The role of a user in the system */
export enum UserRole {
  /** Administrator with full permissions */
  Admin = 'ADMIN',
  /** Instructor who can create and manage courses */
  Instructor = 'INSTRUCTOR',
  /** Regular user with basic permissions */
  Student = 'STUDENT'
}

export type UserStats = {
  __typename?: 'UserStats';
  admins: Scalars['Int']['output'];
  instructors: Scalars['Int']['output'];
  students: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type VideoProgress = {
  __typename?: 'VideoProgress';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentTime: Scalars['Float']['output'];
  duration: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  lastWatchedAt: Scalars['DateTime']['output'];
  lesson?: Maybe<Lesson>;
  lessonId: Scalars['String']['output'];
  progressPercent: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type UpdateUserAvatarMutationVariables = Exact<{
  avatarMediaId: Scalars['String']['input'];
}>;


export type UpdateUserAvatarMutation = { __typename?: 'Mutation', updateUserAvatar: { __typename?: 'UpdateUserAvatarResponse', success: boolean, message?: string | null, user?: { __typename?: 'User', id: string, email?: string | null, name?: string | null, role?: UserRole | null, image?: string | null, createdAt: any, updatedAt?: any | null, avatar?: { __typename?: 'MediaAsset', id: string, urlMedium: string, urlLarge: string, urlOriginal: string } | null } | null } };

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


export type UpdateCourseMutation = { __typename?: 'Mutation', updateCourse: { __typename?: 'Course', id: string, title: string, slug: string, description: string, smallDescription: string, requirements?: string | null, outcomes?: string | null, imageUrl?: string | null, fileKey?: string | null, price: number, category: string, stripePriceId?: string | null, status: CourseStatus, level: CourseLevel, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email?: string | null, role: UserRole }, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number }> | null } };

export type DeleteCourseMutationVariables = Exact<{
  courseId: Scalars['String']['input'];
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

export type GetUploadUrlForVideoMutationVariables = Exact<{
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  fileSize: Scalars['Float']['input'];
}>;


export type GetUploadUrlForVideoMutation = { __typename?: 'Mutation', getUploadUrlForVideo: { __typename?: 'UploadUrlResponse', uploadUrl: string, key: string, publicUrl: string } };

export type SetupUserRoleMutationVariables = Exact<{
  clerkUserId: Scalars['String']['input'];
  role: Scalars['String']['input'];
}>;


export type SetupUserRoleMutation = { __typename?: 'Mutation', setupUserRole: { __typename?: 'User', id: string, clerkId?: string | null, role?: UserRole | null, name?: string | null, email?: string | null } };

export type StudentSendMessageMutationVariables = Exact<{
  instructorId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  courseId?: InputMaybe<Scalars['String']['input']>;
}>;


export type StudentSendMessageMutation = { __typename?: 'Mutation', studentSendMessage: { __typename?: 'SendMessageOutput', success: boolean, error?: string | null, message?: { __typename?: 'MessageOutput', id: string, content: string, senderId: string, senderName: string, senderImage?: string | null, status: MessageStatus, readAt?: any | null, createdAt: any } | null } };

export type UpdateLessonContentMutationVariables = Exact<{
  input: UpdateLessonContentInput;
}>;


export type UpdateLessonContentMutation = { __typename?: 'Mutation', updateLessonContent: { __typename?: 'Lesson', id: string, title: string, content?: string | null, isPublished: boolean, updatedAt: any } };

export type UpdateUserPreferencesMutationVariables = Exact<{
  input: UpdateUserPreferencesInput;
}>;


export type UpdateUserPreferencesMutation = { __typename?: 'Mutation', updateUserPreferences: { __typename?: 'UserPreferences', id: string, userId: string, emailNotifications: boolean, courseUpdates: boolean, weeklyDigest: boolean, marketingEmails: boolean, videoQuality: string, autoplay: boolean, subtitles: boolean, language: string, timezone: string, theme: string, createdAt: any, updatedAt: any } };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'User', id: string, name?: string | null, email?: string | null, bio?: string | null, profession?: string | null, dateOfBirth?: any | null, image?: string | null, preferences?: { __typename?: 'UserPreferences', id: string, emailNotifications: boolean, courseUpdates: boolean, weeklyDigest: boolean, marketingEmails: boolean, videoQuality: string, autoplay: boolean, subtitles: boolean, language: string, timezone: string, theme: string } | null } };

export type InstructorAnalyticsQueryVariables = Exact<{
  dateRange: DateRangeInput;
}>;


export type InstructorAnalyticsQuery = { __typename?: 'Query', instructorAnalytics: { __typename?: 'AnalyticsOverview', totalRevenue: number, totalEnrollments: number, averageCompletionRate: number, totalStudents: number, averageWatchTime: number, revenueChange: { __typename?: 'PercentageChange', value: number, direction: ChangeDirection, isSignificant: boolean }, enrollmentsChange: { __typename?: 'PercentageChange', value: number, direction: ChangeDirection, isSignificant: boolean }, completionRateChange: { __typename?: 'PercentageChange', value: number, direction: ChangeDirection, isSignificant: boolean }, studentsChange: { __typename?: 'PercentageChange', value: number, direction: ChangeDirection, isSignificant: boolean }, currentPeriod: { __typename?: 'DateRangeType', startDate: any, endDate: any }, comparisonPeriod: { __typename?: 'DateRangeType', startDate: any, endDate: any } } };

export type InstructorRevenueQueryVariables = Exact<{
  dateRange: DateRangeInput;
}>;


export type InstructorRevenueQuery = { __typename?: 'Query', instructorRevenue: { __typename?: 'RevenueAnalytics', totalRevenue: number, dataPoints: Array<{ __typename?: 'RevenueDataPoint', date: any, revenue: number, enrollments: number }> } };

export type InstructorCoursePerformanceQueryVariables = Exact<{
  dateRange: DateRangeInput;
}>;


export type InstructorCoursePerformanceQuery = { __typename?: 'Query', instructorCoursePerformance: Array<{ __typename?: 'CoursePerformance', courseId: string, courseName: string, thumbnailUrl?: string | null, totalEnrollments: number, activeStudents: number, completionRate: number, totalRevenue: number, averageProgress: number, enrollmentTrend: { __typename?: 'PercentageChange', value: number, direction: ChangeDirection, isSignificant: boolean } }> };

export type ExportAnalyticsQueryVariables = Exact<{
  dateRange: DateRangeInput;
  type: Scalars['String']['input'];
}>;


export type ExportAnalyticsQuery = { __typename?: 'Query', exportAnalytics: string };

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

export type GetAllCoursesAdminQueryVariables = Exact<{
  status?: InputMaybe<CourseStatus>;
}>;


export type GetAllCoursesAdminQuery = { __typename?: 'Query', allCoursesAdmin: Array<{ __typename?: 'Course', id: string, title: string, slug: string, imageUrl?: string | null, price: number, status: CourseStatus, level: CourseLevel, category: string, createdAt: any, enrollmentsCount?: number | null, totalRevenue?: number | null, chaptersCount?: number | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email?: string | null } }> };

export type GetAllCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, smallDescription: string, price: number, duration?: number | null, level: CourseLevel, category: string, imageUrl?: string | null }> };

export type GetCourseForEditQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCourseForEditQuery = { __typename?: 'Query', getCourseForEdit: { __typename?: 'Course', id: string, title: string, description: string, smallDescription: string, requirements?: string | null, outcomes?: string | null, imageUrl?: string | null, price: number, category: string, stripePriceId?: string | null, status: CourseStatus, level: CourseLevel, slug: string, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email?: string | null, role: UserRole }, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, isPublished: boolean, videoUrl?: string | null, order: number, isFree: boolean }> | null }> | null } };

export type GetLessonQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetLessonQuery = { __typename?: 'Query', lesson: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, isPublished: boolean, videoUrl?: string | null, duration?: number | null, isFree: boolean, order: number } };

export type GetMyEnrollmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEnrollmentsQuery = { __typename?: 'Query', myEnrollments: Array<{ __typename?: 'Enrollment', id: string, createdAt: any, course: { __typename?: 'Course', id: string, title: string, slug: string, description: string, imageUrl?: string | null, price: number, duration?: number | null, level: CourseLevel, category: string, smallDescription: string, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, completed?: boolean | null }> | null }> | null } }> };

export type GetCourseWithLessonsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCourseWithLessonsQuery = { __typename?: 'Query', course: { __typename?: 'Course', id: string, title: string, slug: string, description: string, imageUrl?: string | null, userId: string, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, order: number, duration?: number | null, videoUrl?: string | null, externalVideoUrl?: string | null, content?: string | null, description?: string | null, completed?: boolean | null }> | null }> | null } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, clerkId?: string | null, name?: string | null, email?: string | null, image?: string | null, role?: UserRole | null, bio?: string | null, profession?: string | null, dateOfBirth?: any | null, emailVerified?: boolean | null, banned?: boolean | null, createdAt: any, updatedAt?: any | null, avatar?: { __typename?: 'MediaAsset', id: string, urlMedium: string, urlLarge: string, urlOriginal: string } | null, preferences?: { __typename?: 'UserPreferences', id: string, emailNotifications: boolean, courseUpdates: boolean, weeklyDigest: boolean, marketingEmails: boolean, videoQuality: string, autoplay: boolean, subtitles: boolean, language: string, timezone: string, theme: string, createdAt: any, updatedAt: any } | null } };

export type GetInstructorStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInstructorStatsQuery = { __typename?: 'Query', instructorStats: { __typename?: 'InstructorStatsOutput', totalCourses: number, publishedCourses: number, draftCourses: number, archivedCourses: number, totalStudents: number, activeStudents: number, totalRevenue: number, monthlyRevenue: number, totalViews: number, weeklyViews: number, averageCompletionRate: number, averageRating?: number | null } };

export type GetInstructorCoursesQueryVariables = Exact<{
  status?: InputMaybe<CourseStatus>;
}>;


export type GetInstructorCoursesQuery = { __typename?: 'Query', instructorCourses: Array<{ __typename?: 'CoursePerformanceOutput', id: string, title: string, slug: string, imageUrl?: string | null, status: CourseStatus, price: number, studentsCount: number, activeStudentsCount: number, revenue: number, completionRate: number, chaptersCount: number, lessonsCount: number, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, averageRating?: number | null, reviewsCount?: number | null }> };

export type GetCoursePerformanceQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type GetCoursePerformanceQuery = { __typename?: 'Query', coursePerformance: { __typename?: 'CoursePerformanceOutput', id: string, title: string, slug: string, imageUrl?: string | null, status: CourseStatus, price: number, studentsCount: number, activeStudentsCount: number, revenue: number, completionRate: number, chaptersCount: number, lessonsCount: number, duration?: number | null, createdAt: any, updatedAt: any, publishedAt?: any | null, averageRating?: number | null, reviewsCount?: number | null } };

export type GetRecentActivityQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentActivityQuery = { __typename?: 'Query', recentActivity: Array<{ __typename?: 'RecentActivityOutput', id: string, type: ActivityType, createdAt: any, lessonTitle?: string | null, reviewText?: string | null, rating?: number | null, student: { __typename?: 'ActivityStudent', id: string, name: string, image?: string | null }, course: { __typename?: 'ActivityCourse', id: string, title: string, slug: string } }> };

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

export type GetLessonForEditQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetLessonForEditQuery = { __typename?: 'Query', lessonForEdit: { __typename?: 'Lesson', id: string, title: string, description?: string | null, content?: string | null, isPublished: boolean, videoUrl?: string | null, videoKey?: string | null, externalVideoUrl?: string | null, duration?: number | null, isFree: boolean, order: number } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email?: string | null, name?: string | null, role?: UserRole | null } };

export type GetPublicCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPublicCoursesQuery = { __typename?: 'Query', publicCourses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, smallDescription: string, price: number, duration?: number | null, level: CourseLevel, category: string, imageUrl?: string | null }> };

export type GetInstructorRevenueQueryVariables = Exact<{
  period: RevenueInstructorPeriod;
}>;


export type GetInstructorRevenueQuery = { __typename?: 'Query', getInstructorRevenue: { __typename?: 'InstructorRevenueResponse', totalRevenue: number, previousPeriodRevenue: number, changePercentage: number, changeDirection: RevenueInstructorChangeDirection, averageDailyRevenue: number, transactionCount: number, availableBalance: number, nextPayoutDate: any, periodStart: any, periodEnd: any, currency: string, dataPoints: Array<{ __typename?: 'RevenueChartDataPoint', date: string, revenue: number, transactionCount: number }>, transactions: Array<{ __typename?: 'RevenueInstructorTransaction', id: string, date: any, studentName: string, courseName: string, amount: number, status: RevenueInstructorTransactionStatus, courseId: string }>, payoutHistory: Array<{ __typename?: 'RevenueInstructorPayout', id: string, date: any, amount: number, status: RevenueInstructorPayoutStatus, bankAccount: string }> } };

export type ExportRevenueQueryVariables = Exact<{
  period: RevenueInstructorPeriod;
}>;


export type ExportRevenueQuery = { __typename?: 'Query', exportRevenue: { __typename?: 'ExportRevenueResponse', success: boolean, downloadUrl: string, filename: string } };

export type StudentConversationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  courseId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type StudentConversationsQuery = { __typename?: 'Query', studentConversations: { __typename?: 'ConversationListResponseOutput', total: number, page: number, pageSize: number, conversations: Array<{ __typename?: 'ConversationPreviewOutput', id: string, participantId: string, participantName: string, participantImage?: string | null, participantEmail?: string | null, lastMessage?: string | null, lastMessageAt?: any | null, unreadCount: number, courseId?: string | null, courseTitle?: string | null }> } };

export type StudentConversationDetailQueryVariables = Exact<{
  conversationId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type StudentConversationDetailQuery = { __typename?: 'Query', studentConversationDetail: { __typename?: 'ConversationDetailOutput', id: string, participantId: string, participantName: string, participantImage?: string | null, participantEmail?: string | null, courseId?: string | null, courseTitle?: string | null, totalMessages: number, createdAt: any, messages: Array<{ __typename?: 'MessageOutput', id: string, content: string, senderId: string, senderName: string, senderImage?: string | null, status: MessageStatus, readAt?: any | null, createdAt: any }> } };

export type GetMyEnrolledCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEnrolledCoursesQuery = { __typename?: 'Query', myEnrolledCourses: Array<{ __typename?: 'Course', id: string, title: string, slug: string, description: string, imageUrl?: string | null, createdBy: { __typename?: 'CourseCreator', id: string, name: string, email?: string | null }, progress?: { __typename?: 'CourseProgressOutput', completedCount: number, totalCount: number, percentage: number } | null }> };

export type GetCourseWithCurriculumQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCourseWithCurriculumQuery = { __typename?: 'Query', course: { __typename?: 'Course', id: string, title: string, slug: string, description: string, imageUrl?: string | null, chapters?: Array<{ __typename?: 'Chapter', id: string, title: string, position: number, lessons?: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, order: number, isFree: boolean, duration?: number | null, videoUrl?: string | null }> | null }> | null } };

export type GetCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, title: string }> };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, clerkId?: string | null, name?: string | null, email?: string | null, role?: UserRole | null, image?: string | null, emailVerified?: boolean | null, banned?: boolean | null, banReason?: string | null, createdAt: any, updatedAt?: any | null, _count?: { __typename?: 'UserCounts', coursesCreated: number, enrollments: number } | null }> };

export type GetUserByIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'User', id: string, clerkId?: string | null, name?: string | null, email?: string | null, role?: UserRole | null, image?: string | null, emailVerified?: boolean | null, banned?: boolean | null, banReason?: string | null, banExpires?: any | null, createdAt: any, updatedAt?: any | null } };

export type GetUserStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatsQuery = { __typename?: 'Query', getUserStats: { __typename?: 'UserStats', totalUsers: number, students: number, instructors: number, admins: number } };

export type PromoteToInstructorMutationVariables = Exact<{
  input: PromoteUserInput;
}>;


export type PromoteToInstructorMutation = { __typename?: 'Mutation', promoteToInstructor: { __typename?: 'User', id: string, email?: string | null, name?: string | null, role?: UserRole | null } };

export type UpdateUserRoleMutationVariables = Exact<{
  input: UpdateUserRoleInput;
}>;


export type UpdateUserRoleMutation = { __typename?: 'Mutation', updateUserRole: { __typename?: 'User', id: string, email?: string | null, name?: string | null, role?: UserRole | null } };

export type BanUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type BanUserMutation = { __typename?: 'Mutation', banUser: { __typename?: 'User', id: string, email?: string | null, banned?: boolean | null, banReason?: string | null } };

export type UnbanUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UnbanUserMutation = { __typename?: 'Mutation', unbanUser: { __typename?: 'User', id: string, email?: string | null, banned?: boolean | null } };

export type GetVideoProgressQueryVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type GetVideoProgressQuery = { __typename?: 'Query', getVideoProgress?: { __typename?: 'VideoProgress', id: string, lessonId: string, currentTime: number, duration: number, progressPercent: number, isCompleted: boolean, completedAt?: any | null, lastWatchedAt: any, createdAt: any, updatedAt: any } | null };

export type GetUserVideoProgressQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserVideoProgressQuery = { __typename?: 'Query', getUserVideoProgress: Array<{ __typename?: 'VideoProgress', id: string, lessonId: string, currentTime: number, duration: number, progressPercent: number, isCompleted: boolean, completedAt?: any | null, lastWatchedAt: any, lesson?: { __typename?: 'Lesson', id: string, title: string, description?: string | null, videoUrl?: string | null, externalVideoUrl?: string | null, duration?: number | null, chapter?: { __typename?: 'Chapter', id: string, title: string, course: { __typename?: 'Course', id: string, title: string, slug: string, imageUrl?: string | null } } | null } | null }> };

export type SaveVideoProgressMutationVariables = Exact<{
  input: SaveVideoProgressInput;
}>;


export type SaveVideoProgressMutation = { __typename?: 'Mutation', saveVideoProgress: { __typename?: 'VideoProgress', id: string, lessonId: string, currentTime: number, duration: number, progressPercent: number, isCompleted: boolean, completedAt?: any | null, lastWatchedAt: any } };

export type MarkLessonCompletedMutationVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type MarkLessonCompletedMutation = { __typename?: 'Mutation', markLessonCompleted: { __typename?: 'VideoProgress', id: string, lessonId: string, isCompleted: boolean, completedAt?: any | null, progressPercent: number } };

export type DeleteVideoProgressMutationVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type DeleteVideoProgressMutation = { __typename?: 'Mutation', deleteVideoProgress: boolean };


export const UpdateUserAvatarDocument = gql`
    mutation UpdateUserAvatar($avatarMediaId: String!) {
  updateUserAvatar(avatarMediaId: $avatarMediaId) {
    success
    message
    user {
      id
      email
      name
      role
      image
      createdAt
      updatedAt
      avatar {
        id
        urlMedium
        urlLarge
        urlOriginal
      }
    }
  }
}
    `;
export type UpdateUserAvatarMutationFn = Apollo.MutationFunction<UpdateUserAvatarMutation, UpdateUserAvatarMutationVariables>;

/**
 * __useUpdateUserAvatarMutation__
 *
 * To run a mutation, you first call `useUpdateUserAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserAvatarMutation, { data, loading, error }] = useUpdateUserAvatarMutation({
 *   variables: {
 *      avatarMediaId: // value for 'avatarMediaId'
 *   },
 * });
 */
export function useUpdateUserAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserAvatarMutation, UpdateUserAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserAvatarMutation, UpdateUserAvatarMutationVariables>(UpdateUserAvatarDocument, options);
      }
export type UpdateUserAvatarMutationHookResult = ReturnType<typeof useUpdateUserAvatarMutation>;
export type UpdateUserAvatarMutationResult = Apollo.MutationResult<UpdateUserAvatarMutation>;
export type UpdateUserAvatarMutationOptions = Apollo.BaseMutationOptions<UpdateUserAvatarMutation, UpdateUserAvatarMutationVariables>;
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
    mutation DeleteCourse($courseId: String!) {
  deleteCourse(courseId: $courseId)
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
 *      courseId: // value for 'courseId'
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
export const GetUploadUrlForVideoDocument = gql`
    mutation GetUploadUrlForVideo($fileName: String!, $fileType: String!, $fileSize: Float!) {
  getUploadUrlForVideo(
    fileName: $fileName
    fileType: $fileType
    fileSize: $fileSize
  ) {
    uploadUrl
    key
    publicUrl
  }
}
    `;
export type GetUploadUrlForVideoMutationFn = Apollo.MutationFunction<GetUploadUrlForVideoMutation, GetUploadUrlForVideoMutationVariables>;

/**
 * __useGetUploadUrlForVideoMutation__
 *
 * To run a mutation, you first call `useGetUploadUrlForVideoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetUploadUrlForVideoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getUploadUrlForVideoMutation, { data, loading, error }] = useGetUploadUrlForVideoMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *      fileType: // value for 'fileType'
 *      fileSize: // value for 'fileSize'
 *   },
 * });
 */
export function useGetUploadUrlForVideoMutation(baseOptions?: Apollo.MutationHookOptions<GetUploadUrlForVideoMutation, GetUploadUrlForVideoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetUploadUrlForVideoMutation, GetUploadUrlForVideoMutationVariables>(GetUploadUrlForVideoDocument, options);
      }
export type GetUploadUrlForVideoMutationHookResult = ReturnType<typeof useGetUploadUrlForVideoMutation>;
export type GetUploadUrlForVideoMutationResult = Apollo.MutationResult<GetUploadUrlForVideoMutation>;
export type GetUploadUrlForVideoMutationOptions = Apollo.BaseMutationOptions<GetUploadUrlForVideoMutation, GetUploadUrlForVideoMutationVariables>;
export const SetupUserRoleDocument = gql`
    mutation SetupUserRole($clerkUserId: String!, $role: String!) {
  setupUserRole(clerkUserId: $clerkUserId, role: $role) {
    id
    clerkId
    role
    name
    email
  }
}
    `;
export type SetupUserRoleMutationFn = Apollo.MutationFunction<SetupUserRoleMutation, SetupUserRoleMutationVariables>;

/**
 * __useSetupUserRoleMutation__
 *
 * To run a mutation, you first call `useSetupUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetupUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setupUserRoleMutation, { data, loading, error }] = useSetupUserRoleMutation({
 *   variables: {
 *      clerkUserId: // value for 'clerkUserId'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useSetupUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<SetupUserRoleMutation, SetupUserRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetupUserRoleMutation, SetupUserRoleMutationVariables>(SetupUserRoleDocument, options);
      }
export type SetupUserRoleMutationHookResult = ReturnType<typeof useSetupUserRoleMutation>;
export type SetupUserRoleMutationResult = Apollo.MutationResult<SetupUserRoleMutation>;
export type SetupUserRoleMutationOptions = Apollo.BaseMutationOptions<SetupUserRoleMutation, SetupUserRoleMutationVariables>;
export const StudentSendMessageDocument = gql`
    mutation StudentSendMessage($instructorId: String!, $content: String!, $courseId: String) {
  studentSendMessage(
    instructorId: $instructorId
    content: $content
    courseId: $courseId
  ) {
    success
    message {
      id
      content
      senderId
      senderName
      senderImage
      status
      readAt
      createdAt
    }
    error
  }
}
    `;
export type StudentSendMessageMutationFn = Apollo.MutationFunction<StudentSendMessageMutation, StudentSendMessageMutationVariables>;

/**
 * __useStudentSendMessageMutation__
 *
 * To run a mutation, you first call `useStudentSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStudentSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [studentSendMessageMutation, { data, loading, error }] = useStudentSendMessageMutation({
 *   variables: {
 *      instructorId: // value for 'instructorId'
 *      content: // value for 'content'
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useStudentSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<StudentSendMessageMutation, StudentSendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StudentSendMessageMutation, StudentSendMessageMutationVariables>(StudentSendMessageDocument, options);
      }
export type StudentSendMessageMutationHookResult = ReturnType<typeof useStudentSendMessageMutation>;
export type StudentSendMessageMutationResult = Apollo.MutationResult<StudentSendMessageMutation>;
export type StudentSendMessageMutationOptions = Apollo.BaseMutationOptions<StudentSendMessageMutation, StudentSendMessageMutationVariables>;
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
export const UpdateUserPreferencesDocument = gql`
    mutation UpdateUserPreferences($input: UpdateUserPreferencesInput!) {
  updateUserPreferences(input: $input) {
    id
    userId
    emailNotifications
    courseUpdates
    weeklyDigest
    marketingEmails
    videoQuality
    autoplay
    subtitles
    language
    timezone
    theme
    createdAt
    updatedAt
  }
}
    `;
export type UpdateUserPreferencesMutationFn = Apollo.MutationFunction<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>;

/**
 * __useUpdateUserPreferencesMutation__
 *
 * To run a mutation, you first call `useUpdateUserPreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPreferencesMutation, { data, loading, error }] = useUpdateUserPreferencesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserPreferencesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>(UpdateUserPreferencesDocument, options);
      }
export type UpdateUserPreferencesMutationHookResult = ReturnType<typeof useUpdateUserPreferencesMutation>;
export type UpdateUserPreferencesMutationResult = Apollo.MutationResult<UpdateUserPreferencesMutation>;
export type UpdateUserPreferencesMutationOptions = Apollo.BaseMutationOptions<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input) {
    id
    name
    email
    bio
    profession
    dateOfBirth
    image
    preferences {
      id
      emailNotifications
      courseUpdates
      weeklyDigest
      marketingEmails
      videoQuality
      autoplay
      subtitles
      language
      timezone
      theme
    }
  }
}
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const InstructorAnalyticsDocument = gql`
    query InstructorAnalytics($dateRange: DateRangeInput!) {
  instructorAnalytics(dateRange: $dateRange) {
    totalRevenue
    totalEnrollments
    averageCompletionRate
    totalStudents
    averageWatchTime
    revenueChange {
      value
      direction
      isSignificant
    }
    enrollmentsChange {
      value
      direction
      isSignificant
    }
    completionRateChange {
      value
      direction
      isSignificant
    }
    studentsChange {
      value
      direction
      isSignificant
    }
    currentPeriod {
      startDate
      endDate
    }
    comparisonPeriod {
      startDate
      endDate
    }
  }
}
    `;

/**
 * __useInstructorAnalyticsQuery__
 *
 * To run a query within a React component, call `useInstructorAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstructorAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstructorAnalyticsQuery({
 *   variables: {
 *      dateRange: // value for 'dateRange'
 *   },
 * });
 */
export function useInstructorAnalyticsQuery(baseOptions: Apollo.QueryHookOptions<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables> & ({ variables: InstructorAnalyticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>(InstructorAnalyticsDocument, options);
      }
export function useInstructorAnalyticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>(InstructorAnalyticsDocument, options);
        }
// @ts-ignore
export function useInstructorAnalyticsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>): Apollo.UseSuspenseQueryResult<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>;
export function useInstructorAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>): Apollo.UseSuspenseQueryResult<InstructorAnalyticsQuery | undefined, InstructorAnalyticsQueryVariables>;
export function useInstructorAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>(InstructorAnalyticsDocument, options);
        }
export type InstructorAnalyticsQueryHookResult = ReturnType<typeof useInstructorAnalyticsQuery>;
export type InstructorAnalyticsLazyQueryHookResult = ReturnType<typeof useInstructorAnalyticsLazyQuery>;
export type InstructorAnalyticsSuspenseQueryHookResult = ReturnType<typeof useInstructorAnalyticsSuspenseQuery>;
export type InstructorAnalyticsQueryResult = Apollo.QueryResult<InstructorAnalyticsQuery, InstructorAnalyticsQueryVariables>;
export const InstructorRevenueDocument = gql`
    query InstructorRevenue($dateRange: DateRangeInput!) {
  instructorRevenue(dateRange: $dateRange) {
    totalRevenue
    dataPoints {
      date
      revenue
      enrollments
    }
  }
}
    `;

/**
 * __useInstructorRevenueQuery__
 *
 * To run a query within a React component, call `useInstructorRevenueQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstructorRevenueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstructorRevenueQuery({
 *   variables: {
 *      dateRange: // value for 'dateRange'
 *   },
 * });
 */
export function useInstructorRevenueQuery(baseOptions: Apollo.QueryHookOptions<InstructorRevenueQuery, InstructorRevenueQueryVariables> & ({ variables: InstructorRevenueQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InstructorRevenueQuery, InstructorRevenueQueryVariables>(InstructorRevenueDocument, options);
      }
export function useInstructorRevenueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InstructorRevenueQuery, InstructorRevenueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InstructorRevenueQuery, InstructorRevenueQueryVariables>(InstructorRevenueDocument, options);
        }
// @ts-ignore
export function useInstructorRevenueSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<InstructorRevenueQuery, InstructorRevenueQueryVariables>): Apollo.UseSuspenseQueryResult<InstructorRevenueQuery, InstructorRevenueQueryVariables>;
export function useInstructorRevenueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InstructorRevenueQuery, InstructorRevenueQueryVariables>): Apollo.UseSuspenseQueryResult<InstructorRevenueQuery | undefined, InstructorRevenueQueryVariables>;
export function useInstructorRevenueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InstructorRevenueQuery, InstructorRevenueQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InstructorRevenueQuery, InstructorRevenueQueryVariables>(InstructorRevenueDocument, options);
        }
export type InstructorRevenueQueryHookResult = ReturnType<typeof useInstructorRevenueQuery>;
export type InstructorRevenueLazyQueryHookResult = ReturnType<typeof useInstructorRevenueLazyQuery>;
export type InstructorRevenueSuspenseQueryHookResult = ReturnType<typeof useInstructorRevenueSuspenseQuery>;
export type InstructorRevenueQueryResult = Apollo.QueryResult<InstructorRevenueQuery, InstructorRevenueQueryVariables>;
export const InstructorCoursePerformanceDocument = gql`
    query InstructorCoursePerformance($dateRange: DateRangeInput!) {
  instructorCoursePerformance(dateRange: $dateRange) {
    courseId
    courseName
    thumbnailUrl
    totalEnrollments
    activeStudents
    completionRate
    totalRevenue
    averageProgress
    enrollmentTrend {
      value
      direction
      isSignificant
    }
  }
}
    `;

/**
 * __useInstructorCoursePerformanceQuery__
 *
 * To run a query within a React component, call `useInstructorCoursePerformanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstructorCoursePerformanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstructorCoursePerformanceQuery({
 *   variables: {
 *      dateRange: // value for 'dateRange'
 *   },
 * });
 */
export function useInstructorCoursePerformanceQuery(baseOptions: Apollo.QueryHookOptions<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables> & ({ variables: InstructorCoursePerformanceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>(InstructorCoursePerformanceDocument, options);
      }
export function useInstructorCoursePerformanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>(InstructorCoursePerformanceDocument, options);
        }
// @ts-ignore
export function useInstructorCoursePerformanceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>): Apollo.UseSuspenseQueryResult<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>;
export function useInstructorCoursePerformanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>): Apollo.UseSuspenseQueryResult<InstructorCoursePerformanceQuery | undefined, InstructorCoursePerformanceQueryVariables>;
export function useInstructorCoursePerformanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>(InstructorCoursePerformanceDocument, options);
        }
export type InstructorCoursePerformanceQueryHookResult = ReturnType<typeof useInstructorCoursePerformanceQuery>;
export type InstructorCoursePerformanceLazyQueryHookResult = ReturnType<typeof useInstructorCoursePerformanceLazyQuery>;
export type InstructorCoursePerformanceSuspenseQueryHookResult = ReturnType<typeof useInstructorCoursePerformanceSuspenseQuery>;
export type InstructorCoursePerformanceQueryResult = Apollo.QueryResult<InstructorCoursePerformanceQuery, InstructorCoursePerformanceQueryVariables>;
export const ExportAnalyticsDocument = gql`
    query ExportAnalytics($dateRange: DateRangeInput!, $type: String!) {
  exportAnalytics(dateRange: $dateRange, type: $type)
}
    `;

/**
 * __useExportAnalyticsQuery__
 *
 * To run a query within a React component, call `useExportAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportAnalyticsQuery({
 *   variables: {
 *      dateRange: // value for 'dateRange'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useExportAnalyticsQuery(baseOptions: Apollo.QueryHookOptions<ExportAnalyticsQuery, ExportAnalyticsQueryVariables> & ({ variables: ExportAnalyticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>(ExportAnalyticsDocument, options);
      }
export function useExportAnalyticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>(ExportAnalyticsDocument, options);
        }
// @ts-ignore
export function useExportAnalyticsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>): Apollo.UseSuspenseQueryResult<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>;
export function useExportAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>): Apollo.UseSuspenseQueryResult<ExportAnalyticsQuery | undefined, ExportAnalyticsQueryVariables>;
export function useExportAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>(ExportAnalyticsDocument, options);
        }
export type ExportAnalyticsQueryHookResult = ReturnType<typeof useExportAnalyticsQuery>;
export type ExportAnalyticsLazyQueryHookResult = ReturnType<typeof useExportAnalyticsLazyQuery>;
export type ExportAnalyticsSuspenseQueryHookResult = ReturnType<typeof useExportAnalyticsSuspenseQuery>;
export type ExportAnalyticsQueryResult = Apollo.QueryResult<ExportAnalyticsQuery, ExportAnalyticsQueryVariables>;
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
// @ts-ignore
export function useGetChaptersByCourseSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>): Apollo.UseSuspenseQueryResult<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>;
export function useGetChaptersByCourseSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChaptersByCourseQuery, GetChaptersByCourseQueryVariables>): Apollo.UseSuspenseQueryResult<GetChaptersByCourseQuery | undefined, GetChaptersByCourseQueryVariables>;
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
// @ts-ignore
export function useGetCourseProgressSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCourseProgressQuery, GetCourseProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseProgressQuery, GetCourseProgressQueryVariables>;
export function useGetCourseProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseProgressQuery, GetCourseProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseProgressQuery | undefined, GetCourseProgressQueryVariables>;
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
// @ts-ignore
export function useGetCourseBySlugSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>;
export function useGetCourseBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseBySlugQuery | undefined, GetCourseBySlugQueryVariables>;
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
// @ts-ignore
export function useGetMyCoursesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyCoursesQuery, GetMyCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyCoursesQuery, GetMyCoursesQueryVariables>;
export function useGetMyCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyCoursesQuery, GetMyCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyCoursesQuery | undefined, GetMyCoursesQueryVariables>;
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
// @ts-ignore
export function useIsEnrolledSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<IsEnrolledQuery, IsEnrolledQueryVariables>): Apollo.UseSuspenseQueryResult<IsEnrolledQuery, IsEnrolledQueryVariables>;
export function useIsEnrolledSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsEnrolledQuery, IsEnrolledQueryVariables>): Apollo.UseSuspenseQueryResult<IsEnrolledQuery | undefined, IsEnrolledQueryVariables>;
export function useIsEnrolledSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsEnrolledQuery, IsEnrolledQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsEnrolledQuery, IsEnrolledQueryVariables>(IsEnrolledDocument, options);
        }
export type IsEnrolledQueryHookResult = ReturnType<typeof useIsEnrolledQuery>;
export type IsEnrolledLazyQueryHookResult = ReturnType<typeof useIsEnrolledLazyQuery>;
export type IsEnrolledSuspenseQueryHookResult = ReturnType<typeof useIsEnrolledSuspenseQuery>;
export type IsEnrolledQueryResult = Apollo.QueryResult<IsEnrolledQuery, IsEnrolledQueryVariables>;
export const GetAllCoursesAdminDocument = gql`
    query GetAllCoursesAdmin($status: CourseStatus) {
  allCoursesAdmin(status: $status) {
    id
    title
    slug
    imageUrl
    price
    status
    level
    category
    createdAt
    createdBy {
      id
      name
      email
    }
    enrollmentsCount
    totalRevenue
    chaptersCount
  }
}
    `;

/**
 * __useGetAllCoursesAdminQuery__
 *
 * To run a query within a React component, call `useGetAllCoursesAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCoursesAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCoursesAdminQuery({
 *   variables: {
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetAllCoursesAdminQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>(GetAllCoursesAdminDocument, options);
      }
export function useGetAllCoursesAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>(GetAllCoursesAdminDocument, options);
        }
// @ts-ignore
export function useGetAllCoursesAdminSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>;
export function useGetAllCoursesAdminSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCoursesAdminQuery | undefined, GetAllCoursesAdminQueryVariables>;
export function useGetAllCoursesAdminSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>(GetAllCoursesAdminDocument, options);
        }
export type GetAllCoursesAdminQueryHookResult = ReturnType<typeof useGetAllCoursesAdminQuery>;
export type GetAllCoursesAdminLazyQueryHookResult = ReturnType<typeof useGetAllCoursesAdminLazyQuery>;
export type GetAllCoursesAdminSuspenseQueryHookResult = ReturnType<typeof useGetAllCoursesAdminSuspenseQuery>;
export type GetAllCoursesAdminQueryResult = Apollo.QueryResult<GetAllCoursesAdminQuery, GetAllCoursesAdminQueryVariables>;
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
// @ts-ignore
export function useGetAllCoursesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllCoursesQuery, GetAllCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCoursesQuery, GetAllCoursesQueryVariables>;
export function useGetAllCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCoursesQuery, GetAllCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCoursesQuery | undefined, GetAllCoursesQueryVariables>;
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
// @ts-ignore
export function useGetCourseForEditSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCourseForEditQuery, GetCourseForEditQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseForEditQuery, GetCourseForEditQueryVariables>;
export function useGetCourseForEditSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseForEditQuery, GetCourseForEditQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseForEditQuery | undefined, GetCourseForEditQueryVariables>;
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
// @ts-ignore
export function useGetLessonSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLessonQuery, GetLessonQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonQuery, GetLessonQueryVariables>;
export function useGetLessonSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonQuery, GetLessonQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonQuery | undefined, GetLessonQueryVariables>;
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
      imageUrl
      price
      duration
      level
      category
      smallDescription
      chapters {
        id
        title
        lessons {
          id
          title
          completed
        }
      }
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
// @ts-ignore
export function useGetMyEnrollmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>;
export function useGetMyEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyEnrollmentsQuery | undefined, GetMyEnrollmentsQueryVariables>;
export function useGetMyEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>(GetMyEnrollmentsDocument, options);
        }
export type GetMyEnrollmentsQueryHookResult = ReturnType<typeof useGetMyEnrollmentsQuery>;
export type GetMyEnrollmentsLazyQueryHookResult = ReturnType<typeof useGetMyEnrollmentsLazyQuery>;
export type GetMyEnrollmentsSuspenseQueryHookResult = ReturnType<typeof useGetMyEnrollmentsSuspenseQuery>;
export type GetMyEnrollmentsQueryResult = Apollo.QueryResult<GetMyEnrollmentsQuery, GetMyEnrollmentsQueryVariables>;
export const GetCourseWithLessonsDocument = gql`
    query GetCourseWithLessons($id: String!) {
  course(id: $id) {
    id
    title
    slug
    description
    imageUrl
    userId
    chapters {
      id
      title
      position
      lessons {
        id
        title
        order
        duration
        videoUrl
        externalVideoUrl
        content
        description
        completed
      }
    }
  }
}
    `;

/**
 * __useGetCourseWithLessonsQuery__
 *
 * To run a query within a React component, call `useGetCourseWithLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseWithLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseWithLessonsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCourseWithLessonsQuery(baseOptions: Apollo.QueryHookOptions<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables> & ({ variables: GetCourseWithLessonsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>(GetCourseWithLessonsDocument, options);
      }
export function useGetCourseWithLessonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>(GetCourseWithLessonsDocument, options);
        }
// @ts-ignore
export function useGetCourseWithLessonsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>;
export function useGetCourseWithLessonsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseWithLessonsQuery | undefined, GetCourseWithLessonsQueryVariables>;
export function useGetCourseWithLessonsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>(GetCourseWithLessonsDocument, options);
        }
export type GetCourseWithLessonsQueryHookResult = ReturnType<typeof useGetCourseWithLessonsQuery>;
export type GetCourseWithLessonsLazyQueryHookResult = ReturnType<typeof useGetCourseWithLessonsLazyQuery>;
export type GetCourseWithLessonsSuspenseQueryHookResult = ReturnType<typeof useGetCourseWithLessonsSuspenseQuery>;
export type GetCourseWithLessonsQueryResult = Apollo.QueryResult<GetCourseWithLessonsQuery, GetCourseWithLessonsQueryVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
    clerkId
    name
    email
    image
    role
    bio
    profession
    dateOfBirth
    emailVerified
    banned
    createdAt
    updatedAt
    avatar {
      id
      urlMedium
      urlLarge
      urlOriginal
    }
    preferences {
      id
      emailNotifications
      courseUpdates
      weeklyDigest
      marketingEmails
      videoQuality
      autoplay
      subtitles
      language
      timezone
      theme
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
// @ts-ignore
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>): Apollo.UseSuspenseQueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>): Apollo.UseSuspenseQueryResult<GetCurrentUserQuery | undefined, GetCurrentUserQueryVariables>;
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetInstructorStatsDocument = gql`
    query GetInstructorStats {
  instructorStats {
    totalCourses
    publishedCourses
    draftCourses
    archivedCourses
    totalStudents
    activeStudents
    totalRevenue
    monthlyRevenue
    totalViews
    weeklyViews
    averageCompletionRate
    averageRating
  }
}
    `;

/**
 * __useGetInstructorStatsQuery__
 *
 * To run a query within a React component, call `useGetInstructorStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstructorStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstructorStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInstructorStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>(GetInstructorStatsDocument, options);
      }
export function useGetInstructorStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>(GetInstructorStatsDocument, options);
        }
// @ts-ignore
export function useGetInstructorStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>;
export function useGetInstructorStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetInstructorStatsQuery | undefined, GetInstructorStatsQueryVariables>;
export function useGetInstructorStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>(GetInstructorStatsDocument, options);
        }
export type GetInstructorStatsQueryHookResult = ReturnType<typeof useGetInstructorStatsQuery>;
export type GetInstructorStatsLazyQueryHookResult = ReturnType<typeof useGetInstructorStatsLazyQuery>;
export type GetInstructorStatsSuspenseQueryHookResult = ReturnType<typeof useGetInstructorStatsSuspenseQuery>;
export type GetInstructorStatsQueryResult = Apollo.QueryResult<GetInstructorStatsQuery, GetInstructorStatsQueryVariables>;
export const GetInstructorCoursesDocument = gql`
    query GetInstructorCourses($status: CourseStatus) {
  instructorCourses(status: $status) {
    id
    title
    slug
    imageUrl
    status
    price
    studentsCount
    activeStudentsCount
    revenue
    completionRate
    chaptersCount
    lessonsCount
    duration
    createdAt
    updatedAt
    publishedAt
    averageRating
    reviewsCount
  }
}
    `;

/**
 * __useGetInstructorCoursesQuery__
 *
 * To run a query within a React component, call `useGetInstructorCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstructorCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstructorCoursesQuery({
 *   variables: {
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetInstructorCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>(GetInstructorCoursesDocument, options);
      }
export function useGetInstructorCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>(GetInstructorCoursesDocument, options);
        }
// @ts-ignore
export function useGetInstructorCoursesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>;
export function useGetInstructorCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetInstructorCoursesQuery | undefined, GetInstructorCoursesQueryVariables>;
export function useGetInstructorCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>(GetInstructorCoursesDocument, options);
        }
export type GetInstructorCoursesQueryHookResult = ReturnType<typeof useGetInstructorCoursesQuery>;
export type GetInstructorCoursesLazyQueryHookResult = ReturnType<typeof useGetInstructorCoursesLazyQuery>;
export type GetInstructorCoursesSuspenseQueryHookResult = ReturnType<typeof useGetInstructorCoursesSuspenseQuery>;
export type GetInstructorCoursesQueryResult = Apollo.QueryResult<GetInstructorCoursesQuery, GetInstructorCoursesQueryVariables>;
export const GetCoursePerformanceDocument = gql`
    query GetCoursePerformance($courseId: String!) {
  coursePerformance(courseId: $courseId) {
    id
    title
    slug
    imageUrl
    status
    price
    studentsCount
    activeStudentsCount
    revenue
    completionRate
    chaptersCount
    lessonsCount
    duration
    createdAt
    updatedAt
    publishedAt
    averageRating
    reviewsCount
  }
}
    `;

/**
 * __useGetCoursePerformanceQuery__
 *
 * To run a query within a React component, call `useGetCoursePerformanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoursePerformanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoursePerformanceQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetCoursePerformanceQuery(baseOptions: Apollo.QueryHookOptions<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables> & ({ variables: GetCoursePerformanceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>(GetCoursePerformanceDocument, options);
      }
export function useGetCoursePerformanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>(GetCoursePerformanceDocument, options);
        }
// @ts-ignore
export function useGetCoursePerformanceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>): Apollo.UseSuspenseQueryResult<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>;
export function useGetCoursePerformanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>): Apollo.UseSuspenseQueryResult<GetCoursePerformanceQuery | undefined, GetCoursePerformanceQueryVariables>;
export function useGetCoursePerformanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>(GetCoursePerformanceDocument, options);
        }
export type GetCoursePerformanceQueryHookResult = ReturnType<typeof useGetCoursePerformanceQuery>;
export type GetCoursePerformanceLazyQueryHookResult = ReturnType<typeof useGetCoursePerformanceLazyQuery>;
export type GetCoursePerformanceSuspenseQueryHookResult = ReturnType<typeof useGetCoursePerformanceSuspenseQuery>;
export type GetCoursePerformanceQueryResult = Apollo.QueryResult<GetCoursePerformanceQuery, GetCoursePerformanceQueryVariables>;
export const GetRecentActivityDocument = gql`
    query GetRecentActivity($limit: Int) {
  recentActivity(limit: $limit) {
    id
    type
    student {
      id
      name
      image
    }
    course {
      id
      title
      slug
    }
    createdAt
    lessonTitle
    reviewText
    rating
  }
}
    `;

/**
 * __useGetRecentActivityQuery__
 *
 * To run a query within a React component, call `useGetRecentActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentActivityQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetRecentActivityQuery(baseOptions?: Apollo.QueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(GetRecentActivityDocument, options);
      }
export function useGetRecentActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(GetRecentActivityDocument, options);
        }
// @ts-ignore
export function useGetRecentActivitySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>): Apollo.UseSuspenseQueryResult<GetRecentActivityQuery, GetRecentActivityQueryVariables>;
export function useGetRecentActivitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>): Apollo.UseSuspenseQueryResult<GetRecentActivityQuery | undefined, GetRecentActivityQueryVariables>;
export function useGetRecentActivitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(GetRecentActivityDocument, options);
        }
export type GetRecentActivityQueryHookResult = ReturnType<typeof useGetRecentActivityQuery>;
export type GetRecentActivityLazyQueryHookResult = ReturnType<typeof useGetRecentActivityLazyQuery>;
export type GetRecentActivitySuspenseQueryHookResult = ReturnType<typeof useGetRecentActivitySuspenseQuery>;
export type GetRecentActivityQueryResult = Apollo.QueryResult<GetRecentActivityQuery, GetRecentActivityQueryVariables>;
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
// @ts-ignore
export function useLessonAttachmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>): Apollo.UseSuspenseQueryResult<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>;
export function useLessonAttachmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LessonAttachmentsQuery, LessonAttachmentsQueryVariables>): Apollo.UseSuspenseQueryResult<LessonAttachmentsQuery | undefined, LessonAttachmentsQueryVariables>;
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
// @ts-ignore
export function useGetLessonProgressSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLessonProgressQuery, GetLessonProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonProgressQuery, GetLessonProgressQueryVariables>;
export function useGetLessonProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonProgressQuery, GetLessonProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonProgressQuery | undefined, GetLessonProgressQueryVariables>;
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
// @ts-ignore
export function useGetLessonsByChapterSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>;
export function useGetLessonsByChapterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonsByChapterQuery | undefined, GetLessonsByChapterQueryVariables>;
export function useGetLessonsByChapterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>(GetLessonsByChapterDocument, options);
        }
export type GetLessonsByChapterQueryHookResult = ReturnType<typeof useGetLessonsByChapterQuery>;
export type GetLessonsByChapterLazyQueryHookResult = ReturnType<typeof useGetLessonsByChapterLazyQuery>;
export type GetLessonsByChapterSuspenseQueryHookResult = ReturnType<typeof useGetLessonsByChapterSuspenseQuery>;
export type GetLessonsByChapterQueryResult = Apollo.QueryResult<GetLessonsByChapterQuery, GetLessonsByChapterQueryVariables>;
export const GetLessonForEditDocument = gql`
    query GetLessonForEdit($id: String!) {
  lessonForEdit(id: $id) {
    id
    title
    description
    content
    isPublished
    videoUrl
    videoKey
    externalVideoUrl
    duration
    isFree
    order
  }
}
    `;

/**
 * __useGetLessonForEditQuery__
 *
 * To run a query within a React component, call `useGetLessonForEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonForEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonForEditQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLessonForEditQuery(baseOptions: Apollo.QueryHookOptions<GetLessonForEditQuery, GetLessonForEditQueryVariables> & ({ variables: GetLessonForEditQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonForEditQuery, GetLessonForEditQueryVariables>(GetLessonForEditDocument, options);
      }
export function useGetLessonForEditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonForEditQuery, GetLessonForEditQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonForEditQuery, GetLessonForEditQueryVariables>(GetLessonForEditDocument, options);
        }
// @ts-ignore
export function useGetLessonForEditSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLessonForEditQuery, GetLessonForEditQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonForEditQuery, GetLessonForEditQueryVariables>;
export function useGetLessonForEditSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonForEditQuery, GetLessonForEditQueryVariables>): Apollo.UseSuspenseQueryResult<GetLessonForEditQuery | undefined, GetLessonForEditQueryVariables>;
export function useGetLessonForEditSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonForEditQuery, GetLessonForEditQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonForEditQuery, GetLessonForEditQueryVariables>(GetLessonForEditDocument, options);
        }
export type GetLessonForEditQueryHookResult = ReturnType<typeof useGetLessonForEditQuery>;
export type GetLessonForEditLazyQueryHookResult = ReturnType<typeof useGetLessonForEditLazyQuery>;
export type GetLessonForEditSuspenseQueryHookResult = ReturnType<typeof useGetLessonForEditSuspenseQuery>;
export type GetLessonForEditQueryResult = Apollo.QueryResult<GetLessonForEditQuery, GetLessonForEditQueryVariables>;
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
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetPublicCoursesDocument = gql`
    query GetPublicCourses {
  publicCourses {
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
 * __useGetPublicCoursesQuery__
 *
 * To run a query within a React component, call `useGetPublicCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPublicCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>(GetPublicCoursesDocument, options);
      }
export function useGetPublicCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>(GetPublicCoursesDocument, options);
        }
// @ts-ignore
export function useGetPublicCoursesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>;
export function useGetPublicCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetPublicCoursesQuery | undefined, GetPublicCoursesQueryVariables>;
export function useGetPublicCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>(GetPublicCoursesDocument, options);
        }
export type GetPublicCoursesQueryHookResult = ReturnType<typeof useGetPublicCoursesQuery>;
export type GetPublicCoursesLazyQueryHookResult = ReturnType<typeof useGetPublicCoursesLazyQuery>;
export type GetPublicCoursesSuspenseQueryHookResult = ReturnType<typeof useGetPublicCoursesSuspenseQuery>;
export type GetPublicCoursesQueryResult = Apollo.QueryResult<GetPublicCoursesQuery, GetPublicCoursesQueryVariables>;
export const GetInstructorRevenueDocument = gql`
    query GetInstructorRevenue($period: RevenueInstructorPeriod!) {
  getInstructorRevenue(period: $period) {
    totalRevenue
    previousPeriodRevenue
    changePercentage
    changeDirection
    averageDailyRevenue
    dataPoints {
      date
      revenue
      transactionCount
    }
    transactions {
      id
      date
      studentName
      courseName
      amount
      status
      courseId
    }
    transactionCount
    availableBalance
    nextPayoutDate
    payoutHistory {
      id
      date
      amount
      status
      bankAccount
    }
    periodStart
    periodEnd
    currency
  }
}
    `;

/**
 * __useGetInstructorRevenueQuery__
 *
 * To run a query within a React component, call `useGetInstructorRevenueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstructorRevenueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstructorRevenueQuery({
 *   variables: {
 *      period: // value for 'period'
 *   },
 * });
 */
export function useGetInstructorRevenueQuery(baseOptions: Apollo.QueryHookOptions<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables> & ({ variables: GetInstructorRevenueQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>(GetInstructorRevenueDocument, options);
      }
export function useGetInstructorRevenueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>(GetInstructorRevenueDocument, options);
        }
// @ts-ignore
export function useGetInstructorRevenueSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>): Apollo.UseSuspenseQueryResult<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>;
export function useGetInstructorRevenueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>): Apollo.UseSuspenseQueryResult<GetInstructorRevenueQuery | undefined, GetInstructorRevenueQueryVariables>;
export function useGetInstructorRevenueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>(GetInstructorRevenueDocument, options);
        }
export type GetInstructorRevenueQueryHookResult = ReturnType<typeof useGetInstructorRevenueQuery>;
export type GetInstructorRevenueLazyQueryHookResult = ReturnType<typeof useGetInstructorRevenueLazyQuery>;
export type GetInstructorRevenueSuspenseQueryHookResult = ReturnType<typeof useGetInstructorRevenueSuspenseQuery>;
export type GetInstructorRevenueQueryResult = Apollo.QueryResult<GetInstructorRevenueQuery, GetInstructorRevenueQueryVariables>;
export const ExportRevenueDocument = gql`
    query ExportRevenue($period: RevenueInstructorPeriod!) {
  exportRevenue(period: $period) {
    success
    downloadUrl
    filename
  }
}
    `;

/**
 * __useExportRevenueQuery__
 *
 * To run a query within a React component, call `useExportRevenueQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportRevenueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportRevenueQuery({
 *   variables: {
 *      period: // value for 'period'
 *   },
 * });
 */
export function useExportRevenueQuery(baseOptions: Apollo.QueryHookOptions<ExportRevenueQuery, ExportRevenueQueryVariables> & ({ variables: ExportRevenueQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExportRevenueQuery, ExportRevenueQueryVariables>(ExportRevenueDocument, options);
      }
export function useExportRevenueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExportRevenueQuery, ExportRevenueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExportRevenueQuery, ExportRevenueQueryVariables>(ExportRevenueDocument, options);
        }
// @ts-ignore
export function useExportRevenueSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExportRevenueQuery, ExportRevenueQueryVariables>): Apollo.UseSuspenseQueryResult<ExportRevenueQuery, ExportRevenueQueryVariables>;
export function useExportRevenueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportRevenueQuery, ExportRevenueQueryVariables>): Apollo.UseSuspenseQueryResult<ExportRevenueQuery | undefined, ExportRevenueQueryVariables>;
export function useExportRevenueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportRevenueQuery, ExportRevenueQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExportRevenueQuery, ExportRevenueQueryVariables>(ExportRevenueDocument, options);
        }
export type ExportRevenueQueryHookResult = ReturnType<typeof useExportRevenueQuery>;
export type ExportRevenueLazyQueryHookResult = ReturnType<typeof useExportRevenueLazyQuery>;
export type ExportRevenueSuspenseQueryHookResult = ReturnType<typeof useExportRevenueSuspenseQuery>;
export type ExportRevenueQueryResult = Apollo.QueryResult<ExportRevenueQuery, ExportRevenueQueryVariables>;
export const StudentConversationsDocument = gql`
    query StudentConversations($page: Int, $pageSize: Int, $courseId: String, $search: String) {
  studentConversations(
    page: $page
    pageSize: $pageSize
    courseId: $courseId
    search: $search
  ) {
    conversations {
      id
      participantId
      participantName
      participantImage
      participantEmail
      lastMessage
      lastMessageAt
      unreadCount
      courseId
      courseTitle
    }
    total
    page
    pageSize
  }
}
    `;

/**
 * __useStudentConversationsQuery__
 *
 * To run a query within a React component, call `useStudentConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentConversationsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      courseId: // value for 'courseId'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useStudentConversationsQuery(baseOptions?: Apollo.QueryHookOptions<StudentConversationsQuery, StudentConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudentConversationsQuery, StudentConversationsQueryVariables>(StudentConversationsDocument, options);
      }
export function useStudentConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentConversationsQuery, StudentConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudentConversationsQuery, StudentConversationsQueryVariables>(StudentConversationsDocument, options);
        }
// @ts-ignore
export function useStudentConversationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StudentConversationsQuery, StudentConversationsQueryVariables>): Apollo.UseSuspenseQueryResult<StudentConversationsQuery, StudentConversationsQueryVariables>;
export function useStudentConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentConversationsQuery, StudentConversationsQueryVariables>): Apollo.UseSuspenseQueryResult<StudentConversationsQuery | undefined, StudentConversationsQueryVariables>;
export function useStudentConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentConversationsQuery, StudentConversationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudentConversationsQuery, StudentConversationsQueryVariables>(StudentConversationsDocument, options);
        }
export type StudentConversationsQueryHookResult = ReturnType<typeof useStudentConversationsQuery>;
export type StudentConversationsLazyQueryHookResult = ReturnType<typeof useStudentConversationsLazyQuery>;
export type StudentConversationsSuspenseQueryHookResult = ReturnType<typeof useStudentConversationsSuspenseQuery>;
export type StudentConversationsQueryResult = Apollo.QueryResult<StudentConversationsQuery, StudentConversationsQueryVariables>;
export const StudentConversationDetailDocument = gql`
    query StudentConversationDetail($conversationId: String!, $limit: Int) {
  studentConversationDetail(conversationId: $conversationId, limit: $limit) {
    id
    participantId
    participantName
    participantImage
    participantEmail
    courseId
    courseTitle
    messages {
      id
      content
      senderId
      senderName
      senderImage
      status
      readAt
      createdAt
    }
    totalMessages
    createdAt
  }
}
    `;

/**
 * __useStudentConversationDetailQuery__
 *
 * To run a query within a React component, call `useStudentConversationDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentConversationDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentConversationDetailQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useStudentConversationDetailQuery(baseOptions: Apollo.QueryHookOptions<StudentConversationDetailQuery, StudentConversationDetailQueryVariables> & ({ variables: StudentConversationDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>(StudentConversationDetailDocument, options);
      }
export function useStudentConversationDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>(StudentConversationDetailDocument, options);
        }
// @ts-ignore
export function useStudentConversationDetailSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>): Apollo.UseSuspenseQueryResult<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>;
export function useStudentConversationDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>): Apollo.UseSuspenseQueryResult<StudentConversationDetailQuery | undefined, StudentConversationDetailQueryVariables>;
export function useStudentConversationDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>(StudentConversationDetailDocument, options);
        }
export type StudentConversationDetailQueryHookResult = ReturnType<typeof useStudentConversationDetailQuery>;
export type StudentConversationDetailLazyQueryHookResult = ReturnType<typeof useStudentConversationDetailLazyQuery>;
export type StudentConversationDetailSuspenseQueryHookResult = ReturnType<typeof useStudentConversationDetailSuspenseQuery>;
export type StudentConversationDetailQueryResult = Apollo.QueryResult<StudentConversationDetailQuery, StudentConversationDetailQueryVariables>;
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
// @ts-ignore
export function useGetMyEnrolledCoursesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>;
export function useGetMyEnrolledCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyEnrolledCoursesQuery, GetMyEnrolledCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyEnrolledCoursesQuery | undefined, GetMyEnrolledCoursesQueryVariables>;
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
// @ts-ignore
export function useGetCourseWithCurriculumSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>;
export function useGetCourseWithCurriculumSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseWithCurriculumQuery, GetCourseWithCurriculumQueryVariables>): Apollo.UseSuspenseQueryResult<GetCourseWithCurriculumQuery | undefined, GetCourseWithCurriculumQueryVariables>;
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
// @ts-ignore
export function useGetCoursesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCoursesQuery, GetCoursesQueryVariables>;
export function useGetCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCoursesQuery | undefined, GetCoursesQueryVariables>;
export function useGetCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCoursesQuery, GetCoursesQueryVariables>(GetCoursesDocument, options);
        }
export type GetCoursesQueryHookResult = ReturnType<typeof useGetCoursesQuery>;
export type GetCoursesLazyQueryHookResult = ReturnType<typeof useGetCoursesLazyQuery>;
export type GetCoursesSuspenseQueryHookResult = ReturnType<typeof useGetCoursesSuspenseQuery>;
export type GetCoursesQueryResult = Apollo.QueryResult<GetCoursesQuery, GetCoursesQueryVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  getAllUsers {
    id
    clerkId
    name
    email
    role
    image
    emailVerified
    banned
    banReason
    createdAt
    updatedAt
    _count {
      coursesCreated
      enrollments
    }
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
// @ts-ignore
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllUsersQuery | undefined, GetAllUsersQueryVariables>;
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetUserByIdDocument = gql`
    query GetUserById($userId: String!) {
  getUserById(userId: $userId) {
    id
    clerkId
    name
    email
    role
    image
    emailVerified
    banned
    banReason
    banExpires
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables> & ({ variables: GetUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
// @ts-ignore
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserByIdQuery | undefined, GetUserByIdQueryVariables>;
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByIdSuspenseQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetUserStatsDocument = gql`
    query GetUserStats {
  getUserStats {
    totalUsers
    students
    instructors
    admins
  }
}
    `;

/**
 * __useGetUserStatsQuery__
 *
 * To run a query within a React component, call `useGetUserStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
      }
export function useGetUserStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
// @ts-ignore
export function useGetUserStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserStatsQuery, GetUserStatsQueryVariables>;
export function useGetUserStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserStatsQuery | undefined, GetUserStatsQueryVariables>;
export function useGetUserStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
export type GetUserStatsQueryHookResult = ReturnType<typeof useGetUserStatsQuery>;
export type GetUserStatsLazyQueryHookResult = ReturnType<typeof useGetUserStatsLazyQuery>;
export type GetUserStatsSuspenseQueryHookResult = ReturnType<typeof useGetUserStatsSuspenseQuery>;
export type GetUserStatsQueryResult = Apollo.QueryResult<GetUserStatsQuery, GetUserStatsQueryVariables>;
export const PromoteToInstructorDocument = gql`
    mutation PromoteToInstructor($input: PromoteUserInput!) {
  promoteToInstructor(input: $input) {
    id
    email
    name
    role
  }
}
    `;
export type PromoteToInstructorMutationFn = Apollo.MutationFunction<PromoteToInstructorMutation, PromoteToInstructorMutationVariables>;

/**
 * __usePromoteToInstructorMutation__
 *
 * To run a mutation, you first call `usePromoteToInstructorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromoteToInstructorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promoteToInstructorMutation, { data, loading, error }] = usePromoteToInstructorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePromoteToInstructorMutation(baseOptions?: Apollo.MutationHookOptions<PromoteToInstructorMutation, PromoteToInstructorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PromoteToInstructorMutation, PromoteToInstructorMutationVariables>(PromoteToInstructorDocument, options);
      }
export type PromoteToInstructorMutationHookResult = ReturnType<typeof usePromoteToInstructorMutation>;
export type PromoteToInstructorMutationResult = Apollo.MutationResult<PromoteToInstructorMutation>;
export type PromoteToInstructorMutationOptions = Apollo.BaseMutationOptions<PromoteToInstructorMutation, PromoteToInstructorMutationVariables>;
export const UpdateUserRoleDocument = gql`
    mutation UpdateUserRole($input: UpdateUserRoleInput!) {
  updateUserRole(input: $input) {
    id
    email
    name
    role
  }
}
    `;
export type UpdateUserRoleMutationFn = Apollo.MutationFunction<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;

/**
 * __useUpdateUserRoleMutation__
 *
 * To run a mutation, you first call `useUpdateUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserRoleMutation, { data, loading, error }] = useUpdateUserRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>(UpdateUserRoleDocument, options);
      }
export type UpdateUserRoleMutationHookResult = ReturnType<typeof useUpdateUserRoleMutation>;
export type UpdateUserRoleMutationResult = Apollo.MutationResult<UpdateUserRoleMutation>;
export type UpdateUserRoleMutationOptions = Apollo.BaseMutationOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const BanUserDocument = gql`
    mutation BanUser($userId: String!, $reason: String, $expiresAt: DateTime) {
  banUser(userId: $userId, reason: $reason, expiresAt: $expiresAt) {
    id
    email
    banned
    banReason
  }
}
    `;
export type BanUserMutationFn = Apollo.MutationFunction<BanUserMutation, BanUserMutationVariables>;

/**
 * __useBanUserMutation__
 *
 * To run a mutation, you first call `useBanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [banUserMutation, { data, loading, error }] = useBanUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      reason: // value for 'reason'
 *      expiresAt: // value for 'expiresAt'
 *   },
 * });
 */
export function useBanUserMutation(baseOptions?: Apollo.MutationHookOptions<BanUserMutation, BanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BanUserMutation, BanUserMutationVariables>(BanUserDocument, options);
      }
export type BanUserMutationHookResult = ReturnType<typeof useBanUserMutation>;
export type BanUserMutationResult = Apollo.MutationResult<BanUserMutation>;
export type BanUserMutationOptions = Apollo.BaseMutationOptions<BanUserMutation, BanUserMutationVariables>;
export const UnbanUserDocument = gql`
    mutation UnbanUser($userId: String!) {
  unbanUser(userId: $userId) {
    id
    email
    banned
  }
}
    `;
export type UnbanUserMutationFn = Apollo.MutationFunction<UnbanUserMutation, UnbanUserMutationVariables>;

/**
 * __useUnbanUserMutation__
 *
 * To run a mutation, you first call `useUnbanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnbanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unbanUserMutation, { data, loading, error }] = useUnbanUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnbanUserMutation(baseOptions?: Apollo.MutationHookOptions<UnbanUserMutation, UnbanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnbanUserMutation, UnbanUserMutationVariables>(UnbanUserDocument, options);
      }
export type UnbanUserMutationHookResult = ReturnType<typeof useUnbanUserMutation>;
export type UnbanUserMutationResult = Apollo.MutationResult<UnbanUserMutation>;
export type UnbanUserMutationOptions = Apollo.BaseMutationOptions<UnbanUserMutation, UnbanUserMutationVariables>;
export const GetVideoProgressDocument = gql`
    query GetVideoProgress($lessonId: String!) {
  getVideoProgress(lessonId: $lessonId) {
    id
    lessonId
    currentTime
    duration
    progressPercent
    isCompleted
    completedAt
    lastWatchedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetVideoProgressQuery__
 *
 * To run a query within a React component, call `useGetVideoProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoProgressQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useGetVideoProgressQuery(baseOptions: Apollo.QueryHookOptions<GetVideoProgressQuery, GetVideoProgressQueryVariables> & ({ variables: GetVideoProgressQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVideoProgressQuery, GetVideoProgressQueryVariables>(GetVideoProgressDocument, options);
      }
export function useGetVideoProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVideoProgressQuery, GetVideoProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVideoProgressQuery, GetVideoProgressQueryVariables>(GetVideoProgressDocument, options);
        }
// @ts-ignore
export function useGetVideoProgressSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVideoProgressQuery, GetVideoProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetVideoProgressQuery, GetVideoProgressQueryVariables>;
export function useGetVideoProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVideoProgressQuery, GetVideoProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetVideoProgressQuery | undefined, GetVideoProgressQueryVariables>;
export function useGetVideoProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVideoProgressQuery, GetVideoProgressQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVideoProgressQuery, GetVideoProgressQueryVariables>(GetVideoProgressDocument, options);
        }
export type GetVideoProgressQueryHookResult = ReturnType<typeof useGetVideoProgressQuery>;
export type GetVideoProgressLazyQueryHookResult = ReturnType<typeof useGetVideoProgressLazyQuery>;
export type GetVideoProgressSuspenseQueryHookResult = ReturnType<typeof useGetVideoProgressSuspenseQuery>;
export type GetVideoProgressQueryResult = Apollo.QueryResult<GetVideoProgressQuery, GetVideoProgressQueryVariables>;
export const GetUserVideoProgressDocument = gql`
    query GetUserVideoProgress {
  getUserVideoProgress {
    id
    lessonId
    currentTime
    duration
    progressPercent
    isCompleted
    completedAt
    lastWatchedAt
    lesson {
      id
      title
      description
      videoUrl
      externalVideoUrl
      duration
      chapter {
        id
        title
        course {
          id
          title
          slug
          imageUrl
        }
      }
    }
  }
}
    `;

/**
 * __useGetUserVideoProgressQuery__
 *
 * To run a query within a React component, call `useGetUserVideoProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserVideoProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserVideoProgressQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserVideoProgressQuery(baseOptions?: Apollo.QueryHookOptions<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>(GetUserVideoProgressDocument, options);
      }
export function useGetUserVideoProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>(GetUserVideoProgressDocument, options);
        }
// @ts-ignore
export function useGetUserVideoProgressSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>;
export function useGetUserVideoProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserVideoProgressQuery | undefined, GetUserVideoProgressQueryVariables>;
export function useGetUserVideoProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>(GetUserVideoProgressDocument, options);
        }
export type GetUserVideoProgressQueryHookResult = ReturnType<typeof useGetUserVideoProgressQuery>;
export type GetUserVideoProgressLazyQueryHookResult = ReturnType<typeof useGetUserVideoProgressLazyQuery>;
export type GetUserVideoProgressSuspenseQueryHookResult = ReturnType<typeof useGetUserVideoProgressSuspenseQuery>;
export type GetUserVideoProgressQueryResult = Apollo.QueryResult<GetUserVideoProgressQuery, GetUserVideoProgressQueryVariables>;
export const SaveVideoProgressDocument = gql`
    mutation SaveVideoProgress($input: SaveVideoProgressInput!) {
  saveVideoProgress(input: $input) {
    id
    lessonId
    currentTime
    duration
    progressPercent
    isCompleted
    completedAt
    lastWatchedAt
  }
}
    `;
export type SaveVideoProgressMutationFn = Apollo.MutationFunction<SaveVideoProgressMutation, SaveVideoProgressMutationVariables>;

/**
 * __useSaveVideoProgressMutation__
 *
 * To run a mutation, you first call `useSaveVideoProgressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveVideoProgressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveVideoProgressMutation, { data, loading, error }] = useSaveVideoProgressMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveVideoProgressMutation(baseOptions?: Apollo.MutationHookOptions<SaveVideoProgressMutation, SaveVideoProgressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveVideoProgressMutation, SaveVideoProgressMutationVariables>(SaveVideoProgressDocument, options);
      }
export type SaveVideoProgressMutationHookResult = ReturnType<typeof useSaveVideoProgressMutation>;
export type SaveVideoProgressMutationResult = Apollo.MutationResult<SaveVideoProgressMutation>;
export type SaveVideoProgressMutationOptions = Apollo.BaseMutationOptions<SaveVideoProgressMutation, SaveVideoProgressMutationVariables>;
export const MarkLessonCompletedDocument = gql`
    mutation MarkLessonCompleted($lessonId: String!) {
  markLessonCompleted(lessonId: $lessonId) {
    id
    lessonId
    isCompleted
    completedAt
    progressPercent
  }
}
    `;
export type MarkLessonCompletedMutationFn = Apollo.MutationFunction<MarkLessonCompletedMutation, MarkLessonCompletedMutationVariables>;

/**
 * __useMarkLessonCompletedMutation__
 *
 * To run a mutation, you first call `useMarkLessonCompletedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkLessonCompletedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markLessonCompletedMutation, { data, loading, error }] = useMarkLessonCompletedMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useMarkLessonCompletedMutation(baseOptions?: Apollo.MutationHookOptions<MarkLessonCompletedMutation, MarkLessonCompletedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkLessonCompletedMutation, MarkLessonCompletedMutationVariables>(MarkLessonCompletedDocument, options);
      }
export type MarkLessonCompletedMutationHookResult = ReturnType<typeof useMarkLessonCompletedMutation>;
export type MarkLessonCompletedMutationResult = Apollo.MutationResult<MarkLessonCompletedMutation>;
export type MarkLessonCompletedMutationOptions = Apollo.BaseMutationOptions<MarkLessonCompletedMutation, MarkLessonCompletedMutationVariables>;
export const DeleteVideoProgressDocument = gql`
    mutation DeleteVideoProgress($lessonId: String!) {
  deleteVideoProgress(lessonId: $lessonId)
}
    `;
export type DeleteVideoProgressMutationFn = Apollo.MutationFunction<DeleteVideoProgressMutation, DeleteVideoProgressMutationVariables>;

/**
 * __useDeleteVideoProgressMutation__
 *
 * To run a mutation, you first call `useDeleteVideoProgressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVideoProgressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVideoProgressMutation, { data, loading, error }] = useDeleteVideoProgressMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useDeleteVideoProgressMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVideoProgressMutation, DeleteVideoProgressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVideoProgressMutation, DeleteVideoProgressMutationVariables>(DeleteVideoProgressDocument, options);
      }
export type DeleteVideoProgressMutationHookResult = ReturnType<typeof useDeleteVideoProgressMutation>;
export type DeleteVideoProgressMutationResult = Apollo.MutationResult<DeleteVideoProgressMutation>;
export type DeleteVideoProgressMutationOptions = Apollo.BaseMutationOptions<DeleteVideoProgressMutation, DeleteVideoProgressMutationVariables>;