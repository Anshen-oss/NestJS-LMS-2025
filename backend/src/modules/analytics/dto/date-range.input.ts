import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

@InputType()
export class DateRangeInput {
  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
