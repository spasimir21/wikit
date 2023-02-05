import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WikitStatsDTO } from './model/wikit-stats.model';
import { WikitService } from './wikit.service';
import { WikitDTO } from './model/wikit.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
class WikitResolver {
  constructor(private readonly wikitService: WikitService) {}

  @Query(() => WikitDTO, { nullable: true })
  async wikit(@Args('uuid', { type: () => ID }) uuid: string): Promise<WikitDTO | null> {
    return await this.wikitService.getWikit(uuid);
  }

  @Query(() => [WikitDTO])
  async wikits(@Args('uuids', { type: () => [ID] }) uuids: string[]): Promise<WikitDTO[]> {
    return await this.wikitService.getWikits(uuids);
  }

  @Query(() => WikitStatsDTO, { nullable: true })
  async findWikit(@Args('title') title: string): Promise<WikitStatsDTO | null> {
    return await this.wikitService.findWikit(title);
  }

  @Mutation(() => ID)
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async createWikit(
    @GQLToken() token: Token,
    @Args('title') title: string,
    @Args('text') text: string,
    @Args('text_difficulty', { type: () => Int }) text_difficulty: number,
    @Args('parents', { type: () => [ID] }) parents: string[],
    @Args('children', { type: () => [ID] }) children: string[]
  ): Promise<string> {
    return await this.wikitService.createWikit(token.data.uuid, title, text, text_difficulty, parents, children);
  }
}

export { WikitResolver };
