import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FhevmClient, createFhevmClient, type FhevmConfig } from '@fhevm/sdk';

/**
 * FHEVM Context value
 */
interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
}

/**
 * FHEVM Context
 */
const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

/**
 * Props for FhevmProvider
 */
export interface FhevmProviderProps {
  children: ReactNode;
  config: FhevmConfig;
  autoInit?: boolean;
}

/**
 * FHEVM Provider Component
 * Wraps your app to provide FHEVM client instance
 *
 * @example
 * ```tsx
 * <FhevmProvider
 *   config={{
 *     network: {
 *       chainId: 11155111,
 *       name: 'Sepolia',
 *       rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
 *     },
 *   }}
 * >
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ children, config, autoInit = true }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        const fhevmClient = createFhevmClient(config);

        if (autoInit) {
          await fhevmClient.init();
          setIsInitialized(true);
        }

        setClient(fhevmClient);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM client'));
        console.error('FHEVM initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initClient();
  }, [config, autoInit]);

  const value: FhevmContextValue = {
    client,
    isInitialized,
    isInitializing,
    error,
  };

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>;
}

/**
 * Hook to use FHEVM context
 * Must be used within FhevmProvider
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}
