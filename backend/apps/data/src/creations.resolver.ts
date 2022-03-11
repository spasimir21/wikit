import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CreationsService } from './creations.service';
import { CreationDTO } from './model/creation.model';

@Resolver()
class CreationsResolver {
  constructor(private readonly creationsService: CreationsService) {}

  @Query(() => [CreationDTO])
  async creations(@Args('uuid', { type: () => ID }) uuid: string): Promise<CreationDTO[]> {
    return await this.creationsService.getCreations(uuid);
  }
}

export { CreationsResolver };
