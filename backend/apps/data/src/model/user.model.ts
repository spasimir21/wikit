import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class UserDTO {
  @Field(() => ID)
  uuid: string;

  @Field(() => String)
  username: string;
}

export { UserDTO };
