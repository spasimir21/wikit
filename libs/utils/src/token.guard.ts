import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Config, CONFIG } from '@wikit/config';
import * as jsonwebtoken from 'jsonwebtoken';

function verifyToken(context: ExecutionContext, secret: string, ignoreExpiration: boolean): boolean {
  const authorization: string = context.switchToHttp().getRequest().header('Authorization');
  if (authorization == null) return false;

  const token: string = authorization.split(' ')[1];
  if (token == null) return false;

  try {
    const data = jsonwebtoken.verify(token, secret, { ignoreExpiration });
    context.switchToHttp().getResponse().locals.token = { raw: token, data };
  } catch (error) {
    return false;
  }

  return true;
}

@Injectable()
class TokenGuard implements CanActivate {
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  canActivate(context: ExecutionContext): boolean {
    return verifyToken(context, this.config.token.secret, false);
  }
}

@Injectable()
class IgnoreExpiredTokenGuard implements CanActivate {
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  canActivate(context: ExecutionContext): boolean {
    return verifyToken(context, this.config.token.secret, true);
  }
}

export { TokenGuard, IgnoreExpiredTokenGuard };
