"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nerave = void 0;
const http_1 = require("./http");
const agreements_1 = require("./resources/agreements");
const milestones_1 = require("./resources/milestones");
const payments_1 = require("./resources/payments");
function parseEnvFileValue(content, key) {
    const lines = content.split(/\r?\n/);
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) {
            continue;
        }
        const equalsIndex = line.indexOf('=');
        if (equalsIndex < 0) {
            continue;
        }
        const variable = line.slice(0, equalsIndex).trim();
        if (variable !== key) {
            continue;
        }
        const value = line.slice(equalsIndex + 1).trim();
        const unquoted = value.replace(/^['\"]|['\"]$/g, '');
        return unquoted;
    }
    return undefined;
}
function readApiKeyFromEnvFile(key, filePath = '.env') {
    var _a;
    // Avoid importing node built-ins in non-node runtimes.
    if (typeof process === 'undefined' || !((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node)) {
        return undefined;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const path = require('path');
        const resolvedPath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(resolvedPath)) {
            return undefined;
        }
        const content = fs.readFileSync(resolvedPath, 'utf8');
        return parseEnvFileValue(content, key);
    }
    catch (_b) {
        return undefined;
    }
}
function resolveApiKey(config) {
    var _a, _b;
    if (config.apiKey) {
        return config.apiKey;
    }
    const envKeyName = config.apiKeyEnvVar || 'NERAVE_API_KEY';
    const envApiKey = typeof process !== 'undefined' ? (_a = process.env) === null || _a === void 0 ? void 0 : _a[envKeyName] : undefined;
    if (envApiKey) {
        return envApiKey;
    }
    const shouldLoadEnvFile = (_b = config.loadEnvFile) !== null && _b !== void 0 ? _b : true;
    if (!shouldLoadEnvFile) {
        return undefined;
    }
    return readApiKeyFromEnvFile(envKeyName, config.envFilePath);
}
class Nerave {
    constructor(config) {
        const envKeyName = config.apiKeyEnvVar || 'NERAVE_API_KEY';
        const apiKey = resolveApiKey(config);
        if (!apiKey) {
            throw new Error(`Nerave SDK requires an apiKey. Provide config.apiKey, set ${envKeyName} in your environment, or place it in ${config.envFilePath || '.env'}.`);
        }
        const http = new http_1.HttpClient({
            apiKey,
            baseUrl: config.baseUrl,
        });
        this.agreements = new agreements_1.AgreementsResource(http);
        this.milestones = new milestones_1.MilestonesResource(http);
        this.payments = new payments_1.PaymentsResource(http);
    }
}
exports.Nerave = Nerave;
//# sourceMappingURL=nerave.js.map