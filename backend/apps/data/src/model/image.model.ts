import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { WikitDTO } from './wikit.model';
import { UserDTO } from './user.model';

@ObjectType()
class ImageDTO {
  @Field(() => ID)
  uuid: string;

  @Field(() => String)
  wikit_id: String;

  @Field(() => String)
  wikit_title: String;

  @Field(() => String)
  description: string;

  @Field(() => String)
  hash: string;

  @Field(() => Float)
  rating: number;

  @Field(() => UserDTO)
  created_by: UserDTO;
}

export { ImageDTO };
