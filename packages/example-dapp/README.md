# FHEVM SDK Example Applications

Complete example applications demonstrating the FHEVM SDK in real-world scenarios.

## 🎯 What's Included

This example dApp showcases 4 complete privacy-preserving scenarios:

### 1. 🔢 Encrypted Counter
- Client-side encryption with `addUint32()`
- Homomorphic addition on encrypted data
- User decryption with EIP-712 signatures

### 2. 🗳️ Private Voting
- Zero-knowledge voting system
- Encrypted boolean votes with `addBool()`
- Public result tallying after voting ends

### 3. 🏆 Sealed-Bid Auction
- Confidential auction bids with `addUint64()`
- FHE comparison operations (`FHE.ge`)
- Selective decryption (only winner revealed)

### 4. 💸 Private Token Transfers
- Encrypted ERC20-like token balances
- Private transfers between addresses
- User-controlled balance decryption

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
# From the monorepo root
npm install

# Start the development server
cd packages/example-dapp
npm run dev
```

The app will be available at `http://localhost:3000`

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables:
   ```env
   VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

3. Update contract addresses in `src/config/contracts.ts`:
   ```typescript
   export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
   ```

## 📁 Project Structure

```
example-dapp/
├── src/
│   ├── components/
│   │   ├── EncryptedCounter.tsx    # Counter scenario
│   │   ├── PrivateVoting.tsx       # Voting scenario
│   │   ├── ConfidentialAuction.tsx # Auction scenario
│   │   └── PrivateTransfer.tsx     # Token transfer scenario
│   ├── config/
│   │   └── contracts.ts            # Contract ABIs and addresses
│   ├── App.tsx                     # Main application
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **wagmi** - Web3 hooks
- **RainbowKit** - Wallet connection
- **@fhevm/sdk** - Core FHE functionality
- **@fhevm/react** - React hooks for FHEVM

## 📖 Using the SDK

### Basic Setup

```typescript
import { FhevmProvider } from '@fhevm/react';

function App() {
  return (
    <FhevmProvider
      config={{
        network: {
          chainId: 11155111,
          name: 'Sepolia',
          rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
        },
      }}
    >
      {/* Your app */}
    </FhevmProvider>
  );
}
```

### Creating Encrypted Inputs

```typescript
import { useEncryptedInput } from '@fhevm/react';

function MyComponent() {
  const { createInput, encrypt, isEncrypting } = useEncryptedInput();

  const handleSubmit = async () => {
    // Create input
    const input = createInput(contractAddress)
      .addUint32(100)
      .addBool(true)
      .addAddress('0x...');

    // Encrypt
    const encrypted = await encrypt(input);

    // Submit to contract
    await contract.myFunction(
      encrypted.data,
      encrypted.inputProof
    );
  };
}
```

### User Decryption

```typescript
import { useUserDecrypt } from '@fhevm/react';

function MyComponent() {
  const { decrypt, isDecrypting, result } = useUserDecrypt();

  const handleReveal = async () => {
    // Trigger decryption request on contract
    await contract.requestUserDecrypt();

    // Result will be available in the `result` variable
    console.log(result.value);
  };
}
```

## 🎨 Customization

### Adding New Scenarios

1. Create a new component in `src/components/`
2. Add the scenario to the tabs in `App.tsx`
3. Create corresponding contract ABI in `src/config/contracts.ts`

### Styling

The app uses TailwindCSS for styling. Customize colors and themes in `tailwind.config.ts`.

## 🧪 Testing Locally

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Connect your wallet:**
   - Switch to Sepolia testnet
   - Get test ETH from a faucet

3. **Deploy test contracts:**
   ```bash
   cd ../contracts
   npm run deploy
   ```

4. **Update contract addresses** in `src/config/contracts.ts`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Netlify

## 📚 Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [SDK API Reference](../../packages/fhevm-sdk/README.md)
- [React Hooks Guide](../../packages/fhevm-react/README.md)
- [Smart Contract Examples](../../packages/contracts/README.md)

## 🤝 Contributing

Contributions are welcome! Please see the main repository README for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/zama)
- [Documentation](https://docs.zama.ai/fhevm)
