// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// src/ColonyLevelCalculator.sol

contract ColonyLevelCalculator {
    function calculateColonyLevel(uint256 colonyExp) external pure returns (uint256) {
        uint256 n = 1;
        uint256 needExp = 0;

        for(; n <= 100 ; n++)
        {
            if(n < 10)
            {
                needExp += 100000000;
            }
            else
            {
                needExp += (2**((n-1)/10 - 1)) * 100000000;
            }

            if(needExp > colonyExp)
            {
                return n;
            }

            unchecked {
                n++;
            }
        }

        return 100;
    }
}

