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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const WebSocket = __importStar(require("ws"));
if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = WebSocket;
}
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
function toHttpRpcUrl(url) {
    if (!url)
        return undefined;
    if (url.startsWith('wss://'))
        return `https://${url.slice('wss://'.length)}`;
    if (url.startsWith('ws://'))
        return `http://${url.slice('ws://'.length)}`;
    return url;
}
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
];
const payLockBytecode = '0x608060405234801561001057600080fd5b506040516100233803806100238339818101604052810190808051906020019092919080519060200190929190505050';
let BlockchainService = BlockchainService_1 = class BlockchainService {
    configService;
    logger = new common_1.Logger(BlockchainService_1.name);
    publicClient;
    walletClient;
    account;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.logger.log('Initializing BlockchainService on Sepolia');
        const privateKey = this.configService.get('WALLET_PRIVATE_KEY') ??
            this.configService.get('PRIVATE_KEY');
        const rawRpcUrl = this.configService.get('SEPOLIA_RPC_URL');
        const rpcUrl = toHttpRpcUrl(rawRpcUrl);
        if (rawRpcUrl?.startsWith('ws://') || rawRpcUrl?.startsWith('wss://')) {
            this.logger.warn('SEPOLIA_RPC_URL is ws/wss. Converted to http/https for current viem HTTP transport.');
        }
        if (!privateKey) {
            this.logger.error('CRITICAL: No wallet private key found in environment variables.');
            throw new Error('WALLET_PRIVATE_KEY or PRIVATE_KEY is required');
        }
        this.account = (0, accounts_1.privateKeyToAccount)(privateKey);
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chains_1.sepolia,
            transport: (0, viem_1.http)(rpcUrl || undefined),
        });
        this.walletClient = (0, viem_1.createWalletClient)({
            account: this.account,
            chain: chains_1.sepolia,
            transport: (0, viem_1.http)(rpcUrl || undefined),
        });
    }
    async deployAgreement(clientAddr, contractorAddr, totalAmount) {
        this.logger.log(`Deploying agreement for Client: ${clientAddr}, Contractor: ${contractorAddr}`);
        try {
            const hash = await this.walletClient.deployContract({
                abi: payLockAbi,
                bytecode: payLockBytecode,
                args: [clientAddr, contractorAddr, totalAmount],
                account: this.account,
                chain: chains_1.sepolia,
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
        }
        catch (error) {
            this.logger.error('Error deploying agreement', error);
            throw error;
        }
    }
    async getAgreementState(contractAddress) {
        try {
            const result = await this.publicClient.readContract({
                address: contractAddress,
                abi: payLockAbi,
                functionName: 'getAgreementState',
            });
            return {
                agreement: result[0],
                milestones: result[1],
            };
        }
        catch (error) {
            this.logger.error('Error getting agreement state', error);
            throw error;
        }
    }
    async confirmMilestone(contractAddress, milestoneIndex, by) {
        this.logger.log(`confirmMilestone called for ${contractAddress} milestone ${milestoneIndex} by ${by}`);
        try {
            const hash = await this.walletClient.writeContract({
                address: contractAddress,
                abi: payLockAbi,
                functionName: 'confirmMilestone',
                args: [BigInt(milestoneIndex)],
                chain: chains_1.sepolia,
                account: this.account,
            });
            this.logger.log(`confirmMilestone tx hash: ${hash}`);
            await this.publicClient.waitForTransactionReceipt({ hash });
            this.logger.log(`confirmMilestone executed successfully`);
        }
        catch (error) {
            this.logger.error('Error confirming milestone', error);
            throw error;
        }
    }
    async listenToEvents(contractAddress, onMilestoneApproved) {
        if (contractAddress.toLowerCase() === ZERO_ADDRESS) {
            this.logger.log('[MOCK] Skipping event listener for zero-address contract');
            return;
        }
        this.logger.log(`Listening for MilestoneApproved events on ${contractAddress}`);
        this.publicClient.watchContractEvent({
            address: contractAddress,
            abi: payLockAbi,
            eventName: 'MilestoneApproved',
            onLogs: (logs) => {
                logs.forEach((log) => {
                    this.logger.log(`Event received! Milestone: ${log.args.milestoneId}, Amount: ${log.args.amount}`);
                    this.handleAutoDisbursement(log.args.milestoneId.toString(), log.args.amount.toString());
                    void onMilestoneApproved?.(log.args.milestoneId.toString(), log.args.amount.toString());
                });
            },
            onError: (error) => {
                this.logger.error('Error watching contract events', error);
            },
        });
    }
    handleAutoDisbursement(milestoneId, amount) {
        this.logger.log(` [INTERSWITCH PIPELINE] Auto-disbursement triggered for Milestone ${milestoneId} - Amount: ${amount}`);
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map