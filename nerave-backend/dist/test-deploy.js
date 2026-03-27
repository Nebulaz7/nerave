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
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_service_1 = require("./src/blockchain/blockchain.service");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function bootstrap() {
    const configService = {
        get: (key) => process.env[key],
    };
    const service = new blockchain_service_1.BlockchainService(configService);
    service.onModuleInit();
    const client = '0x0000000000000000000000000000000000000001';
    const contractor = '0x0000000000000000000000000000000000000002';
    const amount = BigInt(1000000000000000);
    console.log('--- Nerave: Manual Contract Deployment Test ---');
    console.log('Connecting to Sepolia via viem...');
    try {
        const address = await service.deployAgreement(client, contractor, amount);
        console.log(`\n✅ Successfully deployed PayLockAgreement at: ${address}\n`);
        console.log('You can now search for this address on https://sepolia.etherscan.io and verify the code.');
        console.log(`\n\n--- FOR ETHERSCAN VERIFICATION ---`);
        console.log(`Compiler: v0.8.20+commit.a1b79de6`);
        console.log(`Optimization: Yes (if you used standard Foundry options)`);
        console.log(`Constructor Args (ABI-encoded): Run \`cast abi-encode "constructor(address,address,uint256)" "${client}" "${contractor}" "${amount}"\` or use Etherscan's auto-detect.\n`);
    }
    catch (err) {
        console.error('\n❌ Deployment test failed. Ensure your RPC_URL and PRIVATE_KEY are correct.\n', err);
    }
}
bootstrap();
//# sourceMappingURL=test-deploy.js.map