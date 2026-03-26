import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { ApiKeyGuard } from './api-key.guard';

@Injectable()
export class CombinedGuard implements CanActivate {
  constructor(
    private jwtGuard: JwtGuard,
    private apiKeyGuard: ApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // If x-api-key header present → use API key guard
    if (request.headers['x-api-key']) {
      return this.apiKeyGuard.canActivate(context);
    }

    // Otherwise → use JWT guard
    return this.jwtGuard.canActivate(context) as Promise<boolean>;
  }
}