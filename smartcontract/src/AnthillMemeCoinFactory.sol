// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./AnthillMemeCoin.sol";

contract AnthillMemeCoinFactory {
    event MemeCoinCreated(address indexed colony, address token, string name, address leader);

    function createMemeCoin(string calldata colonyName, address leader)
        external
        returns (address token)
    {
        token = address(new AnthillMemeCoin(colonyName, leader));
        emit MemeCoinCreated(msg.sender, token, colonyName, leader);
    }
}