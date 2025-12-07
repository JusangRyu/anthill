// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/ColonyLevelCalculator.sol";

contract DeployColonyLevelCalculator is Script {
    
    function run() external {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("DEPLOYER_PK"));
        
        vm.startBroadcast(deployerPrivateKey);

        new ColonyLevelCalculator();

        vm.stopBroadcast();
    }
}