import { useState, useCallback } from 'react';
import { useFhevmClient } from './useFhevmClient';
import type { DecryptionRequest, UserDecryptResult } from '@fhevm/sdk';
import type { Signer } from 'ethers';

/**
 * Hook for user decryption with EIP-712 signature
 *
 * @example
 * ```tsx
 * function BalanceDisplay() {
 *   const { decrypt, isDecrypting, result, error } = useUserDecrypt();
 *   const { data: signer } = useEthersSigner();
 *
 *   const handleReveal = async () => {
 *     const decrypted = await decrypt(
 *       {
 *         contractAddress: '0x...',
 *         handle: balanceHandle,
 *         userAddress: address,
 *       },
 *       signer
 *     );
 *     console.log('Decrypted value:', decrypted?.value);
 *   };
 * }
 * ```
 */
export function useUserDecrypt() {
  const { client, isInitialized } = useFhevmClient();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [result, setResult] = useState<UserDecryptResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (
      request: DecryptionRequest,
      signer: Signer
    ): Promise<UserDecryptResult | null> => {
      if (!client || !isInitialized) {
        const err = new Error('FHEVM client not initialized');
        setError(err);
        return null;
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decryptedResult = await client.requestUserDecrypt(request, signer);
        setResult(decryptedResult);

        return decryptedResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        console.error('User decryption error:', err);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    decrypt,
    isDecrypting,
    result,
    error,
    reset,
    isReady: isInitialized,
  };
}
