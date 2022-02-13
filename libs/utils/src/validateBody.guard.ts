import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
class ValidateBodyGuard implements CanActivate {
  constructor(private readonly validateFunction: (body: any) => boolean) {}

  canActivate(context: ExecutionContext): boolean {
    return this.validateFunction(context.switchToHttp().getRequest().body);
  }
}

export { ValidateBodyGuard };
