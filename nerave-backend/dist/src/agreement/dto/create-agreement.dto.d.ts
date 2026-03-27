export declare class CreateMilestoneDto {
    title: string;
    amount: number;
}
export declare class CreateAgreementDto {
    contractorId: string;
    totalAmount: number;
    milestones: CreateMilestoneDto[];
}
