import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class TextDTO {
  @Field(() => String)
  query: string;

  @Field(() => Number)
  target_text_difficulty: number;

  @Field(() => ID)
  wikit: string;

  @Field(() => ID)
  text: string;

  @Field(() => ID, { nullable: true })
  relation?: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => [TextDTO])
  sub?: TextDTO[];
}

export { TextDTO };
