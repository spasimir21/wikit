import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RatingService } from './rating.service';
import { RatingDTO } from './model/rating.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Query(() => [RatingDTO])
  async ratings(@Args('uuid', { type: () => ID }) uuid: string): Promise<RatingDTO[]> {
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
  async rateTextDifficulty(
    @GQLToken() token: Token,
    @Args('text', { type: () => ID }) text: string,
    @Args('difficulty', { type: () => Int }) difficulty: number
  ): Promise<boolean> {
    return await this.ratingService.rateTextDifficulty(text, token.data.uuid, difficulty);
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

  @Mutation(() => Boolean)
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async rateImage(
    @GQLToken() token: Token,
    @Args('image', { type: () => ID }) image: string,
    @Args('rating', { type: () => Int }) rating: number
  ): Promise<boolean> {
    return await this.ratingService.rateImage(image, token.data.uuid, rating);
  }
}

export { RatingResolver };
