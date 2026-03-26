import { AgreementsResource } from './resources/agreements';
import { MilestonesResource } from './resources/milestones';
import { PaymentsResource } from './resources/payments';
import { NeraveConfig } from './types';
export declare class Nerave {
    readonly agreements: AgreementsResource;
    readonly milestones: MilestonesResource;
    readonly payments: PaymentsResource;
    constructor(config: NeraveConfig);
}
//# sourceMappingURL=nerave.d.ts.map