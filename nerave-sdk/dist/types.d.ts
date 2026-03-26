export interface NeraveConfig {
    apiKey: string;
    baseUrl?: string;
}
export interface CreateAgreementParams {
    contractorId: string;
    totalAmount: number;
    milestones: {
        title: string;
        amount: number;
    }[];
}
export interface ConfirmMilestoneParams {
    agreementId: string;
    milestoneId: number;
    role: 'CLIENT' | 'CONTRACTOR';
}
export interface Milestone {
    id: number;
    title: string;
    amount: number;
    clientConfirmed: boolean;
    contractorConfirmed: boolean;
    disbursed: boolean;
}
export interface AgreementState {
    id: string;
    contractAddress: string;
    clientId: string;
    contractorId: string;
    totalAmount: number;
    status: string;
    milestones: Milestone[];
}
export interface AgreementResponse {
    success: boolean;
    data?: any;
    error?: string;
}
