// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/// @title ISBCDepositContract
interface ISBCDepositContract {
    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    function withdrawableAmount(address _address) external view returns (uint256);

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @dev Claim withdrawal amount for an address
    /// @param _address Address to transfer withdrawable tokens
    function claimWithdrawal(address _address) external;

    /// @dev Claim withdrawal amounts for an array of addresses
    /// @param _addresses Addresses to transfer withdrawable tokens
    function claimWithdrawals(address[] calldata _addresses) external;
}
