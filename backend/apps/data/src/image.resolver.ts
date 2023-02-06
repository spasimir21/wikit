import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { ImageDTO } from './model/image.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Query(() => ImageDTO, { nullable: true })
  async image(@Args('uuid', { type: () => ID }) uuid: string): Promise<ImageDTO | null> {
    return await this.imageService.getImage(uuid);
  }

  @Query(() => [ImageDTO])
  async images(@Args('uuids', { type: () => [ID] }) uuids: string[]): Promise<ImageDTO[]> {
    return await this.imageService.getImages(uuids);
  }

  @Mutation(() => ID, { nullable: true })
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async createImage(
    @GQLToken() token: Token,
    @Args('wikit', { type: () => ID }) wikit: string,
    @Args('description') description: string,
    @Args('hash') hash: string
  ): Promise<string | null> {
    return await this.imageService.createImage(token.data.uuid, wikit, description, hash);
  }
}

export { ImageResolver };
