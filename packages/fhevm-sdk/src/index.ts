/**
 * @fhevm/sdk - Core SDK for building dApps with Fully Homomorphic Encryption
 *
 * This SDK provides:
 * - Client initialization and configuration
 * - Encrypted input creation for contract calls
 * - User decryption with EIP-712 signatures
 * - Public decryption capabilities
 * - Type-safe encrypted data handling
 *
 * @example
 * ```ts
 * import { createFhevmClient } from '@fhevm/sdk';
 *
 * const client = createFhevmClient({
 *   network: {
 *     chainId: 11155111,
 *     name: 'Sepolia',
 *     rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
 *   },
 * });
 *
 * await client.init();
 *
 * // Create encrypted input
 * const input = client
 *   .createEncryptedInput(contractAddress)
 *   .addUint32(100)
 *   .addAddress('0x...')
 *   .addBool(true);
 *
 * const encrypted = await input.encrypt();
 * ```
 */

// Export main client
export { FhevmClient, createFhevmClient } from './client/FhevmClient';

// Export encrypted input builder
export { EncryptedInputBuilderImpl } from './encryption/EncryptedInputBuilder';

// Export all types
export type {
  FhevmConfig,
  NetworkConfig,
  EncryptedInput,
  DecryptionRequest,
  UserDecryptResult,
  PublicDecryptResult,
  EIP712Domain,
  UserDecryptEIP712Types,
  FhevmClient as IFhevmClient,
  EncryptedInputBuilder,
  EncryptedType,
  TypeMap,
  DecryptOptions,
} from './types';

// Export version
export const VERSION = '1.0.0';
