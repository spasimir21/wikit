import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

interface Token {
  raw: string;
  data: any;
}

const Token = createParamDecorator((_data: any, ctx: ExecutionContext) => ctx.switchToHttp().getResponse().locals.token);

const GQLToken = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().token
);

export { Token, GQLToken };
