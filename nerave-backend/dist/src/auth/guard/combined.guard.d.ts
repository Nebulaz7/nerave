import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { ApiKeyGuard } from './api-key.guard';
export declare class CombinedGuard implements CanActivate {
    private jwtGuard;
    private apiKeyGuard;
    constructor(jwtGuard: JwtGuard, apiKeyGuard: ApiKeyGuard);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
