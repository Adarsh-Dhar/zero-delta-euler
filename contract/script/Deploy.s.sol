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
        IEVC evc = IEVC(address(0x1234)); // placeholder
        IEulerSwap eulerSwap = IEulerSwap(address(0x2345)); // placeholder
        IPerpetualExchange perpExchange = IPerpetualExchange(address(0x3456)); // placeholder
        deltaHedger = new DeltaHedger(evc, eulerSwap, perpExchange);
        vm.stopBroadcast();
    }
}
