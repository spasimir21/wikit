import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface RateTextDifficultyResult {
  data: { success: boolean };
  errors?: { message: string }[];
}

interface RateTextDifficultyArgs {
  token: string;
  text: string;
  difficulty: number;
}

interface RateTextDifficultyError {
  errors: { message: string }[];
}

const RateTextDifficultyRequest: RequestFactory<
  RateTextDifficultyResult,
  RateTextDifficultyArgs,
  RateTextDifficultyError
> = args => ({
  url: `//${Service.RATING}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${args.token}`
    },
    body: JSON.stringify({
      query: `
        mutation($text: ID!, $difficulty: Int!) {
          success: rateTextDifficulty(text: $text, difficulty: $difficulty)
        }
      `,
      variables: { text: args.text, difficulty: args.difficulty }
    })
  }
});

export { RateTextDifficultyRequest };
