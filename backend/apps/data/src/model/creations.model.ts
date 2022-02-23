import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class CreationsDTO {
  @Field(() => [ID])
  wikits: string[];

  @Field(() => [ID])
  texts: string[];

  @Field(() => [ID])
  relations: string[];
}

export { CreationsDTO };
