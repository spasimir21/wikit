import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDTO } from './user.model';

@ObjectType()
class WikitDTO {
  @Field(() => ID)
  uuid: string;

  @Field(() => String)
  title: string;

  @Field(() => UserDTO)
  created_by: UserDTO;
}

export { WikitDTO };
