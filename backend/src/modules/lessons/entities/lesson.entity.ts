import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { LessonProgress } from './lesson-progress.entity';

@ObjectType()
export class Lesson {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  position: number;

  // Media
  @Field({ nullable: true })
  thumbnailKey?: string;

  @Field({ nullable: true })
  videoKey?: string;

  @Field({ nullable: true })
  videoUrl?: string;

  // Properties
  @Field(() => Int, { nullable: true })
  duration?: number; // Durée en secondes

  @Field({ defaultValue: false })
  isFree: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════

  @Field(() => Chapter)
  chapter: Chapter;

  @Field(() => [LessonProgress], { nullable: true })
  lessonProgress?: LessonProgress[];

  // Champ calculé pour l'utilisateur courant (optionnel)
  @Field({ nullable: true })
  isCompleted?: boolean; // True si l'user a complété cette leçon
}
