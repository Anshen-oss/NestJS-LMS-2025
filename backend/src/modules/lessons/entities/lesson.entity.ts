import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { LessonProgress } from './lesson-progress.entity';

@ObjectType()
export class Lesson {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true }) // ← Type explicite
  description?: string | null;

  @Field(() => String, { nullable: true })
  content?: string | null;

  @Field(() => Int)
  position: number;

  // Media
  @Field(() => String, { nullable: true }) // ← Type explicite
  thumbnailKey?: string | null;

  @Field(() => String, { nullable: true }) // ← Type explicite
  videoKey?: string | null;

  @Field(() => String, { nullable: true }) // ← Type explicite
  videoUrl?: string | null;

  // Properties
  @Field(() => Int, { nullable: true })
  duration?: number | null;

  @Field({ defaultValue: false })
  isFree: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════

  @Field(() => Chapter, { nullable: true }) // ← Ajouté nullable: true
  chapter?: Chapter | null;

  @Field(() => [LessonProgress], { nullable: true })
  lessonProgress?: LessonProgress[] | null;

  // Champ calculé pour l'utilisateur courant (optionnel)
  @Field(() => Boolean, { nullable: true }) // ← Type explicite
  isCompleted?: boolean;
}
