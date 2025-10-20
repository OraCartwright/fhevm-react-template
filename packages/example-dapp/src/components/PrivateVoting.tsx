import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEncryptedInput, useUserDecrypt, useFhevmClient } from '@fhevm/react';
import { CONTRACT_ADDRESS, VOTING_ABI } from '../config/contracts';

/**
 * Private Voting Example
 *
 * Demonstrates:
 * - Encrypted vote submission with ebool
 * - Multiple voting options
 * - Public result tallying after voting ends
 * - Zero-knowledge voting (no one can see how you voted)
 */
export function PrivateVoting() {
  const { address, isConnected } = useAccount();
  const { isInitialized, isInitializing } = useFhevmClient();
  const { createInput, encrypt, isEncrypting, error: encryptError } = useEncryptedInput();
  const { decrypt, isDecrypting, result, error: decryptError } = useUserDecrypt();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { writeContract, data: hash, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const votingOptions = [
    { id: 0, name: 'Option A', description: 'Implement feature X', icon: '🅰️' },
    { id: 1, name: 'Option B', description: 'Improve performance Y', icon: '🅱️' },
    { id: 2, name: 'Option C', description: 'Add integration Z', icon: '©️' },
  ];

  // Handle vote submission
  const handleVote = async () => {
    if (selectedOption === null) {
      alert('Please select an option to vote');
      return;
    }

    try {
      // Create encrypted boolean votes for each option
      const input = createInput(CONTRACT_ADDRESS);

      // Add encrypted boolean for each option (true for selected, false for others)
      votingOptions.forEach((option) => {
        input.addBool(option.id === selectedOption);
      });

      // Encrypt
      const encrypted = await encrypt(input);
      if (!encrypted) return;

      // Submit encrypted vote
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VOTING_ABI,
        functionName: 'castVote',
        args: [encrypted.data, encrypted.inputProof],
      });

      setSelectedOption(null);
    } catch (err) {
      console.error('Vote submission failed:', err);
    }
  };

  // Request to reveal results (only after voting ends)
  const handleRevealResults = async () => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: VOTING_ABI,
      functionName: 'revealResults',
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="text-6xl mb-4">🗳️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to participate in private voting
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
      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-3">
          🗳️ Private Voting System
        </h2>
        <p className="text-gray-200 mb-4">
          Cast your vote with complete privacy. Your vote is encrypted on your device and no one - not even the contract owner - can see how you voted until results are revealed.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Zero-knowledge voting
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ addBool() encryption
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Tallying on encrypted data
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Public result revelation
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
              ✅ Vote submitted successfully! Your vote is encrypted on-chain.
            </p>
          </div>
        )}

        {/* Voting Options */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-4">
            Select Your Vote (Will be encrypted)
          </label>
          <div className="space-y-3">
            {votingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={isEncrypting || isConfirming}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {option.name}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {option.description}
                    </p>
                  </div>
                  {selectedOption === option.id && (
                    <span className="text-blue-400 text-xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-3">
            Your selection will be encrypted before being sent to the blockchain. No one can see your vote.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleVote}
            disabled={isEncrypting || isConfirming || selectedOption === null}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isEncrypting ? (
              <>
                <span className="animate-spin">🔒</span>
                <span>Encrypting Vote...</span>
              </>
            ) : isConfirming ? (
              <>
                <span className="animate-pulse">⏳</span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>🗳️</span>
                <span>Submit Encrypted Vote</span>
              </>
            )}
          </button>

          <button
            onClick={handleRevealResults}
            disabled={isDecrypting || isConfirming}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isDecrypting ? (
              <>
                <span className="animate-spin">🔓</span>
                <span>Revealing...</span>
              </>
            ) : (
              <>
                <span>📊</span>
                <span>Reveal Results</span>
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

        {/* Results Display */}
        {result && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm font-medium mb-3">
              📊 Voting Results:
            </p>
            <div className="space-y-2">
              {votingOptions.map((option, idx) => (
                <div key={option.id} className="flex items-center justify-between">
                  <span className="text-white">
                    {option.icon} {option.name}
                  </span>
                  <span className="text-white font-bold text-lg">
                    {/* Assuming result.value is an array of vote counts */}
                    {Array.isArray(result.value) ? result.value[idx]?.toString() || '0' : '0'} votes
                  </span>
                </div>
              ))}
            </div>
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
            title="Encrypted Vote Submission"
            description="Your vote is encrypted using FHE on your device. You create encrypted booleans for each option."
          />
          <Step
            number="2"
            title="On-Chain Storage"
            description="Encrypted votes are stored on the blockchain. No one can see individual votes."
          />
          <Step
            number="3"
            title="Homomorphic Tallying"
            description="The smart contract tallies votes using FHE operations without ever decrypting individual votes."
          />
          <Step
            number="4"
            title="Public Result Revelation"
            description="After voting ends, only the final tallied results are decrypted and made public."
          />
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">
          💻 Code Example
        </h3>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
          <code className="text-green-400">{`// Cast encrypted vote
const input = createInput(contractAddress);

// Encrypt each option (true for selected, false for others)
votingOptions.forEach(option => {
  input.addBool(option.id === selectedOption);
});

const encrypted = await encrypt(input);

// Submit to contract
await contract.castVote(
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
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="text-white font-medium mb-1">{title}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}
