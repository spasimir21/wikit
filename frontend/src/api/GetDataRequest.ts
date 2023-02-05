import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface GetDataResult {
  data: {
    wikits: { uuid: string; title: string }[];
    texts: { uuid: string; wikit_title: string; text: string; difficulty: number }[];
    images: { uuid: string; wikit_title: string; description: string; hash: string }[];
    relations: { uuid: string; parent: string; child: string }[];
  };
  errors?: { message: string }[];
}

interface GetDataArgs {
  wikits?: string[];
  texts?: string[];
  images?: string[];
  relations?: string[];
}

interface GetDataError {
  errors: { message: string }[];
}

const GetDataRequest: RequestFactory<GetDataResult, GetDataArgs, GetDataError> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query(${Object.keys(args)
          .filter(key => (args as any)[key].length > 0)
          .map(key => `$${key}: [ID!]!`)
          .join(', ')}) {
          ${
            args.wikits && args.wikits.length > 0
              ? `wikits(uuids: $wikits) {
                  uuid
                  title
                }`
              : ''
          }
          ${
            args.texts && args.texts.length > 0
              ? `texts(uuids: $texts) {
                  uuid
                  wikit_title
                  text
                  difficulty
                }`
              : ''
          }
          ${
            args.images && args.images.length > 0
              ? `images(uuids: $images) {
                  uuid
                  wikit_title
                  description
                  hash
                }`
              : ''
          }
          ${
            args.relations && args.relations.length > 0
              ? `relations(uuids: $relations) {
                  uuid
                  parent
                  child
                }`
              : ''
          }
        }
      `,
      variables: args
    })
  }
});

export { GetDataRequest };
