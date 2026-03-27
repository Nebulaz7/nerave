import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class BlockchainService implements OnModuleInit {
    private configService;
    private readonly logger;
    private publicClient;
    private walletClient;
    private account;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    deployAgreement(clientAddr: string, contractorAddr: string, totalAmount: bigint): Promise<string>;
    getAgreementState(contractAddress: string): Promise<{
        agreement: {
            client: `0x${string}`;
            contractor: `0x${string}`;
            totalAmount: bigint;
        };
        milestones: readonly {
            title: string;
            amount: bigint;
            clientConfirmed: boolean;
            contractorConfirmed: boolean;
            disbursed: boolean;
        }[];
    }>;
    confirmMilestone(contractAddress: string, milestoneIndex: number, by: 'CLIENT' | 'CONTRACTOR'): Promise<void>;
    listenToEvents(contractAddress: string, onMilestoneApproved?: (milestoneId: string, amount: string) => Promise<void> | void): Promise<void>;
    private handleAutoDisbursement;
}
