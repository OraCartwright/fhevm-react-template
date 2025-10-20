# Getting Started with FHEVM SDK

This guide will help you get started with the FHEVM SDK from zero to your first encrypted transaction.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- A Web3 wallet (MetaMask, etc.)
- Basic knowledge of React and TypeScript
- Familiarity with Ethereum smart contracts

## 🚀 Installation

### Step 1: Clone or Download the Project

```bash
git clone https://github.com/your-username/fhevm-sdk-project.git
cd fhevm-sdk-project
```

### Step 2: Install Dependencies

From the **project root**:

```bash
npm install
```

This will install all dependencies for all packages in the monorepo.

### Step 3: Build All Packages

```bash
npm run build
```

This builds:
- `@fhevm/sdk` (core SDK)
- `@fhevm/react` (React hooks)
- `@fhevm/contracts` (Solidity contracts)

## 🔧 Configuration

### Set Up Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:

```env
# Sepolia testnet RPC
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Your private key (for deployment)
PRIVATE_KEY=your_private_key_here

# WalletConnect project ID (get from https://cloud.walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**Security Warning**: Never commit your `.env` file or expose your private keys!

## 📝 Deploy Contracts

### Option 1: Deploy to Local Hardhat Network

1. Start local Hardhat node:

```bash
cd packages/contracts
npx hardhat node
```

2. In another terminal, deploy:

```bash
npm run compile
npm run deploy
```

### Option 2: Deploy to Sepolia Testnet

```bash
cd packages/contracts
npm run deploy:sepolia
```

Save the deployed contract address - you'll need it for the frontend!

## 🎨 Using the SDK

### Method 1: Use Example dApp (Recommended for Learning)

The easiest way to start is with the pre-built example dApp:

```bash
npm run start:example
```

This starts a Vite development server at `http://localhost:5173`.

### Method 2: Integrate into Your Own App

#### Install SDK Packages

```bash
npm install @fhevm/sdk @fhevm/react
```

#### Set Up FhevmProvider

Wrap your app with `FhevmProvider`:

```tsx
import { FhevmProvider } from '@fhevm/react';

function App() {
  return (
    <FhevmProvider
      config={{
        network: {
          chainId: 11155111, // Sepolia
          name: 'Sepolia',
          rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
        },
      }}
    >
      <YourApp />
    </FhevmProvider>
  );
}
```

#### Use Hooks

```tsx
import { useFhevmClient, useEncryptedInput } from '@fhevm/react';
import { useAccount, useWriteContract } from 'wagmi';

function EncryptedCounter() {
  const { address } = useAccount();
  const { createInput, encrypt, isEncrypting } = useEncryptedInput();
  const { writeContract } = useWriteContract();

  const handleIncrement = async (value: number) => {
    // Create encrypted input
    const input = createInput(CONTRACT_ADDRESS).addUint32(value);
    const encrypted = await encrypt(input);

    if (!encrypted) return;

    // Submit to contract
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'incrementBy',
      args: [encrypted.data, encrypted.inputProof],
    });
  };

  return (
    <button onClick={() => handleIncrement(10)} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Increment by 10'}
    </button>
  );
}
```

## 📖 Core Concepts

### 1. Encrypted Types

FHEVM supports these encrypted types:

| Type | Description | Max Value |
|------|-------------|-----------|
| `euint8` | Encrypted 8-bit unsigned integer | 255 |
| `euint16` | Encrypted 16-bit unsigned integer | 65,535 |
| `euint32` | Encrypted 32-bit unsigned integer | 4,294,967,295 |
| `euint64` | Encrypted 64-bit unsigned integer | 2^64 - 1 |
| `euint128` | Encrypted 128-bit unsigned integer | 2^128 - 1 |
| `euint256` | Encrypted 256-bit unsigned integer | 2^256 - 1 |
| `eaddress` | Encrypted Ethereum address | - |
| `ebool` | Encrypted boolean | true/false |
| `ebytes` | Encrypted bytes | - |

### 2. Encryption Flow

```
User Input (plaintext)
    ↓
Create Encrypted Input Builder
    ↓
Add Values (addUint32, addAddress, etc.)
    ↓
Encrypt (using FHE public key)
    ↓
Encrypted Data + Input Proof
    ↓
Submit to Smart Contract
```

### 3. Decryption Patterns

**User Decryption (Private)**
```tsx
import { useUserDecrypt } from '@fhevm/react';
import { useEthersSigner } from './hooks/useEthersSigner';

function MyBalance() {
  const { decrypt, isDecrypting, result } = useUserDecrypt();
  const signer = useEthersSigner();

  const handleReveal = async () => {
    const decrypted = await decrypt(
      {
        contractAddress: CONTRACT_ADDRESS,
        handle: balanceHandle,
        userAddress: address,
      },
      signer
    );

    console.log('My balance:', decrypted?.value);
  };
}
```

**Public Decryption**
```solidity
// In your contract
function requestPublicDecrypt() external returns (uint256) {
    uint256[] memory cts = new uint256[](1);
    cts[0] = Gateway.toUint256(counter);

    return Gateway.requestDecryption(
        cts,
        this.callbackPublicDecrypt.selector,
        0,
        block.timestamp + 100,
        false
    );
}

function callbackPublicDecrypt(uint256, uint256[] memory decryptedInput)
    public
    onlyGateway
{
    uint32 value = uint32(decryptedInput[0]);
    emit ValueRevealed(value);
}
```

## 🧪 Testing

### Test Core SDK

```bash
cd packages/fhevm-sdk
npm run test
```

### Test Contracts

```bash
cd packages/contracts
npm run test
```

### Test React Hooks

```bash
cd packages/fhevm-react
npm run test
```

## 🐛 Troubleshooting

### Issue: "FHEVM client not initialized"

**Solution**: Ensure you're using `FhevmProvider` and waiting for initialization:

```tsx
const { isInitialized } = useFhevmClient();

if (!isInitialized) {
  return <div>Loading...</div>;
}
```

### Issue: Encryption fails

**Solution**: Check that:
1. Client is initialized
2. Contract address is valid
3. Values fit within their type limits (e.g., uint8 max is 255)

### Issue: Contract deployment fails

**Solution**:
1. Check you have enough testnet ETH
2. Verify `.env` configuration
3. Ensure correct network in Hardhat config

### Issue: Decryption returns 0 or fails

**Solution**:
1. Check that the encrypted handle is valid
2. Verify user has permission to decrypt
3. Ensure gateway is configured correctly

## 📚 Next Steps

1. **Read the Full Documentation**: Check `/packages/*/README.md` for detailed API docs
2. **Explore Example Contracts**: Look at `packages/contracts/contracts/`
3. **Build Your Own dApp**: Use the SDK to create your own FHE-powered application
4. **Join the Community**: Share your projects and get help

## 🔗 Useful Links

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Solidity](https://docs.zama.ai/fhevm)
- [fhevmjs Documentation](https://docs.zama.ai/fhevmjs)
- [Ethereum Development](https://ethereum.org/developers)

## 💡 Example Projects You Can Build

- Private voting systems
- Confidential auctions
- Encrypted asset transfers
- Private DAOs
- Confidential credit scoring
- Secret ballot systems
- Private medical records
- Confidential financial applications

## 🤝 Need Help?

- GitHub Issues: [Report bugs](https://github.com/your-username/fhevm-sdk-project/issues)
- Discord: [Join our community](https://discord.gg/example)
- Twitter: [@fhevm_sdk](https://twitter.com/example)

---

Happy Building with FHE! 🎉
