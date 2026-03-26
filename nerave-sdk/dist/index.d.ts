import { NeraveConfig, CreateAgreementParams, ConfirmMilestoneParams, AgreementState, AgreementResponse } from './types';
export declare class Nerave {
    private apiKey;
    private baseUrl;
    constructor(config: NeraveConfig);
    private request;
    agreements: {
        /**
         * Creates a new trustless agreement and deploys its corresponding smart contract.
         */
        create: (params: CreateAgreementParams) => Promise<AgreementResponse>;
        /**
         * Gets the current state of an agreement and its milestones.
         */
        getStatus: (agreementId: string) => Promise<AgreementState>;
    };
    milestones: {
        /**
         * Confirms a milestone is completed. Requires confirmation from both parties to disburse.
         */
        confirm: (params: ConfirmMilestoneParams) => Promise<AgreementResponse>;
    };
}
export * from './types';
