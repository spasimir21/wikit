import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface RateImageResult {
  data: { success: boolean };
  errors?: { message: string }[];
}

interface RateImageArgs {
  token: string;
  object: string;
  rating: number;
}

interface RateImageError {
  errors: { message: string }[];
}

const RateImageRequest: RequestFactory<RateImageResult, RateImageArgs, RateImageError> = args => ({
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
          success: rateImage(image: $object, rating: $rating)
        }
      `,
      variables: args
    })
  }
});

export { RateImageRequest };
