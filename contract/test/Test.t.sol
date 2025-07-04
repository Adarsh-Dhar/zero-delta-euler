// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {DeltaHedger} from "../src/DeltaHedger.sol";
import {IEVC} from "../lib/ethereum-vault-connector/src/interfaces/IEthereumVaultConnector.sol";
import {IEulerSwap} from "../src/interfaces/IEulerSwap.sol";
import {IPerpetualExchange} from "../src/interfaces/IPerpetualExchange.sol";

contract DeltaHedgerTest is Test {
    DeltaHedger public deltaHedger;
    address public owner = address(this);
    IEVC public evc = IEVC(address(0x1234)); // placeholder
    IEulerSwap public eulerSwap = IEulerSwap(address(0x2345)); // placeholder
    IPerpetualExchange public perpExchange = IPerpetualExchange(address(0x3456)); // placeholder

    function setUp() public {
        deltaHedger = new DeltaHedger(evc, eulerSwap, perpExchange);
    }

    function test_ConstructorSetsParams() public {
        assertEq(address(deltaHedger.evc()), address(evc));
        assertEq(address(deltaHedger.eulerSwap()), address(eulerSwap));
        assertEq(address(deltaHedger.perpExchange()), address(perpExchange));
        assertEq(deltaHedger.account(), owner);
    }

    function testInitializeStrategy() public {
        deltaHedger.initializeStrategy(1000e18);
        assertEq(deltaHedger.lastRebalancePrice(), 1000e18);
        assertEq(deltaHedger.lastRebalanceTime(), block.timestamp);
    }
}
