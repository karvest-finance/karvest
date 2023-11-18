// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import {IERC20} from "./composable/IERC20.sol";

contract TransferBalance {

    function transferBalanceFrom(IERC20 token, address from, address to) public {
        token.transferFrom(from, to, token.balanceOf(from));
    }
}
