// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {DeltaHedger} from "../src/DeltaHedger.sol";
import {IEVC} from "../lib/ethereum-vault-connector/src/interfaces/IEthereumVaultConnector.sol";
import {IEulerSwap} from "../src/interfaces/IEulerSwap.sol";
import {IPerpetualExchange} from "../src/interfaces/IPerpetualExchange.sol";

contract DeltaHedgerScript is Script {
    DeltaHedger public deltaHedger;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        // TODO: Replace these with actual deployed contract addresses or mocks for testing
        IEVC evc = IEVC(address(0x2A1176964F5D7caE5406B627Bf6166664FE83c60)); // placeholder
        IEulerSwap eulerSwap = IEulerSwap(address(0x0dAA7a2eb668131E1B353Aaa4cb2E0CF6B66E8A8)); // placeholder
        IPerpetualExchange perpExchange = IPerpetualExchange(address(0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1)); // placeholder
        deltaHedger = new DeltaHedger(evc, eulerSwap, perpExchange);
        vm.stopBroadcast();
    }
}
