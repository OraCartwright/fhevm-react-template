import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEncryptedInput, useUserDecrypt, useFhevmClient } from '@fhevm/react';
import { CONTRACT_ADDRESS, AUCTION_ABI } from '../config/contracts';

/**
 * Confidential Auction Example
 *
 * Demonstrates:
 * - Sealed-bid auction with euint64
 * - Encrypted bid comparison using FHE.ge
 * - Winner determination without revealing losing bids
 * - Only winner's bid is revealed at auction end
 */
export function ConfidentialAuction() {
  const { address, isConnected } = useAccount();
  const { isInitialized, isInitializing } = useFhevmClient();
  const { createInput, encrypt, isEncrypting, error: encryptError } = useEncryptedInput();
  const { decrypt, isDecrypting, result, error: decryptError } = useUserDecrypt();

  const [bidAmount, setBidAmount] = useState('');
  const [auctionItem] = useState({
    name: 'Rare NFT Artwork',
    description: 'Limited edition digital artwork by renowned artist',
    imageUrl: '🖼️',
    minBid: '0.1 ETH',
    endTime: '24 hours',
  });

  const { writeContract, data: hash, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle bid submission
  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    try {
      // Convert ETH to wei (multiply by 10^18)
      const bidInWei = Math.floor(Number(bidAmount) * 1e18);

      // Create encrypted input with uint64 (sufficient for reasonable bid amounts)
      const input = createInput(CONTRACT_ADDRESS).addUint64(bidInWei);

      // Encrypt
      const encrypted = await encrypt(input);
      if (!encrypted) return;

      // Submit encrypted bid
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: 'placeBid',
        args: [encrypted.data, encrypted.inputProof],
      });

      setBidAmount('');
    } catch (err) {
      console.error('Bid submission failed:', err);
    }
  };

  // End auction and reveal winner
  const handleEndAuction = async () => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: 'endAuction',
    });
  };

  // Get my bid back
  const handleRevealMyBid = async () => {
    if (!address) return;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: 'revealMyBid',
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to participate in the sealed-bid auction
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
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
        <h2 className="text-2xl font-bold text-white mb-3">
          🏆 Sealed-Bid Auction
        </h2>
        <p className="text-gray-200 mb-4">
          Place encrypted bids on auction items. Your bid amount stays completely private until the auction ends. Only the winning bid is revealed.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Sealed bids
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ addUint64() encryption
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ FHE bid comparison
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">
            ✅ Selective decryption
          </span>
        </div>
      </div>

      {/* Auction Item Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="text-center mb-4">
          <div className="text-8xl mb-4">{auctionItem.imageUrl}</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {auctionItem.name}
          </h3>
          <p className="text-gray-300 mb-4">
            {auctionItem.description}
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-gray-400">Minimum Bid:</span>
              <span className="text-white font-semibold ml-2">{auctionItem.minBid}</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-gray-400">Ends In:</span>
              <span className="text-white font-semibold ml-2">{auctionItem.endTime}</span>
            </div>
          </div>
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
              ✅ Bid submitted successfully! Your bid is sealed and encrypted on-chain.
            </p>
          </div>
        )}

        {/* Bid Input Section */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Your Bid Amount (ETH) - Will be encrypted
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount (e.g., 1.5)"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isEncrypting || isConfirming}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              ETH
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Your bid will be encrypted before being sent. No one can see your bid amount until auction ends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={handlePlaceBid}
            disabled={isEncrypting || isConfirming || !bidAmount}
            className="py-3 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isEncrypting ? (
              <>
                <span className="animate-spin">🔒</span>
                <span>Encrypting...</span>
              </>
            ) : isConfirming ? (
              <>
                <span className="animate-pulse">⏳</span>
                <span>Placing...</span>
              </>
            ) : (
              <>
                <span>🔨</span>
                <span>Place Sealed Bid</span>
              </>
            )}
          </button>

          <button
            onClick={handleRevealMyBid}
            disabled={isDecrypting || isConfirming}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isDecrypting ? (
              <>
                <span className="animate-spin">🔓</span>
                <span>Revealing...</span>
              </>
            ) : (
              <>
                <span>👁️</span>
                <span>View My Bid</span>
              </>
            )}
          </button>

          <button
            onClick={handleEndAuction}
            disabled={isConfirming}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isConfirming ? (
              <>
                <span className="animate-pulse">⏳</span>
                <span>Ending...</span>
              </>
            ) : (
              <>
                <span>🏁</span>
                <span>End Auction</span>
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

        {/* My Bid Display */}
        {result && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm font-medium mb-2">
              Your Decrypted Bid:
            </p>
            <p className="text-white text-2xl font-bold">
              {(Number(result.value) / 1e18).toFixed(4)} ETH
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
            title="Sealed Bid Submission"
            description="Your bid amount is encrypted on your device using FHE before being submitted to the blockchain."
          />
          <Step
            number="2"
            title="Encrypted Comparison"
            description="The smart contract compares bids using FHE operations (FHE.ge) without ever decrypting them."
          />
          <Step
            number="3"
            title="Winner Determination"
            description="The contract determines the highest bid using homomorphic comparison operations."
          />
          <Step
            number="4"
            title="Selective Revelation"
            description="Only the winning bid is decrypted and revealed. Losing bids remain private forever."
          />
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">
          💻 Code Example
        </h3>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
          <code className="text-green-400">{`// Place sealed bid
const bidInWei = Math.floor(bidAmount * 1e18);
const input = createInput(contractAddress).addUint64(bidInWei);
const encrypted = await encrypt(input);

// Submit encrypted bid
await contract.placeBid(
  encrypted.data,
  encrypted.inputProof
);

// Smart contract compares bids without decryption
// euint64 highestBid = TFHE.ge(newBid, currentHighest)
//   ? newBid : currentHighest;`}</code>
        </pre>
      </div>

      {/* Privacy Notice */}
      <div className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
        <h3 className="text-yellow-300 font-semibold text-lg mb-3 flex items-center gap-2">
          <span>⚠️</span>
          <span>Privacy Guarantee</span>
        </h3>
        <ul className="text-gray-200 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Your bid amount is encrypted before leaving your browser</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>No one can see your bid during the auction - not even the contract owner</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Only you can decrypt your own bid using your signature</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Losing bids are never revealed to anyone</span>
          </li>
        </ul>
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
      <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="text-white font-medium mb-1">{title}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}
