import { 
  NeraveConfig, 
  CreateAgreementParams, 
  ConfirmMilestoneParams, 
  AgreementState, 
  AgreementResponse 
} from './types';

export class Nerave {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: NeraveConfig) {
    if (!config.apiKey) {
      throw new Error("Nerave API key is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.nerave.com/v1'; // Default prod URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Nerave API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  public agreements = {
    /**
     * Creates a new trustless agreement and deploys its corresponding smart contract.
     */
    create: async (params: CreateAgreementParams): Promise<AgreementResponse> => {
      return this.request<AgreementResponse>('/agreements', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    /**
     * Gets the current state of an agreement and its milestones.
     */
    getStatus: async (agreementId: string): Promise<AgreementState> => {
      return this.request<AgreementState>(`/agreements/${agreementId}`, {
        method: 'GET',
      });
    }
  };

  public milestones = {
    /**
     * Confirms a milestone is completed. Requires confirmation from both parties to disburse.
     */
    confirm: async (params: ConfirmMilestoneParams): Promise<AgreementResponse> => {
      return this.request<AgreementResponse>(
        `/agreements/${params.agreementId}/milestones/${params.milestoneId}/confirm`, 
        {
          method: 'POST',
          body: JSON.stringify({ role: params.role }),
        }
      );
    }
  };
}

export * from './types';
