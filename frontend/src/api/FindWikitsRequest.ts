import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface FindWikitsResult {
  data: { wikits: { uuid: string; textCount: number; averageRating: number }[] };
  errors?: { message: string }[];
}

interface FindWikitsArgs {
  title: string;
}

interface FindWikitsError {
  errors: { message: string }[];
}

const FindWikitsRequest: RequestFactory<FindWikitsResult, FindWikitsArgs, FindWikitsError> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query($title: String!) {
          wikits: findWikits(title: $title) {
            uuid
            textCount
            averageRating
          }
        }
      `,
      variables: args
    })
  }
});

export { FindWikitsRequest };
