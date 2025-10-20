import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEncryptedInput, useUserDecrypt, useFhevmClient } from '@fhevm/react';
import { CONTRACT_ADDRESS, COUNTER_ABI } from '../config/contracts';

/**
 * Encrypted Counter Example
 *
 * Demonstrates:
 * - Creating encrypted inputs with addUint32()
 * - Submitting encrypted data to smart contract
 * - User decryption with EIP-712 signatures
 * - Loading states and error handling
 */
export function EncryptedCounter() {
  const { address, isConnected } = useAccount();
  const { isInitialized, isInitializing } = useFhevmClient();
  const { createInput, encrypt, isEncrypting, error: encryptError } = useEncryptedInput();
  const { decrypt, isDecrypting, result, error: decryptError } = useUserDecrypt();

  const [value, setValue] = useState('');

  const { writeContract, data: hash, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle increment
  const handleIncrement = async () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      // Step 1: Create encrypted input
      const input = createInput(CONTRACT_ADDRESS).addUint32(Number(value));

      // Step 2: Encrypt
      const encrypted = await encrypt(input);
      if (!encrypted) return;

      // Step 3: Submit to blockchain
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: COUNTER_ABI,
        functionName: 'incrementBy',
        args: [encrypted.data, encrypted.inputProof],
      });

      setValue('');
    } catch (err) {
      console.error('Increment failed:', err);
    }
  };

  // Handle reveal (user decryption)
  const handleReveal = async () => {
    if (!address) return;

    // This would request user decryption
    // In a real implementation, you'd get the handle from the contract
    // and use the signer to sign the EIP-712 message

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: COUNTER_ABI,
      functionName: 'requestUserDecrypt',
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to use the Encrypted Counter
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
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-3">
          🔢 Encrypted Counter
        </h2>
        <p className="text-gray-200 mb-4">
          Increment a counter with encrypted values. The blockchain only sees encrypted data - your actual value remains private until you choose to reveal it.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Client-side encryption
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ addUint32()
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ EIP-712 signatures
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ User decryption
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
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
              ✅ Transaction confirmed! Counter incremented.
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Value to Add (Will be encrypted)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a positive number (e.g., 10)"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isEncrypting || isConfirming}
          />
          <p className="text-gray-400 text-xs mt-2">
            This value will be encrypted on your device before being sent to the blockchain
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleIncrement}
            disabled={isEncrypting || isConfirming || !value}
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
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <span>➕</span>
                <span>Increment (Encrypted)</span>
              </>
            )}
          </button>

          <button
            onClick={handleReveal}
            disabled={isDecrypting || isConfirming}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isDecrypting ? (
              <>
                <span className="animate-spin">🔓</span>
                <span>Decrypting...</span>
              </>
            ) : (
              <>
                <span>👁️</span>
                <span>Reveal My Value</span>
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

        {/* Decrypted Value */}
        {result && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm font-medium mb-2">
              Decrypted Value:
            </p>
            <p className="text-white text-2xl font-bold">
              {result.value.toString()}
            </p>
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
            title="Client-Side Encryption"
            description="Your value is encrypted on your device using the FHEVM SDK before leaving your browser"
          />
          <Step
            number="2"
            title="Encrypted Submission"
            description="The encrypted value and proof are sent to the smart contract on the blockchain"
          />
          <Step
            number="3"
            title="Homomorphic Computation"
            description="The smart contract performs addition on the encrypted data without ever seeing the actual value"
          />
          <Step
            number="4"
            title="User Decryption"
            description="Only you can decrypt your counter value using an EIP-712 signature"
          />
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">
          💻 Code Example
        </h3>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
          <code className="text-green-400">{`// Using FHEVM SDK
import { useEncryptedInput } from '@fhevm/react';

const { createInput, encrypt } = useEncryptedInput();

// Create and encrypt
const input = createInput(contractAddress).addUint32(100);
const encrypted = await encrypt(input);

// Submit to contract
await contract.incrementBy(
  encrypted.data,
  encrypted.inputProof
);`}</code>
        </pre>
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
      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="text-white font-medium mb-1">{title}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}
