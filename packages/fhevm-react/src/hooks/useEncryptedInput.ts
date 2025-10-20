import { useState, useCallback } from 'react';
import { useFhevmClient } from './useFhevmClient';
import type { EncryptedInput } from '@fhevm/sdk';

/**
 * Hook for creating encrypted inputs
 *
 * @example
 * ```tsx
 * function TransferForm() {
 *   const { createInput, encrypt, isEncrypting, error } = useEncryptedInput();
 *
 *   const handleSubmit = async () => {
 *     const input = createInput(contractAddress)
 *       .addUint32(100)
 *       .addAddress('0x...');
 *
 *     const encrypted = await encrypt(input);
 *     // Use encrypted data in contract call
 *   };
 * }
 * ```
 */
export function useEncryptedInput() {
  const { client, isInitialized } = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createInput = useCallback(
    (contractAddress: string) => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }
      return client.createEncryptedInput(contractAddress);
    },
    [client, isInitialized]
  );

  const encrypt = useCallback(
    async (builder: ReturnType<typeof createInput>): Promise<EncryptedInput | null> => {
      try {
        setIsEncrypting(true);
        setError(null);
        const result = await builder.encrypt();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        console.error('Encryption error:', err);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    []
  );

  return {
    createInput,
    encrypt,
    isEncrypting,
    error,
    isReady: isInitialized,
  };
}
