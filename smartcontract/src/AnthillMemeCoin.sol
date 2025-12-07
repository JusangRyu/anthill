// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract AnthillMemeCoin is ERC20 {
    constructor(string memory colonyName, address leader)
        ERC20(_fullName(colonyName), _symbol(colonyName))
    {
        _mint(leader, 1_000_000 * 10**decimals());
    }

    function _fullName(string memory name) internal pure returns (string memory) {
        return string(abi.encodePacked("Anthill: ", name));
    }

    function _symbol(string memory name) internal pure returns (string memory) {
        bytes memory b = bytes(name);
        if (b.length <= 9) return string(abi.encodePacked("ANT", name));
        return string(abi.encodePacked("ANT", _substr(b, 0, 9)));
    }

    function _substr(bytes memory self, uint256 start, uint256 len)
        internal
        pure
        returns (string memory)
    {
        if (start + len > self.length) len = self.length - start;
        bytes memory result = new bytes(len);
        for (uint256 i = 0; i < len; i++) result[i] = self[start + i];
        return string(result);
    }
}