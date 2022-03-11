import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface GetWikitResult {
  data: { wikit?: { title: string } };
  errors?: { message: string }[];
}

interface GetWikitArgs {
  wikit: string;
}

interface GetWikitError {
  errors: { message: string }[];
}

const GetWikitRequest: RequestFactory<GetWikitResult, GetWikitArgs, GetWikitError> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query($wikit: ID!) {
          wikit(uuid: $wikit) { title }
        }
      `,
      variables: args
    })
  }
});

export { GetWikitRequest };
