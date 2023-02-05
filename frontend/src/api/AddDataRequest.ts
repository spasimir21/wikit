import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';
import { id } from '../utils';

interface AddDataResult {
  data: { text?: string; image?: string } & Record<`${'child' | 'parent'}_relation_${string}`, string>;
  errors?: { message: string }[];
}

interface AddDataArgs {
  token: string;
  wikit: string;
  text?: {
    text: string;
    difficulty: number;
  };
  relations: {
    parents: string[];
    children: string[];
  };
  image?: {
    hash: string;
    description: string;
  };
}

interface AddDataError {
  errors: { message: string }[];
}

function buildQuery(args: AddDataArgs): string {
  const query_args = [
    '$wikit: ID!',
    args.text ? '$text: String!' : null,
    args.image ? '$image_description: String!' : null
  ].filter(arg => arg != null) as string[];

  return `
    mutation (${query_args.join(', ')}) {
      ${args.text ? `text: createText(wikit: $wikit, text: $text, difficulty: ${args.text.difficulty})` : ''}
      ${args.image ? `image: createImage(wikit: $wikit, description: $image_description, hash: "${args.image.hash}")` : ''}
      ${args.relations.children
        .map(child => `child_relation${id()}: createRelation(parent: $wikit, child: "${child}")`)
        .join('\n')}
      ${args.relations.parents
        .map(parent => `parent_relation${id()}: createRelation(parent: "${parent}", child: $wikit)`)
        .join('\n')}
    }
  `;
}

const AddDataRequest: RequestFactory<AddDataResult, AddDataArgs, AddDataError> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${args.token}`
    },
    body: JSON.stringify({
      query: buildQuery(args),
      variables: {
        wikit: args.wikit,
        text: args.text?.text,
        image_description: args.image?.description
      }
    })
  }
});

export { AddDataRequest, AddDataArgs };
