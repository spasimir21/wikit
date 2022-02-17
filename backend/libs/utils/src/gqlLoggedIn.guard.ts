import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
class GQLLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return !!GqlExecutionContext.create(context).getContext().token;
  }
}

export { GQLLoggedInGuard };
