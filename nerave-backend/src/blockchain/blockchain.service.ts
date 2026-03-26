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
    inputs: [{ internalType: 'uint256', name: 'milestoneId', type: 'uint256' }],
    name: 'confirmMilestone',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAgreementState',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'client', type: 'address' },
          { internalType: 'address', name: 'contractor', type: 'address' },
          { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
        ],
        internalType: 'struct PayLockAgreement.Agreement',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'bool', name: 'clientConfirmed', type: 'bool' },
          { internalType: 'bool', name: 'contractorConfirmed', type: 'bool' },
          { internalType: 'bool', name: 'disbursed', type: 'bool' },
        ],
        internalType: 'struct PayLockAgreement.Milestone[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
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
  private publicClient!: ReturnType<typeof createPublicClient>;
  private walletClient!: ReturnType<typeof createWalletClient>;
  private account!: ReturnType<typeof privateKeyToAccount>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Initializing BlockchainService on Sepolia');

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
      this.logger.error(
        'CRITICAL: No wallet private key found in environment variables.',
      );
      throw new Error('WALLET_PRIVATE_KEY or PRIVATE_KEY is required');
    }

    this.account = privateKeyToAccount(privateKey as `0x${string}`);

    this.publicClient = createPublicClient({
<<<<<<< HEAD
      chain: sepolia, // Sepolia testnet
      transport: http(rpcUrl || undefined), // Uses configured RPC URL when available.
=======
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_URL') || undefined),
>>>>>>> 94252a9cf7c2a92810a9fd38801f7b1c97f4e6e4
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: sepolia,
<<<<<<< HEAD
      transport: http(rpcUrl || undefined),
=======
      transport: http(this.configService.get<string>('RPC_URL') || undefined),
>>>>>>> 94252a9cf7c2a92810a9fd38801f7b1c97f4e6e4
    });
  }

  async deployAgreement(
    clientAddr: string,
    contractorAddr: string,
    totalAmount: bigint,
  ): Promise<string> {
    this.logger.log(
      `Deploying agreement for Client: ${clientAddr}, Contractor: ${contractorAddr}`,
    );

    try {
      const hash = await this.walletClient.deployContract({
        abi: payLockAbi,
        bytecode: payLockBytecode as `0x${string}`,
        args: [clientAddr as Address, contractorAddr as Address, totalAmount],
        account: this.account,
        chain: sepolia,
      });

      this.logger.log(`Deployment tx hash: ${hash}`);

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      if (!receipt.contractAddress) {
        throw new Error(
          'Contract deployment completed without contractAddress',
        );
      }

      this.logger.log(`Contract deployed at: ${receipt.contractAddress}`);
      return receipt.contractAddress;
    } catch (error) {
      this.logger.error('Error deploying agreement', error);
      throw error;
    }
  }

  async getAgreementState(contractAddress: string) {
    try {
      const result = await this.publicClient.readContract({
        address: contractAddress as Address,
        abi: payLockAbi,
        functionName: 'getAgreementState',
      });
      // the ABI returns two values: Agreement tuple, Milestones array
      return {
        agreement: result[0],
        milestones: result[1],
      };
    } catch (error) {
      this.logger.error('Error getting agreement state', error);
      throw error;
    }
  }

  async confirmMilestone(
    contractAddress: string,
    milestoneIndex: number,
    by: 'CLIENT' | 'CONTRACTOR',
  ) {
    this.logger.log(
      `confirmMilestone called for ${contractAddress} milestone ${milestoneIndex} by ${by}`,
    );
    try {
      // Execute the on-chain write
      const hash = await this.walletClient.writeContract({
        address: contractAddress as Address,
        abi: payLockAbi,
        functionName: 'confirmMilestone',
        args: [BigInt(milestoneIndex)],
        chain: sepolia,
        account: this.account,
      });

      this.logger.log(`confirmMilestone tx hash: ${hash}`);
      await this.publicClient.waitForTransactionReceipt({ hash });
      this.logger.log(`confirmMilestone executed successfully`);
    } catch (error) {
      this.logger.error('Error confirming milestone', error);
      throw error;
    }
  }

  async listenToEvents(
    contractAddress: string,
    onMilestoneApproved?: (
      milestoneId: string,
      amount: string,
    ) => Promise<void> | void,
  ) {
<<<<<<< HEAD
    if (contractAddress.toLowerCase() === ZERO_ADDRESS) {
      this.logger.log('[MOCK] Skipping event listener for zero-address contract');
      return;
    }
=======
>>>>>>> 94252a9cf7c2a92810a9fd38801f7b1c97f4e6e4
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
  }
}
