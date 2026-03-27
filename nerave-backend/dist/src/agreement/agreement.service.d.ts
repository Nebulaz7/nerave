import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { User } from '@prisma/client';
export declare class AgreementsService implements OnModuleInit {
    private prisma;
    private blockchain;
    private readonly logger;
    constructor(prisma: PrismaService, blockchain: BlockchainService);
    onModuleInit(): Promise<void>;
    private reattachAllListeners;
    create(dto: CreateAgreementDto, client: User): Promise<{
        milestones: {
            title: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            clientConfirmed: boolean;
            contractorConfirmed: boolean;
            disbursed: boolean;
            id: string;
            createdAt: Date;
            agreementId: string;
        }[];
    } & {
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        contractAddress: string | null;
        status: import("@prisma/client").$Enums.AgreementStatus;
        createdAt: Date;
        contractorId: string;
        clientId: string;
    }>;
    findOne(id: string, user: User): Promise<{
        client: {
            id: string;
            email: string;
            businessName: string;
        };
        contractor: {
            id: string;
            email: string;
            businessName: string;
        };
        transactions: {
            milestoneId: string | null;
            type: import("@prisma/client").$Enums.TransactionType;
            id: string;
            status: import("@prisma/client").$Enums.TransactionStatus;
            createdAt: Date;
            interswitchRef: string | null;
            agreementId: string;
        }[];
        milestones: {
            title: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            clientConfirmed: boolean;
            contractorConfirmed: boolean;
            disbursed: boolean;
            id: string;
            createdAt: Date;
            agreementId: string;
        }[];
    } & {
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        contractAddress: string | null;
        status: import("@prisma/client").$Enums.AgreementStatus;
        createdAt: Date;
        contractorId: string;
        clientId: string;
    }>;
    confirmMilestone(agreementId: string, milestoneId: string, user: User): Promise<{
        message: string;
        clientConfirmed: boolean;
        contractorConfirmed: boolean;
        fullyApproved: boolean;
    }>;
    findAll(user: User): Promise<({
        milestones: {
            title: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            clientConfirmed: boolean;
            contractorConfirmed: boolean;
            disbursed: boolean;
            id: string;
            createdAt: Date;
            agreementId: string;
        }[];
    } & {
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        contractAddress: string | null;
        status: import("@prisma/client").$Enums.AgreementStatus;
        createdAt: Date;
        contractorId: string;
        clientId: string;
    })[]>;
}
