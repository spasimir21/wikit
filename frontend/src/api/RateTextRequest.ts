import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface RateTextResult {
  data: { success: boolean };
  errors?: { message: string }[];
}

interface RateTextArgs {
  token: string;
  object: string;
  rating: number;
}

interface RateTextError {
  errors: { message: string }[];
}

const RateTextRequest: RequestFactory<RateTextResult, RateTextArgs, RateTextError> = args => ({
  url: `//${Service.RATING}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${args.token}`
    },
    body: JSON.stringify({
      query: `
        mutation($object: ID!, $rating: Int!) {
          success: rateText(text: $object, rating: $rating)
        }
      `,
      variables: args
    })
  }
});

export { RateTextRequest };
