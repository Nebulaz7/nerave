"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let WebhooksController = WebhooksController_1 = class WebhooksController {
    prisma;
    config;
    logger = new common_1.Logger(WebhooksController_1.name);
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async handleInterswitchWebhook(req, res, signature) {
        res.status(200).json({ received: true });
        try {
            const secretKey = this.config.get('INTERSWITCH_SECRET_KEY') || '';
            const rawBody = JSON.stringify(req.body);
            const expectedSignature = crypto
                .createHmac('sha512', secretKey)
                .update(rawBody)
                .digest('hex');
            if (signature !== expectedSignature) {
                this.logger.warn('Invalid Interswitch webhook signature — ignoring');
                return;
            }
            const event = req.body;
            this.logger.log(`Webhook received: ${event.eventType}`);
            if (event.eventType === 'TRANSACTION.COMPLETED') {
                const transactionRef = event.data?.transactionReference;
                if (!transactionRef)
                    return;
                const transaction = await this.prisma.transaction.findFirst({
                    where: { interswitchRef: transactionRef },
                });
                if (!transaction) {
                    this.logger.warn(`No transaction found for ref: ${transactionRef}`);
                    return;
                }
                if (transaction.status === client_1.TransactionStatus.SUCCESS) {
                    this.logger.warn(`Transaction ${transactionRef} already processed — skipping`);
                    return;
                }
                await this.prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: client_1.TransactionStatus.SUCCESS },
                });
                await this.prisma.agreement.update({
                    where: { id: transaction.agreementId },
                    data: { status: client_1.AgreementStatus.FUNDED },
                });
                this.logger.log(`Agreement ${transaction.agreementId} marked as FUNDED`);
            }
        }
        catch (err) {
            this.logger.error('Webhook processing error', err);
        }
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('interswitch'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('x-interswitch-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleInterswitchWebhook", null);
exports.WebhooksController = WebhooksController = WebhooksController_1 = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map