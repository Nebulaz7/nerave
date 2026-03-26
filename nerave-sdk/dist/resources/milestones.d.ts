import { HttpClient } from '../http';
import { ConfirmMilestoneInput, ConfirmMilestoneResponse } from '../types';
export declare class MilestonesResource {
    private http;
    constructor(http: HttpClient);
    confirm(input: ConfirmMilestoneInput): Promise<ConfirmMilestoneResponse>;
}
//# sourceMappingURL=milestones.d.ts.map