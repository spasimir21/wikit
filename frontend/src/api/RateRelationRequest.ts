import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface RateRelationResult {
  data: { success: boolean };
  errors?: { message: string }[];
}

interface RateRelationArgs {
  token: string;
  object: string;
  rating: number;
}

interface RateRelationError {
  errors: { message: string }[];
}

const RateRelationRequest: RequestFactory<RateRelationResult, RateRelationArgs, RateRelationError> = args => ({
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
          success: rateRelation(relation: $object, rating: $rating)
        }
      `,
      variables: args
    })
  }
});

export { RateRelationRequest };
