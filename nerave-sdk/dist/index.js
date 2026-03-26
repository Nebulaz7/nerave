"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nerave = void 0;
class Nerave {
    apiKey;
    baseUrl;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error("Nerave API key is required");
        }
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://api.nerave.com/v1'; // Default prod URL
    }
    async request(endpoint, options = {}) {
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
        return response.json();
    }
    agreements = {
        /**
         * Creates a new trustless agreement and deploys its corresponding smart contract.
         */
        create: async (params) => {
            return this.request('/agreements', {
                method: 'POST',
                body: JSON.stringify(params),
            });
        },
        /**
         * Gets the current state of an agreement and its milestones.
         */
        getStatus: async (agreementId) => {
            return this.request(`/agreements/${agreementId}`, {
                method: 'GET',
            });
        }
    };
    milestones = {
        /**
         * Confirms a milestone is completed. Requires confirmation from both parties to disburse.
         */
        confirm: async (params) => {
            return this.request(`/agreements/${params.agreementId}/milestones/${params.milestoneId}/confirm`, {
                method: 'POST',
                body: JSON.stringify({ role: params.role }),
            });
        }
    };
}
exports.Nerave = Nerave;
__exportStar(require("./types"), exports);
