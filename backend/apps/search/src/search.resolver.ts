import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { TextDTO } from './model/text.model';
import * as DataLoader from 'dataloader';

@Resolver(() => TextDTO)
class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => TextDTO, { nullable: true })
  async search(
    @Args('query') query: string,
    @Args('target_text_difficulty') target_text_difficulty: number
  ): Promise<TextDTO | null> {
    return await this.searchService.searchRootText(query, target_text_difficulty);
  }

  @Query(() => TextDTO, { nullable: true })
  async searchForWikit(
    @Args('wikit') wikit: string,
    @Args('query') query: string,
    @Args('target_text_difficulty') target_text_difficulty: number
  ): Promise<TextDTO | null> {
    return await this.searchService.searchTextForWikit(wikit, query, target_text_difficulty);
  }

  @ResolveField(() => String, { nullable: true })
  async image(
    @Parent() text: TextDTO,
    @Context('imageLoader') imageLoader: DataLoader<string, string | null>
  ): Promise<string | null> {
    return await imageLoader.load(`${text.wikit}:${text.query}`);
  }

  @ResolveField(() => [TextDTO])
  async sub(@Parent() text: TextDTO): Promise<TextDTO[]> {
    return await this.searchService.searchSubTexts(text.wikit, text.query, text.target_text_difficulty);
  }
}

export { SearchResolver };
