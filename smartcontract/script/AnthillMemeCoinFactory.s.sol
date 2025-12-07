// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/AnthillMemeCoinFactory.sol";

contract DeployAnthillMemeCoinFactory is Script {
    
    function run() external {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("DEPLOYER_PK"));
        
        vm.startBroadcast(deployerPrivateKey);

        // 팩토리 배포
        AnthillMemeCoinFactory factory = new AnthillMemeCoinFactory();
        
        console.log("AnthillMemeCoinFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}