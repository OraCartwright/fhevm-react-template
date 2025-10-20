/**
 * Contract Addresses and ABIs
 *
 * Replace these placeholder addresses with your deployed contract addresses
 */

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Encrypted Counter Contract ABI
export const COUNTER_ABI = [
  {
    inputs: [
      { internalType: 'einput', name: 'encryptedAmount', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
    ],
    name: 'incrementBy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requestUserDecrypt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestId', type: 'uint256' },
      { internalType: 'uint256', name: 'decryptedValue', type: 'uint256' },
    ],
    name: 'callbackUserDecrypt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCounter',
    outputs: [{ internalType: 'euint32', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Private Voting Contract ABI
export const VOTING_ABI = [
  {
    inputs: [
      { internalType: 'einput', name: 'encryptedVotes', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revealResults',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'optionId', type: 'uint256' }],
    name: 'getVoteCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hasVoted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingEnded',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Confidential Auction Contract ABI
export const AUCTION_ABI = [
  {
    inputs: [
      { internalType: 'einput', name: 'encryptedBid', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
    ],
    name: 'placeBid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'endAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revealMyBid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWinningBid',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWinner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'auctionEnded',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Private Token Contract ABI
export const TOKEN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'einput', name: 'encryptedAmount', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'einput', name: 'encryptedAmount', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revealMyBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'euint64', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Network Configuration
 */
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  name: 'Sepolia Testnet',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  blockExplorer: 'https://sepolia.etherscan.io',
};

/**
 * Gateway Contract Address (for decryption)
 */
export const GATEWAY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual gateway address
