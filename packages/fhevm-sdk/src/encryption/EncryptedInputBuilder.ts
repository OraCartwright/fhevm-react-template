import type { FhevmInstance } from 'fhevmjs';
import type { EncryptedInput, EncryptedInputBuilder } from '../types';

/**
 * Builder for creating encrypted inputs
 * Provides a fluent API for adding different encrypted types
 */
export class EncryptedInputBuilderImpl implements EncryptedInputBuilder {
  private instance: FhevmInstance;
  private contractAddress: string;
  private values: Array<{ type: string; value: any }> = [];

  constructor(instance: FhevmInstance, contractAddress: string) {
    this.instance = instance;
    this.contractAddress = contractAddress;
  }

  /**
   * Add encrypted uint8
   */
  addUint8(value: number): this {
    this.validateUint(value, 8);
    this.values.push({ type: 'uint8', value });
    return this;
  }

  /**
   * Add encrypted uint16
   */
  addUint16(value: number): this {
    this.validateUint(value, 16);
    this.values.push({ type: 'uint16', value });
    return this;
  }

  /**
   * Add encrypted uint32
   */
  addUint32(value: number): this {
    this.validateUint(value, 32);
    this.values.push({ type: 'uint32', value });
    return this;
  }

  /**
   * Add encrypted uint64
   */
  addUint64(value: bigint): this {
    this.validateBigint(value, 64);
    this.values.push({ type: 'uint64', value });
    return this;
  }

  /**
   * Add encrypted uint128
   */
  addUint128(value: bigint): this {
    this.validateBigint(value, 128);
    this.values.push({ type: 'uint128', value });
    return this;
  }

  /**
   * Add encrypted uint256
   */
  addUint256(value: bigint): this {
    this.validateBigint(value, 256);
    this.values.push({ type: 'uint256', value });
    return this;
  }

  /**
   * Add encrypted address
   */
  addAddress(value: string): this {
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      throw new Error('Invalid Ethereum address');
    }
    this.values.push({ type: 'address', value });
    return this;
  }

  /**
   * Add encrypted boolean
   */
  addBool(value: boolean): this {
    this.values.push({ type: 'bool', value });
    return this;
  }

  /**
   * Add encrypted bytes
   */
  addBytes(value: Uint8Array): this {
    if (!(value instanceof Uint8Array)) {
      throw new Error('Value must be Uint8Array');
    }
    this.values.push({ type: 'bytes', value });
    return this;
  }

  /**
   * Encrypt all values and return result
   */
  async encrypt(): Promise<EncryptedInput> {
    if (this.values.length === 0) {
      throw new Error('No values to encrypt');
    }

    try {
      // Create encrypted input using fhevmjs
      const input = this.instance.createEncryptedInput(this.contractAddress, await this.getUserAddress());

      // Add each value to the encrypted input
      for (const { type, value } of this.values) {
        switch (type) {
          case 'uint8':
            input.add8(value);
            break;
          case 'uint16':
            input.add16(value);
            break;
          case 'uint32':
            input.add32(value);
            break;
          case 'uint64':
            input.add64(value);
            break;
          case 'uint128':
            input.add128(value);
            break;
          case 'uint256':
            input.add256(value);
            break;
          case 'address':
            input.addAddress(value);
            break;
          case 'bool':
            input.addBool(value);
            break;
          case 'bytes':
            input.addBytes(value);
            break;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }
      }

      // Encrypt and get the result
      const encryptedData = input.encrypt();

      return {
        data: encryptedData.data,
        inputProof: encryptedData.inputProof,
        handles: encryptedData.handles || [],
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Validate uint value fits in specified bits
   */
  private validateUint(value: number, bits: number): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`Value must be a non-negative integer`);
    }
    const max = 2 ** bits - 1;
    if (value > max) {
      throw new Error(`Value ${value} exceeds maximum for uint${bits} (${max})`);
    }
  }

  /**
   * Validate bigint value fits in specified bits
   */
  private validateBigint(value: bigint, bits: number): void {
    if (typeof value !== 'bigint') {
      throw new Error('Value must be a bigint');
    }
    if (value < 0n) {
      throw new Error('Value must be non-negative');
    }
    const max = (2n ** BigInt(bits)) - 1n;
    if (value > max) {
      throw new Error(`Value ${value} exceeds maximum for uint${bits} (${max})`);
    }
  }

  /**
   * Get user address from instance
   */
  private async getUserAddress(): Promise<string> {
    // In a real implementation, get from connected wallet
    // For now, return zero address
    return '0x0000000000000000000000000000000000000000';
  }
}
