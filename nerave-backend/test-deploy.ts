import { BlockchainService } from './src/blockchain/blockchain.service';
import { ConfigService } from '@nestjs/config';

/**
 * Script to test the blockchain service manually.
 * Run using: npx ts-node test-deploy.ts
 */
async function main() {
  console.log('Testing BlockchainService manually...');
  const service = new BlockchainService(new ConfigService());
  service.onModuleInit();

  const client = '0x0000000000000000000000000000000000000001';
  const contractor = '0x0000000000000000000000000000000000000002';
  const amount = BigInt(1000000000000000000); // 1 ETH

  // Depending on whether we have a real PK in the service, this will throw or succeed.
  // We wrap in try-catch
  try {
    const address = await service.deployAgreement(client, contractor, amount);
    console.log(`Successfully deployed at: ${address}`);

    if (address) {
      console.log('Starting event listener on new contract...');
      await service.listenToEvents(address);
      console.log('Listening... (Press Ctrl+C to exit)');
    }
  } catch (err) {
    console.error('Deployment test failed (expected if using mock pk without funds):', err);
  }
}

main();
