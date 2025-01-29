// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SubsidyToken.sol";

contract DeploySubsidy is Script {
    function run() external {
        vm.startBroadcast();

        SubsidyToken token = new SubsidyToken();

        vm.stopBroadcast();
    }
}

//Contract Address: 0xa1C8D6a04DA24f8185D1bc8E50c1313Dcb2d1413
