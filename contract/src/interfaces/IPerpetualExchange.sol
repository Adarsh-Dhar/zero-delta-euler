// src/contracts/interfaces/IPerpetualExchange.sol
pragma solidity ^0.8.27;

interface IPerpetualExchange {
    function increaseShort(uint256 baseAmount) external;
    function decreaseShort(uint256 baseAmount) external;
    function getPosition(address account) external view returns (
        int256 size,
        int256 collateral,
        uint256 entryPrice
    );
    function closePosition() external;
}