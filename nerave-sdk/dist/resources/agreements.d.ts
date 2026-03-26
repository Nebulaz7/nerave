import { HttpClient } from '../http';
import { Agreement, CreateAgreementInput } from '../types';
export declare class AgreementsResource {
    private http;
    constructor(http: HttpClient);
    create(input: CreateAgreementInput): Promise<Agreement>;
    get(agreementId: string): Promise<Agreement>;
    list(): Promise<Agreement[]>;
}
//# sourceMappingURL=agreements.d.ts.map