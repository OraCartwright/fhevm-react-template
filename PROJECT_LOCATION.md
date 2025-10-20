# 📍 Project Location & Structure

## 🗂️ Project Root

**Absolute Path:** `D:\fhevm-react-template\`

This is the main project directory containing the FHEVM SDK competition submission.

---

## 📦 Directory Structure

### Core Packages (`packages/`)

#### 1. Core SDK
**Path:** `D:\fhevm-react-template\packages\fhevm-sdk\`
- **Purpose:** Framework-agnostic FHEVM SDK
- **Usage:** Can be used with any JavaScript framework
- **Entry Point:** `src/index.ts`

#### 2. React Hooks
**Path:** `D:\fhevm-react-template\packages\fhevm-react\`
- **Purpose:** React-specific hooks and providers
- **Usage:** Optional layer for React applications
- **Entry Point:** `src/index.tsx`

#### 3. Smart Contracts
**Path:** `D:\fhevm-react-template\packages\contracts\`
- **Purpose:** Solidity smart contracts with FHE
- **Contracts:**
  - `ConfidentialCounter.sol`
  - `PrivateVoting.sol`
  - `SealedBidAuction.sol`
  - `PrivateERC20.sol`

#### 4. Example dApp (Vite + React)
**Path:** `D:\fhevm-react-template\packages\example-dapp\`
- **Purpose:** Main demonstration application
- **Features:** 4 complete scenarios
  - 🔢 Encrypted Counter
  - 🗳️ Private Voting
  - 🏆 Sealed Auction
  - 💸 Private Transfers
- **Run:** `cd packages\example-dapp && npm run dev`

### Example Templates (`examples/`)

#### Next.js Template (Required for Competition)
**Path:** `D:\fhevm-react-template\examples\nextjs-template\`
- **Purpose:** Next.js 14 App Router template
- **Features:** Encrypted Counter showcase
- **Run:** `cd examples\nextjs-template && npm run dev`

### Documentation Files (Root)

| File | Location | Purpose |
|------|----------|---------|
| `README.md` | Root | Main project documentation |
| `QUICKSTART.md` | Root | < 10 lines quick start guide |
| `DEPLOYMENT.md` | Root | Deployment instructions |
| `SUBMISSION_CHECKLIST.md` | Root | Competition submission checklist |
| `VIDEO_DEMO_SCRIPT.md` | Root | Video demonstration script |
| `GETTING_STARTED.md` | Root | Step-by-step tutorial |
| `PROJECT_LOCATION.md` | Root | This file |

---

## 🚀 Quick Navigation Commands

### Windows Command Prompt / PowerShell

```cmd
:: Navigate to project root
cd D:\fhevm-react-template

:: Navigate to Vite + React example
cd D:\fhevm-react-template\packages\example-dapp

:: Navigate to Next.js template
cd D:\fhevm-react-template\examples\nextjs-template

:: Navigate to contracts
cd D:\fhevm-react-template\packages\contracts

:: Navigate to core SDK
cd D:\fhevm-react-template\packages\fhevm-sdk

:: Navigate to React hooks
cd D:\fhevm-react-template\packages\fhevm-react
```

### Git Bash / Unix-style shells

```bash
# Navigate to project root
cd /d/zamadapp/dapp124/fhevm-react-template

# Navigate to Vite + React example
cd /d/zamadapp/dapp124/fhevm-react-template/packages/example-dapp

# Navigate to Next.js template
cd /d/zamadapp/dapp124/fhevm-react-template/examples/nextjs-template
```

---

## 📂 File Counts

### Total Files by Category

| Category | Count | Location |
|----------|-------|----------|
| TypeScript Files | ~50 | packages/fhevm-sdk, fhevm-react, example-dapp |
| React Components | 4 | packages/example-dapp/src/components/ |
| Solidity Contracts | 4 | packages/contracts/contracts/ |
| Documentation | 7 | Root directory |
| Configuration | ~10 | Various package.json, tsconfig.json, etc. |

---

## 🔗 Related Directories

### Outside fhevm-react-template

There's also a Next.js template at:
**Path:** `D:\examples\nextjs-template\`

**Note:** This is a duplicate. The primary Next.js template is in:
`D:\fhevm-react-template\examples\nextjs-template\`

---

## 🎯 For Competition Judges

**Primary Submission Location:**
```
D:\fhevm-react-template\
```

**Key Files to Review:**
1. `README.md` - Project overview
2. `QUICKSTART.md` - Quick start guide
3. `packages/example-dapp/` - Main demonstration (4 scenarios)
4. `examples/nextjs-template/` - Next.js showcase (required)
5. `packages/fhevm-sdk/` - Core SDK implementation
6. `SUBMISSION_CHECKLIST.md` - Competition requirements checklist

---

## 📊 Directory Size Estimates

| Directory | Approximate Size | Notes |
|-----------|------------------|-------|
| `node_modules/` | ~500-800 MB | After npm install |
| `packages/` | ~5-10 MB | Source code only |
| `examples/` | ~2-5 MB | Source code only |
| Documentation | ~500 KB | All .md files |

---

## ⚙️ Installation from Scratch

If you need to set up the project from this location:

```bash
# 1. Navigate to project
cd D:\fhevm-react-template

# 2. Install all dependencies (monorepo)
npm install

# 3. Build all packages
npm run build

# 4. Run Vite + React example
cd packages\example-dapp
npm run dev

# OR run Next.js example
cd D:\fhevm-react-template\examples\nextjs-template
npm run dev
```

---

## 🔍 Finding Specific Features

### Where to find encryption logic?
- **Core SDK:** `packages/fhevm-sdk/src/encryption/`
- **React Hook:** `packages/fhevm-react/src/hooks/useEncryptedInput.ts`

### Where to find decryption logic?
- **Core SDK:** `packages/fhevm-sdk/src/decryption/`
- **React Hook:** `packages/fhevm-react/src/hooks/useUserDecrypt.ts`

### Where to find example usage?
- **4 Scenarios:** `packages/example-dapp/src/components/`
- **Next.js Example:** `examples/nextjs-template/app/page.tsx`

### Where to find smart contracts?
- **All Contracts:** `packages/contracts/contracts/`
- **Deploy Script:** `packages/contracts/scripts/deploy.ts`

---

## 🆘 Troubleshooting

### "Cannot find module" errors
**Solution:** Make sure you're in the correct directory and dependencies are installed:
```bash
cd D:\fhevm-react-template
npm install
```

### "Port already in use"
**Check running servers:**
- Vite usually runs on port 5173
- Next.js runs on port 3000
- Kill other processes or change ports in config

### Path not found errors
**Verify path:**
```cmd
dir D:\fhevm-react-template
```

If directory doesn't exist, check:
- Drive letter (D: vs C:)
- Spelling of directories
- Permissions

---

## 📝 Notes for Developers

1. **Working Directory:** Always start from `D:\fhevm-react-template\`
2. **Relative Paths:** All documentation uses relative paths from project root
3. **Monorepo:** Use `npm install` from root to install all package dependencies
4. **Workspace References:** Packages use `workspace:*` for internal dependencies

---

**Last Updated:** 2025-01-19

**Project Status:** ✅ Complete and ready for competition submission
