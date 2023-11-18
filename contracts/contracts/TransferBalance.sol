// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TransferBalance {
    using SafeERC20 for IERC20;

    function transferBalanceFrom(IERC20 token, address from, address to) public {
        token.safeTransferFrom(from, to, token.balanceOf(from));
    }
}
