import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, createWalletClient, http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

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
  private publicClient!: ReturnType<typeof createPublicClient>;
  private walletClient!: ReturnType<typeof createWalletClient>;
  private account!: ReturnType<typeof privateKeyToAccount>;

  // Inject ConfigService to access .env variables
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Initializing BlockchainService on Sepolia');

    // 1. Get Private Key from .env
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('PRIVATE_KEY is missing in environment variables');
    }

    // 2. Initialize Account
    this.account = privateKeyToAccount(privateKey as `0x${string}`);

    // 3. Setup Sepolia (Testnet) Clients
    this.publicClient = createPublicClient({
      chain: sepolia, // Sepolia testnet
      transport: http(), // Uses public RPC by default. You can pass Alchemy/Infura URL here if preferred.
    });

    this.walletClient = createWalletClient({
      account: this.account, // Bind the account to the WalletClient
      chain: sepolia,
      transport: http(),
    });
  }

  async deployAgreement(
    clientAddr: string,
    contractorAddr: string,
    totalAmount: bigint,
  ) {
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
      this.logger.log(`Contract deployed at: ${receipt.contractAddress}`);

      return receipt.contractAddress;
    } catch (error) {
      this.logger.error('Error deploying agreement', error);
      throw error;
    }
  }

  async listenToEvents(contractAddress: string) {
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
