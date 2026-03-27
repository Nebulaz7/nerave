export interface NeraveConfig {
    apiKey?: string;
    apiKeyEnvVar?: string;
    envFilePath?: string;
    loadEnvFile?: boolean;
    baseUrl?: string;
}
export interface User {
    id: string;
    email: string;
    businessName: string;
}
export interface Milestone {
    id: string;
    agreementId: string;
    title: string;
    amount: number;
    clientConfirmed: boolean;
    contractorConfirmed: boolean;
    disbursed: boolean;
    createdAt: string;
}
export interface CreateMilestoneInput {
    title: string;
    amount: number;
}
export interface Agreement {
    id: string;
    contractAddress: string | null;
    clientId: string;
    contractorId: string;
    totalAmount: string;
    status: AgreementStatus;
    createdAt: string;
    milestones: Milestone[];
    client?: Pick<User, 'id' | 'email' | 'businessName'>;
    contractor?: Pick<User, 'id' | 'email' | 'businessName'>;
}
export type AgreementStatus = 'PENDING_PAYMENT' | 'FUNDED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export interface CreateAgreementInput {
    contractorId: string;
    totalAmount: number;
    milestones: CreateMilestoneInput[];
}
export interface InitiatePaymentResponse {
    paymentUrl: string;
    transactionReference: string;
    note?: string;
}
export interface VerifyPaymentResponse {
    success: boolean;
    responseCode: string;
    transactionReference: string;
}
export interface ConfirmMilestoneInput {
    agreementId: string;
    milestoneId: string;
}
export interface ConfirmMilestoneResponse {
    message: string;
    clientConfirmed: boolean;
    contractorConfirmed: boolean;
    fullyApproved: boolean;
}
export interface NeraveError {
    statusCode: number;
    message: string;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map