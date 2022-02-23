import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RelationService } from './relation.service';
import { RelationDTO } from './model/relation.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
class RelationResolver {
  constructor(private readonly relationService: RelationService) {}

  @Query(() => RelationDTO, { nullable: true })
  async relation(@Args('uuid', { type: () => ID }) uuid: string): Promise<RelationDTO | null> {
    return await this.relationService.getRelation(uuid);
  }

  @Mutation(() => ID, { nullable: true })
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async createRelation(
    @GQLToken() token: Token,
    @Args('parent', { type: () => ID }) parent: string,
    @Args('child', { type: () => ID }) child: string
  ): Promise<string | null> {
    return await this.relationService.createRelation(token.data.uuid, parent, child);
  }
}

export { RelationResolver };
