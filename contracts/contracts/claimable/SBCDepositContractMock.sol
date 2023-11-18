// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./ISBCDepositContract.sol";

/// @title SBCDepositContractMock
/// @dev Mock implementation of the ERC20 ETH2.0 deposit contract.
contract SBCDepositContractMock is ISBCDepositContract {
    using SafeERC20 for IERC20;

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    IERC20 public stake_token;
    uint256 public amount;
    address public owner;
    mapping(address => bool) public whitelist;

    // ************************************* //
    // *          Custom Errors            * //
    // ************************************* //

    error Unauthorized();
    error UnsupportedOperation();

    // ************************************* //
    // *        Function Modifiers         * //
    // ************************************* //

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // ************************************* //
    // *            Constructor            * //
    // ************************************* //

    constructor(address _token, uint256 _amount) {
        stake_token = IERC20(_token);
        amount = _amount;
        owner = msg.sender;
        whitelist[msg.sender] = true;
    }

    // ************************************* //
    // *             Governance            * //
    // ************************************* //

    function changeOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    function changeWithdrawableAmount(uint256 _newAmount) external onlyOwner {
        amount = _newAmount;
    }

    function changeWhitelist(address _address, bool _whitelisted) external onlyOwner {
        whitelist[_address] = _whitelisted;
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    function withdrawableAmount(address _address) public view returns (uint256) {
        return whitelist[_address] ? amount : 0;
    }

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @inheritdoc ISBCDepositContract
    function claimWithdrawal(address _address) public {
        uint256 claimable = withdrawableAmount(_address);
        if (claimable > 0) {
            stake_token.safeTransfer(_address, claimable);
        }
    }

    /// @inheritdoc ISBCDepositContract
    function claimWithdrawals(address[] calldata _addresses) external {
        revert UnsupportedOperation();
    }
}
