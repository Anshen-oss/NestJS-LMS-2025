import { gql, useMutation, useQuery } from '@apollo/client';

// ================================================================
// TYPES
// ================================================================

export interface InstructorProfile {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  profileImage?: string | null;
  socialLinks: SocialLinks;
  isVerified: boolean;
  websiteUrl?: string | null;
  aboutMe: string;
}

export interface SocialLinks {
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  instagram?: string | null;
  github?: string | null;
  website?: string | null;
}

export interface NotificationPreferences {
  id: string;
  emailOnNewEnrollment: boolean;
  emailOnNewReview: boolean;
  emailOnStudentQuestion: boolean;
  emailOnCourseUpdate: boolean;
  emailOnWeeklyReport: boolean;
  emailOnMonthlyReport: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface StripeConnectAccount {
  id: string;
  accountId: string;
  isConnected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  country: string;
  currency: string;
  businessType: string;
  bankAccount?: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  } | null;
  connectedAt: string;
  updatedAt: string;
}

export interface InstructorSettings {
  profile: InstructorProfile;
  notifications: NotificationPreferences;
  stripeAccount: StripeConnectAccount;
}

export interface ProfileUpdateInput {
  bio?: string;
  expertise?: string[];
  profileImage?: string;
  aboutMe?: string;
  websiteUrl?: string;
  socialLinks?: Partial<SocialLinks>;
}

export interface NotificationPreferencesInput {
  emailOnNewEnrollment?: boolean;
  emailOnNewReview?: boolean;
  emailOnStudentQuestion?: boolean;
  emailOnCourseUpdate?: boolean;
  emailOnWeeklyReport?: boolean;
  emailOnMonthlyReport?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
}

// ================================================================
// GRAPHQL QUERIES
// ================================================================

const GET_INSTRUCTOR_SETTINGS = gql`
  query GetInstructorSettings {
    instructorSettings {
      profile {
        id
        userId
        bio
        expertise
        profileImage
        socialLinks {
          twitter
          linkedin
          youtube
          instagram
          github
          website
        }
        isVerified
        websiteUrl
        aboutMe
      }
      notifications {
        id
        emailOnNewEnrollment
        emailOnNewReview
        emailOnStudentQuestion
        emailOnCourseUpdate
        emailOnWeeklyReport
        emailOnMonthlyReport
        pushNotifications
        smsNotifications
      }
      stripeAccount {
        id
        accountId
        isConnected
        chargesEnabled
        payoutsEnabled
        country
        currency
        businessType
        bankAccount {
          accountHolderName
          accountNumber
          routingNumber
          bankName
        }
        connectedAt
        updatedAt
      }
    }
  }
`;

const GET_INSTRUCTOR_PROFILE = gql`
  query GetInstructorProfile {
    instructorProfile {
      id
      userId
      bio
      expertise
      profileImage
      socialLinks {
        twitter
        linkedin
        youtube
        instagram
        github
        website
      }
      isVerified
      websiteUrl
      aboutMe
    }
  }
`;

const GET_NOTIFICATION_PREFERENCES = gql`
  query GetNotificationPreferences {
    notificationPreferences {
      id
      emailOnNewEnrollment
      emailOnNewReview
      emailOnStudentQuestion
      emailOnCourseUpdate
      emailOnWeeklyReport
      emailOnMonthlyReport
      pushNotifications
      smsNotifications
    }
  }
`;

const GET_STRIPE_ACCOUNT = gql`
  query GetStripeAccount {
    stripeAccount {
      id
      accountId
      isConnected
      chargesEnabled
      payoutsEnabled
      country
      currency
      businessType
      bankAccount {
        accountHolderName
        accountNumber
        routingNumber
        bankName
      }
      connectedAt
      updatedAt
    }
  }
`;

// ================================================================
// GRAPHQL MUTATIONS
// ================================================================

const UPDATE_INSTRUCTOR_PROFILE = gql`
  mutation UpdateInstructorProfile($input: ProfileUpdateInput!) {
    updateInstructorProfile(input: $input) {
      id
      userId
      bio
      expertise
      profileImage
      socialLinks {
        twitter
        linkedin
        youtube
        instagram
        github
        website
      }
      isVerified
      websiteUrl
      aboutMe
    }
  }
`;

const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences($input: NotificationPreferencesInput!) {
    updateNotificationPreferences(input: $input) {
      id
      emailOnNewEnrollment
      emailOnNewReview
      emailOnStudentQuestion
      emailOnCourseUpdate
      emailOnWeeklyReport
      emailOnMonthlyReport
      pushNotifications
      smsNotifications
    }
  }
`;

const DISCONNECT_STRIPE = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      success
      message
    }
  }
`;

const GET_STRIPE_CONNECT_URL = gql`
  query GetStripeConnectUrl {
    getStripeConnectUrl {
      url
      expiresAt
    }
  }
`;

// ================================================================
// HOOKS
// ================================================================

/**
 * Hook pour récupérer tous les paramètres de l'instructeur
 */
export function useInstructorSettings() {
  const { data, loading, error, refetch } = useQuery<
    { instructorSettings: InstructorSettings }
  >(GET_INSTRUCTOR_SETTINGS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    settings: data?.instructorSettings,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer le profil de l'instructeur
 */
export function useInstructorProfile() {
  const { data, loading, error, refetch } = useQuery<
    { instructorProfile: InstructorProfile }
  >(GET_INSTRUCTOR_PROFILE, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateProfile, { loading: updating, error: updateError }] = useMutation<
    { updateInstructorProfile: InstructorProfile },
    { input: ProfileUpdateInput }
  >(UPDATE_INSTRUCTOR_PROFILE, {
    refetchQueries: [{ query: GET_INSTRUCTOR_PROFILE }],
  });

  const handleUpdateProfile = async (input: ProfileUpdateInput) => {
    try {
      const result = await updateProfile({ variables: { input } });
      return { success: true, data: result.data?.updateInstructorProfile };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    profile: data?.instructorProfile,
    loading,
    error,
    refetch,
    updateProfile: handleUpdateProfile,
    isUpdating: updating,
    updateError,
  };
}

/**
 * Hook pour gérer les préférences de notifications
 */
export function useNotificationPreferences() {
  const { data, loading, error, refetch } = useQuery<
    { notificationPreferences: NotificationPreferences }
  >(GET_NOTIFICATION_PREFERENCES, {
    fetchPolicy: 'cache-and-network',
  });

  const [updatePreferences, { loading: updating, error: updateError }] = useMutation<
    { updateNotificationPreferences: NotificationPreferences },
    { input: NotificationPreferencesInput }
  >(UPDATE_NOTIFICATION_PREFERENCES, {
    refetchQueries: [{ query: GET_NOTIFICATION_PREFERENCES }],
  });

  const handleUpdatePreferences = async (input: NotificationPreferencesInput) => {
    try {
      const result = await updatePreferences({ variables: { input } });
      return { success: true, data: result.data?.updateNotificationPreferences };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    preferences: data?.notificationPreferences,
    loading,
    error,
    refetch,
    updatePreferences: handleUpdatePreferences,
    isUpdating: updating,
    updateError,
  };
}

/**
 * Hook pour gérer le compte Stripe Connect
 */
export function useStripeAccount() {
  const { data, loading, error, refetch } = useQuery<
    { stripeAccount: StripeConnectAccount }
  >(GET_STRIPE_ACCOUNT, {
    fetchPolicy: 'cache-and-network',
  });

  const [disconnect, { loading: disconnecting, error: disconnectError }] = useMutation<{
    disconnectStripe: { success: boolean; message: string };
  }>(DISCONNECT_STRIPE, {
    refetchQueries: [{ query: GET_STRIPE_ACCOUNT }],
  });

  const handleDisconnect = async () => {
    try {
      const result = await disconnect();
      return { success: result.data?.disconnectStripe.success, message: result.data?.disconnectStripe.message };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    stripeAccount: data?.stripeAccount,
    loading,
    error,
    refetch,
    disconnect: handleDisconnect,
    isDisconnecting: disconnecting,
    disconnectError,
  };
}

/**
 * Hook pour obtenir l'URL de connexion Stripe
 */
export function useStripeConnectUrl() {
  const { data, loading, error, refetch } = useQuery<{
    getStripeConnectUrl: { url: string; expiresAt: string };
  }>(GET_STRIPE_CONNECT_URL, {
    fetchPolicy: 'no-cache',
  });

  return {
    connectUrl: data?.getStripeConnectUrl?.url,
    expiresAt: data?.getStripeConnectUrl?.expiresAt,
    loading,
    error,
    refetch,
  };
}
