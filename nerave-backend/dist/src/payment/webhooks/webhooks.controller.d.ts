import type { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class WebhooksController {
    private prisma;
    private config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    handleInterswitchWebhook(req: Request, res: Response, signature: string): Promise<void>;
}
