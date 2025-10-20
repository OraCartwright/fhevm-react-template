import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEncryptedInput, useUserDecrypt, useFhevmClient } from '@fhevm/react';
import { CONTRACT_ADDRESS, TOKEN_ABI } from '../config/contracts';

/**
 * Private Transfer Example
 *
 * Demonstrates:
 * - Encrypted ERC20-like token with euint64 balances
 * - Private transfers between addresses
 * - User can only decrypt their own balance
 * - Transfer amounts are encrypted (eaddress + euint64)
 */
export function PrivateTransfer() {
  const { address, isConnected } = useAccount();
  const { isInitialized, isInitializing } = useFhevmClient();
  const { createInput, encrypt, isEncrypting, error: encryptError } = useEncryptedInput();
  const { decrypt, isDecrypting, result, error: decryptError } = useUserDecrypt();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const { writeContract, data: hash, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle private transfer
  const handleTransfer = async () => {
    if (!recipientAddress || !amount) {
      alert('Please enter recipient address and amount');
      return;
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      alert('Invalid Ethereum address');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Create encrypted input with amount
      const input = createInput(CONTRACT_ADDRESS).addUint64(Math.floor(Number(amount) * 100)); // Store as cents

      // Encrypt
      const encrypted = await encrypt(input);
      if (!encrypted) return;

      // Submit encrypted transfer
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, encrypted.data, encrypted.inputProof],
      });

      setRecipientAddress('');
      setAmount('');
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  // Reveal my balance
  const handleRevealBalance = async () => {
    if (!address) return;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: 'revealMyBalance',
    });
  };

  // Mint tokens (for testing)
  const handleMint = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount to mint');
      return;
    }

    try {
      const input = createInput(CONTRACT_ADDRESS).addUint64(Math.floor(Number(amount) * 100));
      const encrypted = await encrypt(input);
      if (!encrypted) return;

      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: 'mint',
        args: [encrypted.data, encrypted.inputProof],
      });

      setAmount('');
    } catch (err) {
      console.error('Mint failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="text-6xl mb-4">💸</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to use private transfers
          </p>
          <w3m-button />
        </div>
      </div>
    );
  }

  if (!isInitialized && isInitializing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Initializing FHE Client...
          </h2>
          <p className="text-gray-300">
            Setting up encryption environment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scenario Description */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
        <h2 className="text-2xl font-bold text-white mb-3">
          💸 Private Token Transfers
        </h2>
        <p className="text-gray-200 mb-4">
          Transfer tokens with complete privacy. Balances and transfer amounts are encrypted on-chain. Only you can decrypt your own balance.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Encrypted balances
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Private transfers
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ addUint64() for amounts
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ User-only decryption
          </span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">
            Your Balance
          </h3>
          <button
            onClick={handleRevealBalance}
            disabled={isDecrypting || isConfirming}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            {isDecrypting ? '🔓 Revealing...' : '👁️ Reveal Balance'}
          </button>
        </div>

        {result ? (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm mb-2">Decrypted Balance</p>
            <p className="text-white text-4xl font-bold">
              {(Number(result.value) / 100).toFixed(2)}
            </p>
            <p className="text-gray-400 text-sm mt-2">Private Tokens</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-6xl mb-2">🔒</div>
            <p className="text-gray-400 text-sm">
              Your balance is encrypted on-chain
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Click "Reveal Balance" to decrypt
            </p>
          </div>
        )}
      </div>

      {/* Main Card - Transfer */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <h3 className="text-white font-semibold text-xl mb-6">
          Send Private Transfer
        </h3>

        {/* Error Messages */}
        {(encryptError || txError || decryptError) && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">
              {encryptError?.message || txError?.message || decryptError?.message}
            </p>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm">
              ✅ Transaction successful! Transfer completed privately.
            </p>
          </div>
        )}

        {/* Recipient Address */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            disabled={isEncrypting || isConfirming}
          />
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Amount (Will be encrypted)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (e.g., 100.00)"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isEncrypting || isConfirming}
          />
          <p className="text-gray-400 text-xs mt-2">
            The amount will be encrypted before the transfer. The recipient won't see how much they received unless they decrypt.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleTransfer}
            disabled={isEncrypting || isConfirming || !recipientAddress || !amount}
            className="py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isEncrypting ? (
              <>
                <span className="animate-spin">🔒</span>
                <span>Encrypting...</span>
              </>
            ) : isConfirming ? (
              <>
                <span className="animate-pulse">⏳</span>
                <span>Transferring...</span>
              </>
            ) : (
              <>
                <span>💸</span>
                <span>Send Private Transfer</span>
              </>
            )}
          </button>

          <button
            onClick={handleMint}
            disabled={isEncrypting || isConfirming || !amount}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isEncrypting ? (
              <>
                <span className="animate-spin">🔒</span>
                <span>Encrypting...</span>
              </>
            ) : isConfirming ? (
              <>
                <span className="animate-pulse">⏳</span>
                <span>Minting...</span>
              </>
            ) : (
              <>
                <span>🪙</span>
                <span>Mint Tokens (Test)</span>
              </>
            )}
          </button>
        </div>

        {/* Transaction Hash */}
        {hash && (
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-300 text-sm font-medium mb-2">
              Transaction Hash:
            </p>
            <p className="text-white text-xs font-mono break-all">
              {hash}
            </p>
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
            >
              View on Etherscan →
            </a>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">
          🔐 How It Works
        </h3>
        <div className="space-y-3">
          <Step
            number="1"
            title="Encrypted Balance Storage"
            description="All user balances are stored as encrypted euint64 values on the blockchain."
          />
          <Step
            number="2"
            title="Private Transfer Submission"
            description="Transfer amounts are encrypted on your device before being submitted to the smart contract."
          />
          <Step
            number="3"
            title="Homomorphic Balance Updates"
            description="The contract updates balances using FHE operations (TFHE.sub and TFHE.add) without decryption."
          />
          <Step
            number="4"
            title="User-Only Decryption"
            description="Only you can decrypt your balance using your private key and EIP-712 signature."
          />
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">
          💻 Code Example
        </h3>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
          <code className="text-green-400">{`// Encrypt transfer amount
const amountInCents = Math.floor(amount * 100);
const input = createInput(contractAddress).addUint64(amountInCents);
const encrypted = await encrypt(input);

// Submit private transfer
await contract.transfer(
  recipientAddress,
  encrypted.data,
  encrypted.inputProof
);

// Smart contract updates balances homomorphically
// balances[from] = TFHE.sub(balances[from], amount);
// balances[to] = TFHE.add(balances[to], amount);`}</code>
        </pre>
      </div>

      {/* Privacy Features */}
      <div className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
        <h3 className="text-green-300 font-semibold text-lg mb-3 flex items-center gap-2">
          <span>🔒</span>
          <span>Privacy Features</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">🙈 Hidden Balances</h4>
            <p className="text-gray-300 text-sm">
              All balances are encrypted. No one can see how many tokens anyone has.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">🤫 Secret Transfers</h4>
            <p className="text-gray-300 text-sm">
              Transfer amounts are encrypted. Only sender and recipient know the amount.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">🔑 Owner Control</h4>
            <p className="text-gray-300 text-sm">
              Only you can decrypt your balance with your signature.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">⚡ On-Chain Compute</h4>
            <p className="text-gray-300 text-sm">
              Balance calculations happen on encrypted data directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Component
interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="text-white font-medium mb-1">{title}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}
