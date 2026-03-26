import { HttpClient } from './http';
import { AgreementsResource } from './resources/agreements';
import { MilestonesResource } from './resources/milestones';
import { PaymentsResource } from './resources/payments';
import { NeraveConfig } from './types';

function parseEnvFileValue(content: string, key: string): string | undefined {
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

function readApiKeyFromEnvFile(key: string, filePath = '.env'): string | undefined {
  // Avoid importing node built-ins in non-node runtimes.
  if (typeof process === 'undefined' || !process.versions?.node) {
    return undefined;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path') as typeof import('path');
    const resolvedPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(resolvedPath)) {
      return undefined;
    }

    const content = fs.readFileSync(resolvedPath, 'utf8');
    return parseEnvFileValue(content, key);
  } catch {
    return undefined;
  }
}

function resolveApiKey(config: NeraveConfig): string | undefined {
  if (config.apiKey) {
    return config.apiKey;
  }

  const envKeyName = config.apiKeyEnvVar || 'NERAVE_API_KEY';
  const envApiKey =
    typeof process !== 'undefined' ? process.env?.[envKeyName] : undefined;

  if (envApiKey) {
    return envApiKey;
  }

  const shouldLoadEnvFile = config.loadEnvFile ?? true;
  if (!shouldLoadEnvFile) {
    return undefined;
  }

  return readApiKeyFromEnvFile(envKeyName, config.envFilePath);
}

export class Nerave {
  public readonly agreements: AgreementsResource;
  public readonly milestones: MilestonesResource;
  public readonly payments: PaymentsResource;

  constructor(config: NeraveConfig) {
    const envKeyName = config.apiKeyEnvVar || 'NERAVE_API_KEY';
    const apiKey = resolveApiKey(config);

    if (!apiKey) {
      throw new Error(
        `Nerave SDK requires an apiKey. Provide config.apiKey, set ${envKeyName} in your environment, or place it in ${config.envFilePath || '.env'}.`,
      );
    }

    const http = new HttpClient({
      apiKey,
      baseUrl: config.baseUrl,
    });

    this.agreements = new AgreementsResource(http);
    this.milestones = new MilestonesResource(http);
    this.payments = new PaymentsResource(http);
  }
}