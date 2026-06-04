// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {StrategyExecutor} from "../src/StrategyExecutor.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        StrategyExecutor executor = new StrategyExecutor(msg.sender);

        vm.stopBroadcast();
        console2.log("StrategyExecutor deployed at:", address(executor));
    }
}
