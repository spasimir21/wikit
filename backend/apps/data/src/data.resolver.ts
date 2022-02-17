import { GQLTokenGuard, GQLLoggedInGuard, GQLToken, Token } from '@wikit/utils';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DataService } from './data.service';
import { UseGuards } from '@nestjs/common';

@Resolver()
class DataResolver {
  constructor(private readonly dataService: DataService) {}

  @Query(() => String)
  helloWorld(): string {
    return 'Hello, world!';
  }

  @Mutation(() => String)
  @UseGuards(GQLTokenGuard, GQLLoggedInGuard)
  async createWikit(@GQLToken() token: Token, @Args('title') title: string, @Args('text') text: string): Promise<string> {
    return await this.dataService.createWikit(token.data.uuid, title, text);
  }
}

export { DataResolver };
