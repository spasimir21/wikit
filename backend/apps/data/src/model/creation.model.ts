import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CreationType } from './creationType.enum';

@ObjectType()
class CreationDTO {
  @Field(() => CreationType)
  type: CreationType;

  @Field(() => ID)
  uuid: string;
}

export { CreationDTO };
