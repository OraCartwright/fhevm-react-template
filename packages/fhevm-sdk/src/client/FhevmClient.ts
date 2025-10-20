import { createInstance, FhevmInstance, generatePublicKey, initFhevm } from 'fhevmjs';
import { Signer } from 'ethers';
import type {
  FhevmConfig,
  FhevmClient as IFhevmClient,
  DecryptionRequest,
  UserDecryptResult,
  PublicDecryptResult,
  EncryptedInputBuilder,
  EIP712Domain,
} from '../types';
import { EncryptedInputBuilderImpl } from '../encryption/EncryptedInputBuilder';

/**
 * Main FHEVM Client implementation
 * Provides initialization, encryption, and decryption capabilities
 */
export class FhevmClient implements IFhevmClient {
  private instance: FhevmInstance | null = null;
  private initialized = false;
  private config: FhevmConfig;
  private publicKey: string | null = null;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM client
   * Must be called before any encryption/decryption operations
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize fhevmjs library
      await initFhevm();

      // Generate or use provided public key
      if (this.config.network.publicKey) {
        this.publicKey = this.config.network.publicKey;
      } else {
        // In production, fetch from ACL contract
        this.publicKey = await this.fetchPublicKey();
      }

      // Create FhevmInstance with network configuration
      this.instance = await createInstance({
        chainId: this.config.network.chainId,
        publicKey: this.publicKey,
        gatewayUrl: this.getGatewayUrl(),
        aclAddress: this.config.aclAddress,
        kmsVerifierAddress: this.config.kmsVerifierAddress,
      });

      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM client: ${error}`);
    }
  }

  /**
   * Get the FhevmInstance
   */
  getInstance(): FhevmInstance | null {
    return this.instance;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Create an encrypted input builder for a contract
   */
  createEncryptedInput(contractAddress: string): EncryptedInputBuilder {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }
    return new EncryptedInputBuilderImpl(this.instance, contractAddress);
  }

  /**
   * Request user decryption with EIP-712 signature
   * User must sign the decryption request
   */
  async requestUserDecrypt(
    request: DecryptionRequest,
    signer: Signer
  ): Promise<UserDecryptResult> {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }

    try {
      // Prepare EIP-712 domain
      const domain: EIP712Domain = {
        name: 'FHE Decryption',
        version: '1',
        chainId: this.config.network.chainId,
        verifyingContract: request.contractAddress,
      };

      // EIP-712 types
      const types = {
        Decrypt: [
          { name: 'handle', type: 'uint256' },
          { name: 'user', type: 'address' },
          { name: 'timestamp', type: 'uint256' },
        ],
      };

      // Prepare message
      const timestamp = Math.floor(Date.now() / 1000);
      const message = {
        handle: request.handle,
        user: request.userAddress,
        timestamp,
      };

      // Sign with EIP-712
      const signature = await signer.signTypedData(domain, types, message);

      // Request decryption from gateway
      const decryptedValue = await this.gatewayDecrypt(
        request.handle,
        signature,
        request.contractAddress
      );

      return {
        value: decryptedValue,
        signature,
      };
    } catch (error) {
      throw new Error(`User decryption failed: ${error}`);
    }
  }

  /**
   * Request public decryption
   * No signature required - anyone can decrypt
   */
  async requestPublicDecrypt(
    handle: bigint,
    contractAddress: string
  ): Promise<PublicDecryptResult> {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }

    try {
      const decryptedValue = await this.gatewayDecrypt(handle, null, contractAddress);

      return {
        value: decryptedValue,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error(`Public decryption failed: ${error}`);
    }
  }

  /**
   * Fetch public key from ACL contract or gateway
   */
  private async fetchPublicKey(): Promise<string> {
    // In a real implementation, fetch from ACL contract
    // For now, generate a temporary key
    const key = generatePublicKey();
    return key.publicKey;
  }

  /**
   * Get gateway URL from config
   */
  private getGatewayUrl(): string {
    // Default gateway for Zama's FHE
    return this.config.gatewayAddress || 'https://gateway.zama.ai';
  }

  /**
   * Request decryption from gateway
   */
  private async gatewayDecrypt(
    handle: bigint,
    signature: string | null,
    contractAddress: string
  ): Promise<bigint> {
    if (!this.instance) {
      throw new Error('FHEVM instance not available');
    }

    // Use instance's decrypt method
    // In production, this would make an actual API call to the gateway
    try {
      // Mock implementation - in reality, call gateway API
      // const response = await fetch(`${this.getGatewayUrl()}/decrypt`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ handle, signature, contractAddress }),
      // });
      // const { value } = await response.json();
      // return BigInt(value);

      // For now, return placeholder
      console.warn('Gateway decryption not yet implemented - returning mock value');
      return BigInt(0);
    } catch (error) {
      throw new Error(`Gateway decryption request failed: ${error}`);
    }
  }
}

/**
 * Create a new FHEVM client instance
 */
export function createFhevmClient(config: FhevmConfig): FhevmClient {
  return new FhevmClient(config);
}
