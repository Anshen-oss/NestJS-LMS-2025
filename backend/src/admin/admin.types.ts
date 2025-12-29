import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

/**
 * Statistiques globales de la plateforme pour les admins
 */
@ObjectType()
export class AdminStats {
  @Field(() => Int, { description: "Nombre total d'utilisateurs" })
  totalUsers: number;

  @Field(() => Int, { description: 'Nombre total de cours' })
  totalCourses: number;

  @Field(() => Float, { description: 'Revenus totaux générés' })
  totalRevenue: number;

  @Field(() => Int, { description: "Nombre d'étudiants actifs" })
  activeStudents: number;

  @Field(() => Int, { description: "Nombre d'inscriptions récentes" })
  recentEnrollments: number;
}

/**
 * Type de retour pour les actions admin avec message de succès
 */
@ObjectType()
export class AdminActionResponse {
  @Field(() => Boolean, { description: "Indique si l'action a réussi" })
  success: boolean;

  @Field(() => String, { description: "Message de confirmation ou d'erreur" })
  message: string;
}

/**
 * Input pour modifier le rôle d'un utilisateur
 */
import { registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

// Enregistrer l'enum pour GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Rôles disponibles pour les utilisateurs',
});
