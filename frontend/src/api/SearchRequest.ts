import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface SearchResult {
  data: {
    search?: {
      wikit: string;
      text: string;
      sub: {
        wikit: string;
        text: string;
        relation: string;
        sub: {
          wikit: string;
          text: string;
          relation: string;
        }[];
      }[];
    };
  };
  errors?: { message: string }[];
}

interface SearchArgs {
  query: string;
}

interface SearchError {
  errors: { message: string }[];
}

const SearchRequest: RequestFactory<SearchResult, SearchArgs, SearchError> = args => ({
  url: `//${Service.SEARCH}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query($query: String!) {
          search(query: $query) {
            wikit
            text
            sub {
              wikit
              text
              relation
              sub {
                wikit
                text
                relation
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
