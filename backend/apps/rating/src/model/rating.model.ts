import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { RatingType } from './ratingType.enum';

@ObjectType()
class Rating {
  @Field(() => RatingType)
  type: RatingType;

  @Field(() => ID)
  object: string;

  @Field(() => Int)
  rating: number;
}

export { Rating };
