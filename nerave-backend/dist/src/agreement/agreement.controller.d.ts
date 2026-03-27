import { AgreementsService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
export declare class AgreementsController {
    private agreementsService;
    constructor(agreementsService: AgreementsService);
    create(dto: CreateAgreementDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    confirmMilestone(agreementId: string, milestoneId: string, req: any): Promise<{
        message: string;
        clientConfirmed: boolean;
        contractorConfirmed: boolean;
        fullyApproved: boolean;
    }>;
}
