"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AgreementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const viem_1 = require("viem");
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
let AgreementsService = AgreementsService_1 = class AgreementsService {
    prisma;
    blockchain;
    logger = new common_1.Logger(AgreementsService_1.name);
    constructor(prisma, blockchain) {
        this.prisma = prisma;
        this.blockchain = blockchain;
    }
    async onModuleInit() {
        await this.reattachAllListeners();
    }
    async reattachAllListeners() {
        const activeAgreements = await this.prisma.agreement.findMany({
            where: {
                contractAddress: { not: null },
                status: { notIn: [client_2.AgreementStatus.COMPLETED, client_2.AgreementStatus.CANCELLED] },
            },
        });
        this.logger.log(`Reattaching listeners for ${activeAgreements.length} active agreements`);
        for (const agreement of activeAgreements) {
            const contractAddress = agreement.contractAddress;
            if (!contractAddress ||
                contractAddress.toLowerCase() === ZERO_ADDRESS) {
                continue;
            }
            this.blockchain.listenToEvents(contractAddress, async (milestoneId, amount) => {
                this.logger.log(`MilestoneApproved — agreement: ${agreement.id}, milestone: ${milestoneId}`);
            });
        }
    }
    async create(dto, client) {
        if (client.role !== client_1.Role.CLIENT) {
            throw new common_1.ForbiddenException('Only clients can create agreements');
        }
        const contractor = await this.prisma.user.findUnique({
            where: { id: dto.contractorId },
        });
        if (!contractor)
            throw new common_1.NotFoundException('Contractor not found');
        if (contractor.role !== client_1.Role.CONTRACTOR) {
            throw new common_1.BadRequestException('Specified user is not a contractor');
        }
        const milestoneSum = dto.milestones.reduce((sum, m) => sum + m.amount, 0);
        if (milestoneSum !== dto.totalAmount) {
            throw new common_1.BadRequestException(`Milestone amounts (${milestoneSum}) must equal totalAmount (${dto.totalAmount})`);
        }
        const agreement = await this.prisma.agreement.create({
            data: {
                clientId: client.id,
                contractorId: dto.contractorId,
                totalAmount: dto.totalAmount,
                milestones: {
                    create: dto.milestones.map((m) => ({
                        title: m.title,
                        amount: m.amount,
                    })),
                },
            },
            include: { milestones: true },
        });
        try {
            if (!(0, viem_1.isAddress)(client.id) || !(0, viem_1.isAddress)(contractor.id)) {
                this.logger.warn(`Skipping contract deployment for agreement ${agreement.id}: client/contractor IDs are not EVM addresses`);
                return agreement;
            }
            const contractAddress = await this.blockchain.deployAgreement(client.id, contractor.id, BigInt(dto.totalAmount));
            const updated = await this.prisma.agreement.update({
                where: { id: agreement.id },
                data: { contractAddress },
                include: { milestones: true },
            });
            this.blockchain.listenToEvents(contractAddress, async (milestoneId, amount) => {
                this.logger.log(`MilestoneApproved fired — milestoneId: ${milestoneId}, amount: ${amount}`);
            });
            return updated;
        }
        catch (err) {
            this.logger.error('Contract deployment failed', err);
            return agreement;
        }
    }
    async findOne(id, user) {
        const agreement = await this.prisma.agreement.findUnique({
            where: { id },
            include: {
                milestones: true,
                client: { select: { id: true, email: true, businessName: true } },
                contractor: { select: { id: true, email: true, businessName: true } },
                transactions: true,
            },
        });
        if (!agreement)
            throw new common_1.NotFoundException('Agreement not found');
        if (agreement.clientId !== user.id && agreement.contractorId !== user.id) {
            throw new common_1.ForbiddenException('You are not part of this agreement');
        }
        return agreement;
    }
    async confirmMilestone(agreementId, milestoneId, user) {
        const agreement = await this.prisma.agreement.findUnique({
            where: { id: agreementId },
            include: { milestones: true },
        });
        if (!agreement)
            throw new common_1.NotFoundException('Agreement not found');
        const isClient = agreement.clientId === user.id;
        const isContractor = agreement.contractorId === user.id;
        if (!isClient && !isContractor) {
            throw new common_1.ForbiddenException('You are not part of this agreement');
        }
        const milestone = agreement.milestones.find((m) => m.id === milestoneId);
        if (!milestone)
            throw new common_1.NotFoundException('Milestone not found');
        if (milestone.disbursed) {
            throw new common_1.BadRequestException('Milestone already disbursed');
        }
        if (isClient && milestone.clientConfirmed) {
            throw new common_1.BadRequestException('You have already confirmed this milestone');
        }
        if (isContractor && milestone.contractorConfirmed) {
            throw new common_1.BadRequestException('You have already confirmed this milestone');
        }
        const updated = await this.prisma.milestone.update({
            where: { id: milestoneId },
            data: {
                clientConfirmed: isClient ? true : milestone.clientConfirmed,
                contractorConfirmed: isContractor ? true : milestone.contractorConfirmed,
            },
        });
        if (agreement.contractAddress) {
            const milestoneIndex = agreement.milestones.findIndex((m) => m.id === milestoneId);
            await this.blockchain.confirmMilestone(agreement.contractAddress, milestoneIndex, isClient ? 'CLIENT' : 'CONTRACTOR');
        }
        return {
            message: 'Milestone confirmed',
            clientConfirmed: updated.clientConfirmed,
            contractorConfirmed: updated.contractorConfirmed,
            fullyApproved: updated.clientConfirmed && updated.contractorConfirmed,
        };
    }
    async findAll(user) {
        return this.prisma.agreement.findMany({
            where: {
                OR: [{ clientId: user.id }, { contractorId: user.id }],
            },
            include: { milestones: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AgreementsService = AgreementsService;
exports.AgreementsService = AgreementsService = AgreementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        blockchain_service_1.BlockchainService])
], AgreementsService);
//# sourceMappingURL=agreement.service.js.map