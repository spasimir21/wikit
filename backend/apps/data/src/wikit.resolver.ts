import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Mutation(() => ID)
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async createWikit(
    @GQLToken() token: Token,
    @Args('title') title: string,
    @Args('text') text: string,
    @Args('parents', { type: () => [ID] }) parents: string[],
    @Args('children', { type: () => [ID] }) children: string[]
  ): Promise<string> {
    return await this.wikitService.createWikit(token.data.uuid, title, text, parents, children);
  }
}

export { WikitResolver };
