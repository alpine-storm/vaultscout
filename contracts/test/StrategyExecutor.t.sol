// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {StrategyExecutor} from "../src/StrategyExecutor.sol";

contract StrategyExecutorTest is Test {
    StrategyExecutor executor;
    address owner = address(1);
    address operator = address(2);
    address user = address(3);

    function setUp() public {
        executor = new StrategyExecutor(owner);
        vm.prank(owner);
        executor.setOperator(operator, true);
    }

    function test_execute_records_hash() public {
        StrategyExecutor.ExecutionRequest memory req = StrategyExecutor.ExecutionRequest({
            user: user,
            strategyId: keccak256("strategy-1"),
            target: address(0),
            value: 0,
            data: "",
            deadline: block.timestamp + 1 hours
        });

        vm.prank(operator);
        executor.execute(req);

        bytes32 hash = keccak256(abi.encode(req));
        assertTrue(executor.executedHashes(hash));
    }

    function test_revert_non_operator() public {
        StrategyExecutor.ExecutionRequest memory req = StrategyExecutor.ExecutionRequest({
            user: user,
            strategyId: keccak256("strategy-1"),
            target: address(0),
            value: 0,
            data: "",
            deadline: block.timestamp + 1 hours
        });

        vm.prank(user);
        vm.expectRevert(StrategyExecutor.Unauthorized.selector);
        executor.execute(req);
    }
}
