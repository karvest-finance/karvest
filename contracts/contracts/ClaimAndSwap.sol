// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ComposableCoW} from "./vendored/ComposableCoW.sol";
import {GPv2Order} from "./vendored/GPv2Order.sol";
import {BaseConditionalOrder} from "./vendored/BaseConditionalOrder.sol";
import {ISBCDepositContract} from "./claimable/ISBCDepositContract.sol";

// --- error strings
/// @dev can't buy and sell the same token
string constant ERR_SAME_TOKENS = "same tokens";

/**
 * @title Simple Dutch Auction order type for CoW Protocol.
 * @author CoW Protocol Developers
 * @author kayibal (original code)
 */
contract ClaimAndSwap is BaseConditionalOrder {
    /// @dev `staticInput` data struct for dutch auctions
    struct Data {
        // Also Sell Token
        IERC20 claimToken;
        IERC20 buyToken;
        address eth1WithdrawAddress;
        // MUST CONTAIN PRE & POST HOOKS (and exist before order placement).
        bytes32 appData;
    }

    /// @dev need to know where to find ComposableCoW as this has the cabinet!
    ComposableCoW public immutable composableCow;

    // https://gnosisscan.io/address/0x0B98057eA310F4d31F2a452B414647007d1645d9#readProxyContract
    ISBCDepositContract public immutable depositContract;

    constructor(ComposableCoW _composableCow, ISBCDepositContract _depositContract) {
        composableCow = _composableCow;
        depositContract = _depositContract;
    }

    /**
     * If the conditions are satisfied, return the order that can be filled.
     * @param staticInput The ABI encoded `Data` struct.
     * @return order The GPv2Order.Data struct that can be filled.
     */
    function getTradeableOrder(
        address,
        address,
        bytes32,
        bytes calldata staticInput,
        bytes calldata
    ) public view override returns (GPv2Order.Data memory order) {
        Data memory data = abi.decode(staticInput, (Data));
        _validateData(data);

        // TODO - in a latter contract:
        // 1. Make recurring: use block time n' shit (probably need to implement isValidSignature for this)
        // 2. (optional) Use Restaking App Data (a post-hook that deposits.)
        // 3. Delegate a safe (via token approval) to do stuff
        order = GPv2Order.Data(
            data.claimToken,
            data.buyToken,
            address(0), // recipient: could also use owner
            depositContract.withdrawableAmount(data.eth1WithdrawAddress), // TODO - use claimable amount here:
            1, // Buy amount is a "market order".
            1703525574, // December 25, 2023 (use bucket timing)
            data.appData, // Must ensure app data exists already. or the user needs to ensure it exisits on IPFS
            0, // use zero fee for limit orders
            GPv2Order.KIND_SELL, // only sell order support for now
            false, // partially fillable orders are not supported
            GPv2Order.BALANCE_ERC20,
            GPv2Order.BALANCE_ERC20
        );
    }

    /**
     * @dev External function for validating the ABI encoded data struct. Help debuggers!
     * @param data `Data` struct containing the order parameters
     * @dev Throws if the order provided is not valid.
     */
    function validateData(bytes memory data) external pure override {
        _validateData(abi.decode(data, (Data)));
    }

    /**
     * Internal method for validating the ABI encoded data struct.
     * @dev This is a gas optimisation method as it allows us to avoid ABI decoding the data struct twice.
     * @param data `Data` struct containing the order parameters
     * @dev Throws if the order provided is not valid.
     */
    function _validateData(Data memory data) internal pure {
        if (data.claimToken == data.buyToken) revert OrderNotValid(ERR_SAME_TOKENS);
    }
}
