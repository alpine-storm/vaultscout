// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title StrategyExecutor
/// @notice On-chain vault for one-click strategy execution with owner-controlled operators
contract StrategyExecutor is Ownable, ReentrancyGuard {
    struct ExecutionRequest {
        address user;
        bytes32 strategyId;
        address target;
        uint256 value;
        bytes data;
        uint256 deadline;
    }

    mapping(address => bool) public operators;
    mapping(bytes32 => bool) public executedHashes;

    event OperatorUpdated(address indexed operator, bool allowed);
    event ExecutionSubmitted(
        bytes32 indexed requestHash,
        address indexed user,
        bytes32 strategyId,
        address target
    );

    error Unauthorized();
    error AlreadyExecuted();
    error Expired();
    error TransferFailed();

    modifier onlyOperator() {
        if (!operators[msg.sender] && msg.sender != owner()) revert Unauthorized();
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setOperator(address operator, bool allowed) external onlyOwner {
        operators[operator] = allowed;
        emit OperatorUpdated(operator, allowed);
    }

    /// @notice Execute a pre-signed strategy action on behalf of a user
    function execute(ExecutionRequest calldata request) external onlyOperator nonReentrant {
        bytes32 requestHash = keccak256(abi.encode(request));
        if (executedHashes[requestHash]) revert AlreadyExecuted();
        if (block.timestamp > request.deadline) revert Expired();

        executedHashes[requestHash] = true;

        (bool success, ) = request.target.call{value: request.value}(request.data);
        if (!success) revert TransferFailed();

        emit ExecutionSubmitted(
            requestHash,
            request.user,
            request.strategyId,
            request.target
        );
    }

    receive() external payable {}
}
