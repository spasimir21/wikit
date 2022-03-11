import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { UserDTO } from './user.model';

@ObjectType()
class TextDTO {
  @Field(() => ID)
  uuid: string;

  @Field(() => ID)
  wikit: string;

  @Field(() => String)
  text: string;

  @Field(() => Float)
  rating: number;

  @Field(() => UserDTO)
  created_by: UserDTO;
}

export { TextDTO };
