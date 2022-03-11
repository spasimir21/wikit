import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class TextDTO {
  @Field(() => String)
  query: string;

  @Field(() => ID)
  wikit: string;

  @Field(() => ID)
  text: string;

  @Field(() => ID, { nullable: true })
  relation?: string;

  @Field(() => [TextDTO], { nullable: true })
  sub?: TextDTO[];
}

export { TextDTO };
