import { HttpClient } from '../http';
import {
  ConfirmMilestoneInput,
  ConfirmMilestoneResponse,
} from '../types';

export class MilestonesResource {
  constructor(private http: HttpClient) {}

  async confirm(input: ConfirmMilestoneInput): Promise<ConfirmMilestoneResponse> {
    return this.http.post<ConfirmMilestoneResponse>(
      `/agreements/${input.agreementId}/milestones/${input.milestoneId}/confirm`,
    );
  }
}