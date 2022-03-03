import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RatingService } from './rating.service';
import { Rating } from './model/rating.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Query(() => [Rating])
  async ratings(@Args('uuid', { type: () => ID }) uuid: string): Promise<Rating[]> {
    return await this.ratingService.getRatings(uuid);
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async rateText(
    @GQLToken() token: Token,
    @Args('text', { type: () => ID }) text: string,
    @Args('rating', { type: () => Int }) rating: number
  ): Promise<boolean> {
    return await this.ratingService.rateText(text, token.data.uuid, rating);
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async rateRelation(
    @GQLToken() token: Token,
    @Args('relation', { type: () => ID }) relation: string,
    @Args('rating', { type: () => Int }) rating: number
  ): Promise<boolean> {
    return await this.ratingService.rateRelation(relation, token.data.uuid, rating);
  }
}

export { RatingResolver };
