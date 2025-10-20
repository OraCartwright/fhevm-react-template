/**
 * @fhevm/react - React hooks and components for FHEVM SDK
 *
 * This package provides React integration for the FHEVM SDK including:
 * - FhevmProvider for app-wide client initialization
 * - Hooks for encryption, decryption, and client access
 * - Type-safe encrypted data handling
 *
 * @example
 * ```tsx
 * import { FhevmProvider, useFhevmClient, useEncryptedInput } from '@fhevm/react';
 *
 * function App() {
 *   return (
 *     <FhevmProvider
 *       config={{
 *         network: {
 *           chainId: 11155111,
 *           name: 'Sepolia',
 *           rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
 *         },
 *       }}
 *     >
 *       <MyComponent />
 *     </FhevmProvider>
 *   );
 * }
 *
 * function MyComponent() {
 *   const { client, isInitialized } = useFhevmClient();
 *   const { createInput, encrypt } = useEncryptedInput();
 *
 *   // Use hooks...
 * }
 * ```
 */

// Export context and provider
export { FhevmProvider, useFhevmContext, type FhevmProviderProps } from './context/FhevmContext';

// Export hooks
export { useFhevmClient } from './hooks/useFhevmClient';
export { useEncryptedInput } from './hooks/useEncryptedInput';
export { useUserDecrypt } from './hooks/useUserDecrypt';

// Re-export types from core SDK
export type {
  FhevmConfig,
  NetworkConfig,
  EncryptedInput,
  DecryptionRequest,
  UserDecryptResult,
  PublicDecryptResult,
  EncryptedType,
  TypeMap,
} from '@fhevm/sdk';

// Export version
export const VERSION = '1.0.0';
