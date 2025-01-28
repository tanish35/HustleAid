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

//Contract Address: 0xA50C611942886c7F04bD8BAFDF6353a3794fe8c6
