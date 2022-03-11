import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface GetWikitsAndTextsResult {
  data: {
    wikits: { uuid: string; title: string }[];
    texts: { uuid: string; text: string }[];
  };
  errors?: { message: string }[];
}

interface GetWikitsAndTextsArgs {
  wikits: string[];
  texts: string[];
}

interface GetWikitsAndTextsError {
  errors: { message: string }[];
}

const GetWikitsAndTextsRequest: RequestFactory<
  GetWikitsAndTextsResult,
  GetWikitsAndTextsArgs,
  GetWikitsAndTextsError
> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query($wikits: [ID!]!, $texts: [ID!]!) {
          wikits(uuids: $wikits) {
            uuid
            title
          }
          texts(uuids: $texts) {
            uuid
            text
          }
        }
      `,
      variables: args
    })
  }
});

export { GetWikitsAndTextsRequest };
