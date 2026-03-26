import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, createWalletClient, http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as WebSocket from 'ws';



if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function toHttpRpcUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('wss://')) return `https://${url.slice('wss://'.length)}`;
  if (url.startsWith('ws://')) return `http://${url.slice('ws://'.length)}`;
  return url;
}

// Minimal ABI for PayLockAgreement
const payLockAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_client', type: 'address' },
      { internalType: 'address', name: '_contractor', type: 'address' },
      { internalType: 'uint256', name: '_totalAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'milestoneId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'MilestoneApproved',
    type: 'event',
  },
] as const;

// Mock bytecode for deployment demonstration
const payLockBytecode =
  '0x608060405234801561001057600080fd5b506040516100233803806100238339818101604052810190808051906020019092919080519060200190929190505050';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private isMockMode = false;
  private publicClient!: ReturnType<typeof createPublicClient>;
  private walletClient!: ReturnType<typeof createWalletClient>;
  private account!: ReturnType<typeof privateKeyToAccount>;

  // Inject ConfigService to access .env variables
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Initializing BlockchainService on Sepolia');

    // Prefer WALLET_PRIVATE_KEY but keep backward compatibility with PRIVATE_KEY.
    const privateKey =
      this.configService.get<string>('WALLET_PRIVATE_KEY') ??
      this.configService.get<string>('PRIVATE_KEY');
    const rawRpcUrl = this.configService.get<string>('SEPOLIA_RPC_URL');
    const rpcUrl = toHttpRpcUrl(rawRpcUrl);

    if (rawRpcUrl?.startsWith('ws://') || rawRpcUrl?.startsWith('wss://')) {
      this.logger.warn(
        'SEPOLIA_RPC_URL is ws/wss. Converted to http/https for current viem HTTP transport.',
      );
    }

    if (!privateKey) {
      this.isMockMode = true;
      this.logger.warn(
        'No wallet private key found. BlockchainService running in mock mode.',
      );
      return;
    }

    // 2. Initialize Account
    this.account = privateKeyToAccount(privateKey as `0x${string}`);

    // 3. Setup Sepolia (Testnet) Clients
    this.publicClient = createPublicClient({
      chain: sepolia, // Sepolia testnet
      transport: http(rpcUrl || undefined), // Uses configured RPC URL when available.
    });

    this.walletClient = createWalletClient({
      account: this.account, // Bind the account to the WalletClient
      chain: sepolia,
      transport: http(rpcUrl || undefined),
    });
  }

  async deployAgreement(
    clientAddr: string,
    contractorAddr: string,
    totalAmount: bigint,
  ): Promise<string> {
    if (this.isMockMode) {
      this.logger.warn(
        'Mock deployment used; returning placeholder contract address for local testing.',
      );
      return '0x0000000000000000000000000000000000000000';
    }

    this.logger.log(
      `Deploying agreement for Client: ${clientAddr}, Contractor: ${contractorAddr}`,
    );

    try {
      // 4. Pass the account during the deployContract call
      const hash = await this.walletClient.deployContract({
        abi: payLockAbi,
        bytecode: payLockBytecode as `0x${string}`,
        args: [clientAddr as Address, contractorAddr as Address, totalAmount],
        account: this.account, // Include account here to resolve the TypeScript/Viem error
        chain: sepolia, // Include chain parameter here
      });

      this.logger.log(`Deployment tx hash: ${hash}`);

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      if (!receipt.contractAddress) {
        throw new Error('Contract deployment completed without contractAddress');
      }

      this.logger.log(`Contract deployed at: ${receipt.contractAddress}`);

      return receipt.contractAddress;
    } catch (error) {
      this.logger.error('Error deploying agreement', error);
      throw error;
    }
  }

  async confirmMilestone(
    contractAddress: string,
    milestoneIndex: number,
    by: 'CLIENT' | 'CONTRACTOR',
  ) {
    if (this.isMockMode) {
      this.logger.log(
        `[MOCK] confirmMilestone contract=${contractAddress} milestone=${milestoneIndex} by=${by}`,
      );
      return;
    }

    this.logger.log(
      `confirmMilestone called for ${contractAddress} milestone ${milestoneIndex} by ${by}`,
    );
    // TODO: call contract method when ABI/write path is finalized.
  }

  async listenToEvents(
    contractAddress: string,
    onMilestoneApproved?: (milestoneId: string, amount: string) => Promise<void> | void,
  ) {
    if (contractAddress.toLowerCase() === ZERO_ADDRESS) {
      this.logger.log('[MOCK] Skipping event listener for zero-address contract');
      return;
    }

    if (this.isMockMode) {
      this.logger.log(
        `[MOCK] listenToEvents registered for ${contractAddress} (no chain subscription in mock mode)`,
      );
      return;
    }

    this.logger.log(
      `Listening for MilestoneApproved events on ${contractAddress}`,
    );

    this.publicClient.watchContractEvent({
      address: contractAddress as Address,
      abi: payLockAbi,
      eventName: 'MilestoneApproved',
      onLogs: (logs) => {
        logs.forEach((log) => {
          this.logger.log(
            `Event received! Milestone: ${log.args.milestoneId}, Amount: ${log.args.amount}`,
          );
          // Here we would call the Interswitch service/webhook to auto-disburse
          this.handleAutoDisbursement(
            log.args.milestoneId!.toString(),
            log.args.amount!.toString(),
          );
          void onMilestoneApproved?.(
            log.args.milestoneId!.toString(),
            log.args.amount!.toString(),
          );
        });
      },
      onError: (error) => {
        this.logger.error('Error watching contract events', error);
      },
    });
  }

  private handleAutoDisbursement(milestoneId: string, amount: string) {
    this.logger.log(
      ` [INTERSWITCH PIPELINE] Auto-disbursement triggered for Milestone ${milestoneId} - Amount: ${amount}`,
    );
    // Simulate API call to Interswitch mock...
  }
}
