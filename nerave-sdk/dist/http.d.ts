interface HttpClientConfig {
    apiKey: string;
    baseUrl?: string;
}
export declare class HttpClient {
    private client;
    constructor(config: HttpClientConfig);
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
}
export {};
//# sourceMappingURL=http.d.ts.map