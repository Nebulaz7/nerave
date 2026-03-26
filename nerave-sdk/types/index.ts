export interface NeraveConfig {
  apiKey: string;
  baseUrl?: string;
}

// ---- Users ----
export interface User {
  id: string;
  email: string;
  businessName: string;
}

// ---- Milestones ----
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

// ---- Agreements ----
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

export type AgreementStatus =
  | 'PENDING_PAYMENT'
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CreateAgreementInput {
  contractorId: string;
  totalAmount: number;
  milestones: CreateMilestoneInput[];
}

// ---- Payments ----
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

// ---- Milestone confirm ----
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

// ---- API Error ----
export interface NeraveError {
  statusCode: number;
  message: string;
  error?: string;
}