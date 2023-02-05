import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface CreateWikitResult {
  data: { wikit: string };
  errors?: { message: string }[];
}

interface CreateWikitArgs {
  token: string;
  title: string;
  text: string;
  text_difficulty: number;
  parents: string[];
  children: string[];
}

interface CreateWikitError {
  errors: { message: string }[];
}

const CreateWikitRequest: RequestFactory<CreateWikitResult, CreateWikitArgs, CreateWikitError> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${args.token}`
    },
    body: JSON.stringify({
      query: `
        mutation($title: String!, $text: String!, $text_difficulty: Int!, $parents: [ID!]!, $children: [ID!]!) {
          wikit: createWikit(title: $title, text: $text, text_difficulty: $text_difficulty, parents: $parents, children: $children)
        }
      `,
      variables: args
    })
  }
});

export { CreateWikitRequest };
