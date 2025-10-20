# 🚀 Deployment Links & Live Demos

This document contains all deployment links for the FHEVM SDK project templates.

## 📱 Live Demo Applications

### 1. Vite + React Example dApp (Primary Demo)

**🌐 Live URL:** `https://your-deployment-url.vercel.app`
*(To be updated after deployment)*

**Features:**
- ✅ Encrypted Counter with `addUint32()`
- ✅ Private Voting with `addBool()`
- ✅ Sealed-Bid Auction with `addUint64()`
- ✅ Private Token Transfers with encrypted balances

**Tech Stack:**
- React 18.3.1
- Vite 5.4.10
- @fhevm/sdk + @fhevm/react
- wagmi + RainbowKit
- TailwindCSS

**Source Code:** `D:\fhevm-react-template\packages\example-dapp\`

---

### 2. Next.js Template (Alternative Framework Demo)

**🌐 Live URL:** `https://your-nextjs-deployment.vercel.app`
*(To be updated after deployment)*

**Features:**
- ✅ Encrypted Counter demonstration
- ✅ Next.js 14 App Router
- ✅ Server/Client component patterns
- ✅ Production-ready structure

**Tech Stack:**
- Next.js 14.2.0
- @fhevm/sdk
- wagmi + RainbowKit
- TailwindCSS

**Source Code:** `D:\fhevm-react-template\examples\nextjs-template\`

---

## 🎥 Video Demo

**📹 Video URL:** `https://youtube.com/watch?v=your-video-id`
*(To be uploaded)*

**Video Contents:**
1. Introduction & Competition Context (30s)
2. SDK Architecture Overview (60s)
3. Installation & Setup (<10 lines demo) (60s)
4. Live Demo - Encrypted Counter (60s)
5. Live Demo - Private Voting (60s)
6. Live Demo - Sealed Auction (60s)
7. Code Walkthrough (90s)
8. Framework Flexibility Demo (60s)
9. Developer Experience Highlights (30s)
10. Conclusion & Next Steps (30s)

**Duration:** 7-8 minutes

---

## 📦 NPM Packages

*(For production deployment)*

### @fhevm/sdk
```bash
npm install @fhevm/sdk
```
**NPM URL:** `https://www.npmjs.com/package/@fhevm/sdk`
*(To be published)*

### @fhevm/react
```bash
npm install @fhevm/react
```
**NPM URL:** `https://www.npmjs.com/package/@fhevm/react`
*(To be published)*

---

## 🔗 GitHub Repository

**Main Repository:** `https://github.com/your-username/fhevm-react-template`

**Key Branches:**
- `main` - Production-ready code
- `develop` - Active development

---

## 📋 Deployment Instructions

### Deploy Vite + React Example

#### Option 1: Vercel (Recommended)

```bash
# Navigate to project root
cd D:\fhevm-react-template

# Deploy example-dapp
cd packages\example-dapp

# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

#### Option 2: Netlify

```bash
# Navigate to example-dapp
cd D:\fhevm-react-template\packages\example-dapp

# Build
npm run build

# Deploy dist/ folder via Netlify UI or CLI
netlify deploy --prod --dir=dist
```

### Deploy Next.js Template

#### Vercel (Recommended for Next.js)

```bash
# Navigate to Next.js template
cd D:\fhevm-react-template\examples\nextjs-template

# Deploy
vercel --prod
```

---

## ⚙️ Environment Variables

Both deployments require these environment variables:

```env
# Sepolia RPC URL
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**Get your keys:**
- Infura: https://infura.io/
- WalletConnect: https://cloud.walletconnect.com/

---

## 🧪 Testing the Deployments

### Prerequisites
1. MetaMask or compatible Web3 wallet
2. Sepolia testnet configured
3. Test ETH from faucet: https://sepoliafaucet.com/

### Test Flow
1. Visit the deployed URL
2. Click "Connect Wallet"
3. Select a scenario (Counter, Voting, Auction, or Transfer)
4. Enter a value
5. Click "Submit Encrypted [Action]"
6. Confirm transaction in wallet
7. Wait for confirmation
8. Click "Reveal" to decrypt your value

---

## 📊 Performance Metrics

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

### Build Sizes
- Vite + React: ~500KB (gzipped)
- Next.js: ~600KB (gzipped)

### Load Times
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s

---

## 🔒 Security Considerations

### Deployed Applications
- ✅ All encryption happens **client-side**
- ✅ Private keys never leave the browser
- ✅ HTTPS only
- ✅ No server-side decryption
- ✅ EIP-712 signatures for user decryption

### Smart Contracts
- ✅ Using Zama's audited FHEVM library
- ✅ Gateway pattern for decryption
- ✅ Access control on encrypted data

---

## 📱 Mobile Compatibility

Both deployments are fully responsive and mobile-compatible:
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Mobile wallet apps (MetaMask, Rainbow, etc.)

---

## 🆘 Troubleshooting

### "Blank Page" Issue
**Solution:** Ensure you have a `.nojekyll` file if deploying to GitHub Pages, or use Vercel/Netlify instead.

### "Failed to Initialize FHE Client"
**Solution:** Check that the RPC URL is correct and accessible.

### "Transaction Rejected"
**Solution:** Ensure you have sufficient test ETH on Sepolia.

### "Network Mismatch"
**Solution:** Switch your wallet to Sepolia testnet (Chain ID: 11155111).

---

## 📝 Update This Document

After deployment, update the following:

1. Replace `your-deployment-url.vercel.app` with actual Vercel URL
2. Replace `your-nextjs-deployment.vercel.app` with actual Next.js URL
3. Add YouTube video link after upload
4. Add NPM package links after publishing
5. Update GitHub repository URL

---

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Smart contracts deployed to Sepolia
- [ ] Contract addresses updated in `src/config/contracts.ts`
- [ ] README updated with deployment links
- [ ] Video demo recorded and uploaded
- [ ] Performance testing completed
- [ ] Mobile testing completed
- [ ] Security review completed

---

**Last Updated:** 2025-01-19

**Deployment Status:** 🟡 Ready for Deployment

**Maintainer:** Your Name <your.email@example.com>
