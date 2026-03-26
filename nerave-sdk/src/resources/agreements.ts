import { HttpClient } from '../http';
import {
  Agreement,
  CreateAgreementInput,
} from '../types';

export class AgreementsResource {
  constructor(private http: HttpClient) {}

  async create(input: CreateAgreementInput): Promise<Agreement> {
    return this.http.post<Agreement>('/agreements', input);
  }

  async get(agreementId: string): Promise<Agreement> {
    return this.http.get<Agreement>(`/agreements/${agreementId}`);
  }

  async list(): Promise<Agreement[]> {
    return this.http.get<Agreement[]>('/agreements');
  }
}