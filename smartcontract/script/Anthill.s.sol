// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Anthill.sol";

contract DeployAnthill is Script {
    

    function run() external {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("DEPLOYER_PK"));
        address FACTORY_ADDRESS = 0xc15eF933D809C212a3332019CE7dfb27a386A447;

        vm.startBroadcast(deployerPrivateKey);

        new Anthill(FACTORY_ADDRESS);

        vm.stopBroadcast();
    }
}