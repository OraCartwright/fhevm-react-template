'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { createFhevmClient } from '@fhevm/sdk';

/**
 * Next.js Example - Encrypted Counter with FHEVM SDK
 *
 * This example demonstrates:
 * 1. Client initialization
 * 2. Encrypted input creation
 * 3. Smart contract interaction
 * 4. User decryption with EIP-712 signatures
 */

const CONTRACT_ADDRESS = '0x...'; // Replace with your deployed contract
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "einput", "name": "encryptedAmount", "type": "bytes32" },
      { "internalType": "bytes", "name": "inputProof", "type": "bytes" }
    ],
    "name": "incrementBy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestUserDecrypt",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [value, setValue] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState('');

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Initialize FHEVM client
  const initClient = async () => {
    try {
      const fhevmClient = createFhevmClient({
        network: {
          chainId: 11155111, // Sepolia
          name: 'Sepolia',
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
        },
      });

      await fhevmClient.init();
      setClient(fhevmClient);
    } catch (err) {
      setError('Failed to initialize FHE client');
      console.error(err);
    }
  };

  // Handle increment with encrypted value
  const handleIncrement = async () => {
    if (!client) {
      await initClient();
      return;
    }

    if (!value || isNaN(Number(value))) {
      setError('Please enter a valid number');
      return;
    }

    try {
      setIsEncrypting(true);
      setError('');

      // Create encrypted input
      const input = client
        .createEncryptedInput(CONTRACT_ADDRESS)
        .addUint32(Number(value));

      // Encrypt
      const encrypted = await input.encrypt();

      // Submit to contract
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'incrementBy',
        args: [encrypted.data, encrypted.inputProof],
      });

      setValue('');
    } catch (err: any) {
      setError(err.message || 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  // Request user decryption
  const handleReveal = async () => {
    if (!client) {
      setError('Client not initialized');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'requestUserDecrypt',
      });
    } catch (err: any) {
      setError(err.message || 'Decryption request failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            FHEVM SDK - Next.js Example
          </h1>
          <p className="text-xl text-gray-300">
            Encrypted Counter with Fully Homomorphic Encryption
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-white text-lg mb-4">
                Please connect your wallet to continue
              </p>
              <w3m-button />
            </div>
          ) : (
            <>
              {/* Connected Status */}
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-300 text-sm">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Value to Increment (Encrypted)
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter a number (e.g., 10)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isEncrypting || isConfirming}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleIncrement}
                  disabled={isEncrypting || isConfirming || !value}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isEncrypting
                    ? '🔒 Encrypting...'
                    : isConfirming
                    ? '⏳ Confirming...'
                    : '➕ Increment (Encrypted)'}
                </button>

                <button
                  onClick={handleReveal}
                  disabled={isConfirming}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isConfirming ? '⏳ Requesting...' : '👁️ Reveal My Value'}
                </button>
              </div>

              {/* Transaction Status */}
              {hash && (
                <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <p className="text-blue-300 text-sm mb-2">
                    Transaction Hash:
                  </p>
                  <p className="text-white text-xs font-mono break-all">
                    {hash}
                  </p>
                </div>
              )}

              {/* Info Section */}
              <div className="mt-8 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                <h3 className="text-white font-semibold mb-2">
                  🔐 How It Works
                </h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>
                    • Your value is encrypted <strong>client-side</strong>{' '}
                    before leaving your device
                  </li>
                  <li>
                    • The blockchain only sees <strong>encrypted data</strong>
                  </li>
                  <li>
                    • Only you can decrypt your value using an{' '}
                    <strong>EIP-712 signature</strong>
                  </li>
                  <li>
                    • The smart contract performs operations on{' '}
                    <strong>encrypted data</strong>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-white font-semibold mb-2">
              Client-Side Encryption
            </h3>
            <p className="text-gray-300 text-sm">
              Data encrypted before leaving your device using FHEVM SDK
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-white font-semibold mb-2">
              Homomorphic Operations
            </h3>
            <p className="text-gray-300 text-sm">
              Smart contracts compute on encrypted data without decryption
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🔑</div>
            <h3 className="text-white font-semibold mb-2">
              User-Controlled Decryption
            </h3>
            <p className="text-gray-300 text-sm">
              Only you can decrypt your data with EIP-712 signatures
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
