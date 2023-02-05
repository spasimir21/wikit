import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TextService } from './text.service';
import { TextDTO } from './model/text.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
class TextResolver {
  constructor(private readonly textService: TextService) {}

  @Query(() => TextDTO, { nullable: true })
  async text(@Args('uuid', { type: () => ID }) uuid: string): Promise<TextDTO | null> {
    return await this.textService.getText(uuid);
  }

  @Query(() => [TextDTO])
  async texts(@Args('uuids', { type: () => [ID] }) uuids: string[]): Promise<TextDTO[]> {
    return await this.textService.getTexts(uuids);
  }

  @Mutation(() => ID, { nullable: true })
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async createText(
    @GQLToken() token: Token,
    @Args('wikit', { type: () => ID }) wikit: string,
    @Args('text') text: string,
    @Args('difficulty', { type: () => Int }) difficulty: number
  ): Promise<string | null> {
    return await this.textService.createText(token.data.uuid, wikit, text, difficulty);
  }
}

export { TextResolver };
