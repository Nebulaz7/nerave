#!/bin/bash

# Nerave Hackathon - Manual Cast Deployment Test
# Run this inside WSL or Git Bash if Foundry is installed

# Set your Sepolia RPC URL and Private Key
RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"

# Contract deployment args
CLIENT_ADDR="0x0000000000000000000000000000000000000001"
CONTRACTOR_ADDR="0x0000000000000000000000000000000000000002"
TOTAL_AMOUNT="1000000000000000000" # 1 ETH/USDT in wei

# Cast deploy command
echo "Deploying PayLockAgreement to Sepolia..."
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY --create src/PayLockAgreement.sol:PayLockAgreement $CLIENT_ADDR $CONTRACTOR_ADDR $TOTAL_AMOUNT

echo "Deployment complete! Check your wallet address on Sepolia Etherscan to find the new contract."
 