import { registerEnumType } from '@nestjs/graphql';
import {
  CourseLevel,
  CourseStatus,
  EnrollmentStatus,
  UserRole,
} from '@prisma/client'; // ✅ Ajout de UserRole

// Enregistrer CourseLevel pour GraphQL
registerEnumType(CourseLevel, {
  name: 'CourseLevel',
  description: 'The difficulty level of a course',
  valuesMap: {
    Beginner: {
      description: 'Beginner level course',
    },
    Intermediate: {
      description: 'Intermediate level course',
    },
    Advanced: {
      description: 'Advanced level course',
    },
  },
});

// Enregistrer CourseStatus pour GraphQL
registerEnumType(CourseStatus, {
  name: 'CourseStatus',
  description: 'The publication status of a course',
  valuesMap: {
    Draft: {
      description: 'Course is in draft mode',
    },
    Published: {
      description: 'Course is published and visible to users',
    },
    Archived: {
      description: 'Course is archived',
    },
  },
});

// ✅ AJOUTÉ : Enregistrer UserRole pour GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of a user in the system',
  valuesMap: {
    USER: {
      description: 'Regular user with basic permissions',
    },
    ADMIN: {
      description: 'Administrator with full permissions',
    },
    INSTRUCTOR: {
      description: 'Instructor who can create and manage courses',
    },
  },
});

// ✅ AJOUTER EnrollmentStatus
registerEnumType(EnrollmentStatus, {
  name: 'EnrollmentStatus',
  description: 'The status of a course enrollment',
  valuesMap: {
    Pending: {
      description: 'Payment is pending',
    },
    Active: {
      description: 'Enrollment is active',
    },
    Cancelled: {
      description: 'Enrollment was cancelled or refunded',
    },
  },
});
