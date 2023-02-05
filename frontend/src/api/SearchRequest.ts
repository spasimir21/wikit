import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface SearchResult {
  data: {
    search?: {
      wikit: string;
      text: string;
      image?: string;
      sub: {
        wikit: string;
        text: string;
        relation: string;
        image?: string;
        sub: {
          wikit: string;
          text: string;
          relation: string;
          image?: string;
        }[];
      }[];
    };
  };
  errors?: { message: string }[];
}

interface SearchArgs {
  root?: string;
  query: string;
  target_text_difficulty: number;
}

interface SearchError {
  errors: { message: string }[];
}

// prettier-ignore
const SearchRequest: RequestFactory<SearchResult, SearchArgs, SearchError> = args => ({
  url: `//${Service.SEARCH}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query(${args.root ? '$root: String!, ' : ''}$query: String!, $target_text_difficulty: Float!) {
          search: search${args.root ? 'ForWikit' : ''}(${args.root ? 'wikit: $root, ' : ''}query: $query, target_text_difficulty: $target_text_difficulty) {
            wikit
            text
            image
            sub {
              wikit
              text
              relation
              image
              sub {
                wikit
                text
                relation
                image
              }
            }
          }
        }
      `,
      variables: args
    })
  }
});

export { SearchRequest, SearchResult };
