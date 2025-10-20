// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

/**
 * @title ConfidentialCounter
 * @notice Example contract demonstrating FHE encrypted counter
 * @dev Shows user decryption and public decryption patterns
 */
contract ConfidentialCounter is GatewayCaller {
    // Encrypted counter value
    euint32 private counter;

    // Owner address
    address public owner;

    // Mapping for user-specific encrypted values
    mapping(address => euint32) private userCounters;

    // Events
    event CounterIncremented(address indexed user);
    event CounterDecremented(address indexed user);
    event ValueRevealed(address indexed user, uint32 value);

    constructor() {
        owner = msg.sender;
        counter = TFHE.asEuint32(0);
        TFHE.allowThis(counter);
    }

    /**
     * @notice Increment the global counter by an encrypted amount
     * @param encryptedAmount Encrypted amount to add
     */
    function incrementBy(einput encryptedAmount, bytes calldata inputProof) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
        counter = TFHE.add(counter, amount);
        TFHE.allowThis(counter);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Increment user's personal counter
     * @param encryptedAmount Encrypted amount to add
     */
    function incrementUserCounter(einput encryptedAmount, bytes calldata inputProof) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);

        if (TFHE.isInitialized(userCounters[msg.sender])) {
            userCounters[msg.sender] = TFHE.add(userCounters[msg.sender], amount);
        } else {
            userCounters[msg.sender] = amount;
        }

        TFHE.allowThis(userCounters[msg.sender]);
        TFHE.allow(userCounters[msg.sender], msg.sender);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Get encrypted counter value (only accessible to user)
     * @return Encrypted counter value
     */
    function getUserCounter() external view returns (euint32) {
        require(TFHE.isInitialized(userCounters[msg.sender]), "Counter not initialized");
        return userCounters[msg.sender];
    }

    /**
     * @notice Request user decryption of their counter
     * @dev Uses EIP-712 signature for authentication
     */
    function requestUserDecrypt() external returns (uint256) {
        require(TFHE.isInitialized(userCounters[msg.sender]), "Counter not initialized");

        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(userCounters[msg.sender]);

        return Gateway.requestDecryption(cts, this.callbackUserDecrypt.selector, 0, block.timestamp + 100, false);
    }

    /**
     * @notice Callback for user decryption
     * @param decryptedInput Decrypted values
     */
    function callbackUserDecrypt(uint256, uint256[] memory decryptedInput) public onlyGateway {
        uint32 value = uint32(decryptedInput[0]);
        emit ValueRevealed(msg.sender, value);
    }

    /**
     * @notice Request public decryption of global counter (owner only)
     */
    function requestPublicDecrypt() external returns (uint256) {
        require(msg.sender == owner, "Only owner can reveal");

        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(counter);

        return Gateway.requestDecryption(cts, this.callbackPublicDecrypt.selector, 0, block.timestamp + 100, false);
    }

    /**
     * @notice Callback for public decryption
     */
    function callbackPublicDecrypt(uint256, uint256[] memory decryptedInput) public onlyGateway {
        uint32 value = uint32(decryptedInput[0]);
        emit ValueRevealed(owner, value);
    }

    /**
     * @notice Compare user counter with encrypted value
     * @param encryptedValue Value to compare
     * @return Encrypted boolean result
     */
    function isGreaterThan(einput encryptedValue, bytes calldata inputProof) external view returns (ebool) {
        euint32 value = TFHE.asEuint32(encryptedValue, inputProof);
        return TFHE.gt(userCounters[msg.sender], value);
    }

    /**
     * @notice Reset user counter to zero
     */
    function resetUserCounter() external {
        userCounters[msg.sender] = TFHE.asEuint32(0);
        TFHE.allowThis(userCounters[msg.sender]);
        TFHE.allow(userCounters[msg.sender], msg.sender);
    }
}
