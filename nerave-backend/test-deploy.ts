import { ConfigService } from '@nestjs/config';
import { BlockchainService } from './src/blockchain/blockchain.service';
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

async function bootstrap() {
  // Manually mock ConfigService to avoid booting the whole broken AppModule
  const configService = {
    get: (key: string) => process.env[key],
  } as unknown as ConfigService;

  const service = new BlockchainService(configService);
  service.onModuleInit();

  // Mock addresses for a test standard agreement
  const client = '0x0000000000000000000000000000000000000001';
  const contractor = '0x0000000000000000000000000000000000000002';
  const amount = BigInt(1000000000000000); // 0.001 ETH/Tokens

  console.log('--- Nerave: Manual Contract Deployment Test ---');
  console.log('Connecting to Sepolia via viem...');

  try {
    const address = await service.deployAgreement(client, contractor, amount);
    console.log(`\n✅ Successfully deployed PayLockAgreement at: ${address}\n`);
    console.log(
      'You can now search for this address on https://sepolia.etherscan.io and verify the code.',
    );

    // Output the source code for manual Etherscan flattening/verification
    console.log(`\n\n--- FOR ETHERSCAN VERIFICATION ---`);
    console.log(`Compiler: v0.8.20+commit.a1b79de6`);
    console.log(`Optimization: Yes (if you used standard Foundry options)`);
    console.log(
      `Constructor Args (ABI-encoded): Run \`cast abi-encode "constructor(address,address,uint256)" "${client}" "${contractor}" "${amount}"\` or use Etherscan's auto-detect.\n`,
    );
  } catch (err) {
    console.error(
      '\n❌ Deployment test failed. Ensure your RPC_URL and PRIVATE_KEY are correct.\n',
      err,
    );
  }
}

bootstrap();
// 0x18b8b591b63d2f78a05eb3436113e593252e3e61
