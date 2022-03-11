import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';
import { id } from '../utils';

interface AddTextAndRelationsResult {
  data: {};
  errors?: { message: string }[];
}

interface AddTextAndRelationsArgs {
  token: string;
  wikit: string;
  text: string;
  parents: string[];
  children: string[];
}

interface AddTextAndRelationsError {
  errors: { message: string }[];
}

function buildQuery(args: AddTextAndRelationsArgs): string {
  return `
    mutation${args.text.length >= 10 ? '($text: String!)' : ''} {
      ${args.text.length >= 10 ? `createText(wikit: "${args.wikit}", text: $text)` : ''}
      ${args.parents.map(parent => `${id()}: createRelation(parent: "${parent}", child: "${args.wikit}")`).join('\n')}
      ${args.children.map(child => `${id()}: createRelation(parent: "${args.wikit}", child: "${child}")`).join('\n')}
    }
  `;
}

const AddTextAndRelationsRequest: RequestFactory<
  AddTextAndRelationsResult,
  AddTextAndRelationsArgs,
  AddTextAndRelationsError
> = args => ({
  url: `//${Service.DATA}.${DOMAIN}/graphql`,
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${args.token}`
    },
    body: JSON.stringify({
      query: buildQuery(args),
      variables: { text: args.text }
    })
  }
});

export { AddTextAndRelationsRequest };
