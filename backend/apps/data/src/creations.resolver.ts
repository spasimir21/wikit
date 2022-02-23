import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CreationsService } from './creations.service';
import { CreationsDTO } from './model/creations.model';

@Resolver()
class CreationsResolver {
  constructor(private readonly creationsService: CreationsService) {}

  @Query(() => CreationsDTO)
  async creations(@Args('uuid', { type: () => ID }) uuid: string): Promise<CreationsDTO> {
    return await this.creationsService.getCreations(uuid);
  }
}

export { CreationsResolver };
