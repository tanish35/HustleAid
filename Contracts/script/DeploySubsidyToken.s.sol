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

//Contract Address: 0x4C956d01826ab96f7d9A050617cFBbd8B5df743b
