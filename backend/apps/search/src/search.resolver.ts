import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { TextDTO } from './model/text.model';

@Resolver(() => TextDTO)
class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => TextDTO, { nullable: true })
  async search(@Args('query') query: string): Promise<TextDTO | null> {
    return await this.searchService.searchRootText(query);
  }

  @ResolveField()
  async sub(@Parent() text: TextDTO): Promise<TextDTO[]> {
    return await this.searchService.searchSubTexts(text.wikit, text.query);
  }
}

export { SearchResolver };
