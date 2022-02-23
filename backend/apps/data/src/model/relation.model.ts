import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDTO } from './user.model';

@ObjectType()
class RelationDTO {
  @Field(() => ID)
  uuid: string;

  @Field(() => ID)
  parent: string;

  @Field(() => ID)
  child: string;

  @Field(() => Number)
  rating: number;

  @Field(() => UserDTO)
  created_by: UserDTO;
}

export { RelationDTO };
