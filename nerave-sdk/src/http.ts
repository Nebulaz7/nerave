import axios, { AxiosInstance, AxiosError } from 'axios';
import { NeraveError } from './types';

interface HttpClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl || 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
      },
      timeout: 30000,
    });

    // Response interceptor — normalize errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<NeraveError>) => {
        const status = error.response?.status ?? 500;
        const message =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred';

        const neraveError = new Error(message) as Error & {
          statusCode: number;
          raw: unknown;
        };
        neraveError.statusCode = status;
        neraveError.raw = error.response?.data;

        return Promise.reject(neraveError);
      },
    );
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.client.get<T>(path);
    return response.data;
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await this.client.post<T>(path, body);
    return response.data;
  }
}