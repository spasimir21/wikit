import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { RatingType } from './ratingType.enum';

@ObjectType()
class RatingDTO {
  @Field(() => RatingType)
  type: RatingType;

  @Field(() => ID)
  object: string;

  @Field(() => Int)
  rating: number;
}

export { RatingDTO };
