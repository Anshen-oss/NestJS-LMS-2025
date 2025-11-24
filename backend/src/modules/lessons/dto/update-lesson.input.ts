import { InputType, PartialType } from '@nestjs/graphql';
import { CreateLessonInput } from './create-lesson.input';

@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {
  // Tous les champs de CreateLessonInput sont maintenant optionnels
}
