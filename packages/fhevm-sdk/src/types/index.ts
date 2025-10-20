import type { FhevmInstance } from 'fhevmjs';
import type { Provider, Signer } from 'ethers';

/**
 * FHEVM SDK Configuration
 */
export interface FhevmConfig {
  /** Network to connect to */
  network: NetworkConfig;
  /** ACL contract address */
  aclAddress?: string;
  /** KMS verifier contract address */
  kmsVerifierAddress?: string;
  /** Gateway contract address */
  gatewayAddress?: string;
}

/**
 * Network Configuration
 */
export interface NetworkConfig {
  /** Chain ID */
  chainId: number;
  /** Network name */
  name: string;
  /** RPC URL */
  rpcUrl: string;
  /** Public key for encryption */
  publicKey?: string;
}

/**
 * Encrypted Input for contract calls
 */
export interface EncryptedInput {
  /** Encrypted data as hex string */
  data: string;
  /** Input proof */
  inputProof: string;
  /** Handles for encrypted values */
  handles: string[];
}

/**
 * Decryption Request
 */
export interface DecryptionRequest {
  /** Contract address */
  contractAddress: string;
  /** Encrypted handle to decrypt */
  handle: bigint;
  /** User address */
  userAddress: string;
}

/**
 * User Decryption Result
 */
export interface UserDecryptResult {
  /** Decrypted value */
  value: bigint;
  /** Signature for verification */
  signature: string;
}

/**
 * Public Decryption Result
 */
export interface PublicDecryptResult {
  /** Decrypted value */
  value: bigint;
  /** Timestamp of decryption */
  timestamp: number;
}

/**
 * EIP-712 Domain for signing
 */
export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

/**
 * EIP-712 Types for user decrypt
 */
export interface UserDecryptEIP712Types {
  Decrypt: Array<{ name: string; type: string }>;
}

/**
 * Client Interface for FHEVM operations
 */
export interface FhevmClient {
  /** Initialize the client */
  init(): Promise<void>;
  /** Get FhevmInstance */
  getInstance(): FhevmInstance | null;
  /** Check if client is initialized */
  isInitialized(): boolean;
  /** Create encrypted input */
  createEncryptedInput(contractAddress: string): EncryptedInputBuilder;
  /** Request user decryption with EIP-712 signature */
  requestUserDecrypt(request: DecryptionRequest, signer: Signer): Promise<UserDecryptResult>;
  /** Request public decryption */
  requestPublicDecrypt(handle: bigint, contractAddress: string): Promise<PublicDecryptResult>;
}

/**
 * Encrypted Input Builder for chaining
 */
export interface EncryptedInputBuilder {
  /** Add uint8 value */
  addUint8(value: number): this;
  /** Add uint16 value */
  addUint16(value: number): this;
  /** Add uint32 value */
  addUint32(value: number): this;
  /** Add uint64 value */
  addUint64(value: bigint): this;
  /** Add uint128 value */
  addUint128(value: bigint): this;
  /** Add uint256 value */
  addUint256(value: bigint): this;
  /** Add address value */
  addAddress(value: string): this;
  /** Add boolean value */
  addBool(value: boolean): this;
  /** Add bytes value */
  addBytes(value: Uint8Array): this;
  /** Encrypt and return result */
  encrypt(): Promise<EncryptedInput>;
}

/**
 * Supported encrypted types
 */
export type EncryptedType =
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256'
  | 'eaddress'
  | 'ebool'
  | 'ebytes';

/**
 * Type mapping from encrypted type to TypeScript type
 */
export type TypeMap = {
  euint8: number;
  euint16: number;
  euint32: number;
  euint64: bigint;
  euint128: bigint;
  euint256: bigint;
  eaddress: string;
  ebool: boolean;
  ebytes: Uint8Array;
};

/**
 * Decryption options
 */
export interface DecryptOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  /** Retry attempts */
  retries?: number;
  /** Polling interval in milliseconds */
  pollInterval?: number;
}
