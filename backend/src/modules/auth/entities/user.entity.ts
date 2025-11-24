import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client'; // ✅ Import depuis Prisma

// ❌ SUPPRIMÉ : export enum UserRole (maintenant dans @prisma/client)
// ❌ SUPPRIMÉ : registerEnumType (sera fait dans enums.ts si nécessaire)

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  // ✅ CORRIGÉ : role est maintenant nullable
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field()
  createdAt: Date;

  // ═══════════════════════════════════════════
  //              RELATIONS (optionnelles)
  // ═══════════════════════════════════════════

  // @Field(() => [Course], { nullable: true })
  // coursesCreated?: Course[];

  // @Field(() => [Enrollment], { nullable: true })
  // enrollments?: Enrollment[];

  // @Field(() => [LessonProgress], { nullable: true })
  // lessonProgress?: LessonProgress[];
}
