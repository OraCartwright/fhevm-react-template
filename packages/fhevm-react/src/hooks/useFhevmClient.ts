import { useFhevmContext } from '../context/FhevmContext';
import type { FhevmClient } from '@fhevm/sdk';

/**
 * Hook to get FHEVM client instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isInitialized } = useFhevmClient();
 *
 *   if (!isInitialized) {
 *     return <div>Initializing FHE...</div>;
 *   }
 *
 *   // Use client
 * }
 * ```
 */
export function useFhevmClient() {
  const { client, isInitialized, isInitializing, error } = useFhevmContext();

  return {
    client: client as FhevmClient | null,
    isInitialized,
    isInitializing,
    error,
  };
}
