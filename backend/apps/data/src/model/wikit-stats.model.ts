import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class WikitStatsDTO {
  @Field(() => ID)
  uuid: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  textCount: number;

  @Field(() => Float)
  averageRating: number;
}

export { WikitStatsDTO };
