import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return !!context.switchToHttp().getResponse().locals.token;
  }
}

export { LoggedInGuard };
