# FHEVM SDK - Next.js Template

A complete Next.js template demonstrating the FHEVM SDK for privacy-preserving smart contracts with Fully Homomorphic Encryption (FHE).

## 🎯 What This Template Demonstrates

- **Client-side encryption** with the FHEVM SDK
- **Encrypted counter** smart contract interaction
- **User decryption** with EIP-712 signatures
- **Next.js 14** App Router best practices
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **wagmi** and **RainbowKit** for wallet integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Configuration

Update `.env.local` with your values:

```env
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Update the contract address in `app/page.tsx`:

```typescript
const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
nextjs-template/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with encrypted counter
│   └── globals.css         # Global styles
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## 🔧 Using the FHEVM SDK

### 1. Initialize the Client

```typescript
'use client';

import { createFhevmClient } from '@fhevm/sdk';
import { useEffect, useState } from 'react';

export default function Home() {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const initClient = async () => {
      const fhevmClient = createFhevmClient({
        network: {
          chainId: 11155111,
          name: 'Sepolia',
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
        },
      });

      await fhevmClient.init();
      setClient(fhevmClient);
    };

    initClient();
  }, []);
}
```

### 2. Create Encrypted Inputs

```typescript
// Create encrypted input
const input = client
  .createEncryptedInput(CONTRACT_ADDRESS)
  .addUint32(100);

// Encrypt the input
const encrypted = await input.encrypt();
```

### 3. Submit to Smart Contract

```typescript
import { useWriteContract } from 'wagmi';

const { writeContract } = useWriteContract();

writeContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'incrementBy',
  args: [encrypted.data, encrypted.inputProof],
});
```

### 4. Decrypt Values (User Decryption)

```typescript
// Request decryption from the smart contract
writeContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'requestUserDecrypt',
});

// The decrypted value will be returned via the contract callback
```

## 📖 Smart Contract Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

contract ConfidentialCounter is GatewayCaller {
    euint32 private counter;

    function incrementBy(einput encryptedAmount, bytes calldata inputProof) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
        counter = TFHE.add(counter, amount);
        TFHE.allowThis(counter);
    }

    function requestUserDecrypt() external returns (uint256) {
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(counter);
        return Gateway.requestDecryption(
            cts,
            this.callbackUserDecrypt.selector,
            0,
            block.timestamp + 100,
            false
        );
    }

    function callbackUserDecrypt(uint256, uint256 decryptedValue) public {
        // Handle decrypted value
    }
}
```

## 🎨 Customization

### Adding More Features

1. **Multiple encrypted types**: Use `addUint8()`, `addUint16()`, `addUint64()`, `addBool()`, `addAddress()`
2. **Private voting**: Implement with `addBool()` for votes
3. **Sealed auctions**: Use `addUint64()` for bids
4. **Token transfers**: Encrypt amounts with `addUint32()`

### Styling

The template uses TailwindCSS. Customize colors and themes in `tailwind.config.ts`.

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build the app
npm run build

# Deploy the .next folder
```

## 📚 Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)
- [FHEVM SDK API](../../packages/fhevm-sdk/README.md)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)

## 🤝 Contributing

Contributions are welcome! Please see the main repository README for guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/zama)
- [FHEVM Docs](https://docs.zama.ai/fhevm)
