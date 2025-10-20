# ⚡ Quick Start Guide - FHEVM SDK

Get started with encrypted smart contracts in **less than 10 lines of code**.

## 🚀 Installation (1 line)

```bash
npm install @fhevm/sdk @fhevm/react wagmi viem @rainbow-me/rainbowkit
```

## 💻 Basic Usage (8 lines)

```typescript
import { createFhevmClient } from '@fhevm/sdk';

// 1. Create client
const client = createFhevmClient({ network: { chainId: 11155111, name: 'Sepolia', rpcUrl: 'YOUR_RPC_URL' } });

// 2. Initialize
await client.init();

// 3. Create encrypted input
const input = client.createEncryptedInput(contractAddress).addUint32(100);

// 4. Encrypt
const encrypted = await input.encrypt();

// 5. Submit to contract
await contract.incrementBy(encrypted.data, encrypted.inputProof);
```

**That's it!** 🎉 You just encrypted data and sent it to the blockchain.

---

## 🎯 React Hooks (Even Simpler)

```tsx
import { FhevmProvider, useEncryptedInput } from '@fhevm/react';

// 1. Wrap your app
<FhevmProvider config={{ network: { chainId: 11155111, name: 'Sepolia', rpcUrl: 'YOUR_RPC' } }}>
  <App />
</FhevmProvider>

// 2. Use the hook (4 lines)
function MyComponent() {
  const { createInput, encrypt } = useEncryptedInput();
  const input = createInput(contractAddress).addUint32(100);
  const encrypted = await encrypt(input);
  await contract.incrementBy(encrypted.data, encrypted.inputProof);
}
```

---

## 📦 Run Complete Example

```bash
# 1. Navigate to project
cd D:\fhevm-react-template

# 2. Install dependencies (from root)
npm install

# 3. Start Vite + React example (4 scenarios)
cd packages\example-dapp
npm run dev
```

Open `http://localhost:3000` and see 4 complete scenarios! 🚀

**Or try Next.js template:**
```bash
cd D:\fhevm-react-template\examples\nextjs-template
npm run dev
```

---

## 🔑 Key Features

| Feature | Lines of Code | Time to Setup |
|---------|---------------|---------------|
| Client Init | 2 lines | 5 seconds |
| Encrypt Data | 2 lines | 5 seconds |
| Submit Transaction | 1 line | 10 seconds |
| **Total** | **< 10 lines** | **< 1 minute** |

---

## 🎨 Supported Data Types

```typescript
// All encrypted types in one input
const input = client
  .createEncryptedInput(address)
  .addUint8(10)         // Tiny numbers
  .addUint16(1000)      // Small numbers
  .addUint32(100000)    // Medium numbers
  .addUint64(1000000)   // Large numbers
  .addBool(true)        // Booleans
  .addAddress('0x...')  // Ethereum addresses
  .encrypt();
```

---

## 🔐 Decrypt Data (User Decryption)

```typescript
// Using the SDK directly (3 lines)
const result = await client.requestUserDecrypt(
  { handle: encryptedHandle, contractAddress },
  signer
);
console.log('Decrypted:', result.value);

// Using React hook (2 lines)
const { decrypt, result } = useUserDecrypt();
await decrypt(handle, contractAddress);
```

---

## 🌐 Framework Support

| Framework | Status | Lines to Setup |
|-----------|--------|----------------|
| React | ✅ Ready | 6 lines |
| Next.js | ✅ Ready | 6 lines |
| Vue.js | ✅ Compatible | 8 lines |
| Angular | ✅ Compatible | 8 lines |
| Node.js | ✅ Compatible | 5 lines |
| Vanilla JS | ✅ Compatible | 5 lines |

---

## 📚 Next Steps

1. **Read the full documentation:** [README.md](./README.md)
2. **Explore examples:** [packages/example-dapp/](./packages/example-dapp/)
3. **Watch video demo:** [VIDEO_DEMO_SCRIPT.md](./VIDEO_DEMO_SCRIPT.md)
4. **Deploy your app:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 Need Help?

- 📖 [Full Documentation](./README.md)
- 💬 [GitHub Issues](https://github.com/your-repo/issues)
- 🎮 [Live Demo](https://your-deployment-url.vercel.app)
- 📺 [Video Tutorial](https://youtube.com/watch?v=your-video)

---

**Built for developers, by developers.** ❤️

**Setup time:** < 1 minute | **Learning curve:** Minimal | **Power:** Maximum 🚀
