import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string | null;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
}
