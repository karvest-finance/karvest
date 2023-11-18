// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.7.0 <0.9.0;


/* pragma solidity 0.8.9; */

interface IDepositContract {
    /// @notice A processed deposit event.
    event DepositEvent(bytes pubkey, bytes withdrawal_credentials, bytes amount, bytes signature, bytes index);

    /// @notice Submit a Phase 0 DepositData object.
    /// @param pubkey A BLS12-381 public key.
    /// @param withdrawal_credentials Commitment to a public key for withdrawals.
    /// @param signature A BLS12-381 signature.
    /// @param deposit_data_root The SHA-256 hash of the SSZ-encoded DepositData object.
    /// Used as a protection against malformed input.
    function deposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root,
        uint256 stake_amount
    ) external;

    /// @notice Query the current deposit root hash.
    /// @return The deposit root hash.
    function get_deposit_root() external view returns (bytes32);

    /// @notice Query the current deposit count.
    /// @return The deposit count encoded as a little endian 64-bit number.
    function get_deposit_count() external view returns (bytes memory);
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

/* pragma solidity ^0.8.0; */

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */

interface IERC677Receiver {
    function onTokenTransfer(address from, uint256 value, bytes calldata data) external returns (bool);
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */

/**
 * @title EIP1967Admin
 * @dev Upgradeable proxy pattern implementation according to minimalistic EIP1967.
 */
contract EIP1967Admin {
    // EIP 1967
    // bytes32(uint256(keccak256('eip1967.proxy.admin')) - 1)
    uint256 internal constant EIP1967_ADMIN_STORAGE =
        0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    modifier onlyAdmin() {
        require(msg.sender == _admin());
        _;
    }

    function _admin() internal view returns (address res) {
        assembly {
            res := sload(EIP1967_ADMIN_STORAGE)
        }
    }
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

/* pragma solidity ^0.8.0; */

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

/* pragma solidity ^0.8.0; */
/* import "../utils/Context.sol"; */

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor() {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */
/* import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol"; */
/* import {EIP1967Admin} from "./EIP1967Admin.sol"; */

/**
 * @title PausableEIP1967Admin
 * @dev Pausable contract, controlled by the current EIP1967 proxy owner.
 */
contract PausableEIP1967Admin is EIP1967Admin, Pausable {
    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

/* pragma solidity ^0.8.0; */

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */
/* import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol"; */

/**
 * @title Claimable
 * @dev Implementation of the claiming utils that can be useful for withdrawing accidentally sent tokens.
 */
contract Claimable {
    /**
     * @dev Withdraws the erc20 tokens or native coins from this contract.
     * @param _token address of the claimed token or address(0) for native coins.
     * @param _to address of the tokens/coins receiver.
     */
    function _claimValues(address _token, address _to) internal {
        if (_token == address(0)) {
            _claimNativeCoins(_to);
        } else {
            _claimERC20Tokens(_token, _to);
        }
    }

    /**
     * @dev Internal function for withdrawing all native coins from the contract.
     * @param _to address of the coins receiver.
     */
    function _claimNativeCoins(address _to) internal {
        uint256 balance = address(this).balance;
        payable(_to).transfer(balance);
    }

    /**
     * @dev Internal function for withdrawing all tokens of some particular ERC20 contract from this contract.
     * @param _token address of the claimed ERC20 token.
     * @param _to address of the tokens receiver.
     */
    function _claimERC20Tokens(address _token, address _to) internal {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(_to, balance);
    }
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */

interface IWithdrawalContract {
    /**
     * @dev Function to be used only in the system transaction.
     * Call to this function will revert only in three cases:
     *     - the caller is not `SYSTEM_WITHDRAWAL_EXECUTOR` or `_admin()`;
     *     - the length of `_amounts` array is not equal to the length of `_addresses` array;
     *     - it is a reentrant access to failed withdrawals processing;
     *     - the call ran out of gas.
     * Call to this function doesn't transmit flow control to any untrusted contract and uses a constant gas limit for each withdrawal,
     * so using constant gas limit and constant number of withdrawals (including failed withdrawals) for calls of this function is ok.
     * @param _maxNumberOfFailedWithdrawalsToProcess Maximum number of failed withdrawals to be processed.
     * @param _amounts Array of amounts to be withdrawn.
     * @param _addresses Array of addresses that should receive the corresponding amount of tokens.
     */
    function executeSystemWithdrawals(
        uint256 _maxNumberOfFailedWithdrawalsToProcess,
        uint64[] calldata _amounts,
        address[] calldata _addresses
    ) external;
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (utils/Address.sol)

/* pragma solidity ^0.8.1; */

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/draft-IERC20Permit.sol)

/* pragma solidity ^0.8.0; */

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
// SPDX--License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/utils/SafeERC20.sol)

/* pragma solidity ^0.8.0; */
/* import "../IERC20.sol"; */
/* import "../extensions/draft-IERC20Permit.sol"; */
/* import "../../../utils/Address.sol"; */

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */

interface IUnwrapper {
    /**
     * @dev Swaps some of the wrapped tokens to the whitelisted token.
     * Wrapped tokens will be burned.
     * @param _token Address of the whitelisted token contract.
     * @param _amount Amount of tokens to swap.
     * @return Amount of returned tokens.
     */
    function unwrap(address _token, uint256 _amount) external returns (uint256);
}
// SPDX--License-Identifier: CC0-1.0

/* pragma solidity 0.8.9; */
/* import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol"; */
/* import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; */
/* import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol"; */
/* import {IDepositContract} from "./interfaces/IDepositContract.sol"; */
/* import {IERC677Receiver} from "./interfaces/IERC677Receiver.sol"; */
/* import {IUnwrapper} from "./interfaces/IUnwrapper.sol"; */
/* import {IWithdrawalContract} from "./interfaces/IWithdrawalContract.sol"; */
/* import {PausableEIP1967Admin} from "./utils/PausableEIP1967Admin.sol"; */
/* import {Claimable} from "./utils/Claimable.sol"; */

/**
 * @title SBCDepositContract
 * @dev Implementation of the ERC20 ETH2.0 deposit contract.
 * For the original implementation, see the Phase 0 specification under https://github.com/ethereum/eth2.0-specs
 */
contract SBCDepositContract is
    IDepositContract,
    IERC165,
    IERC677Receiver,
    PausableEIP1967Admin,
    Claimable,
    IWithdrawalContract
{
    using SafeERC20 for IERC20;

    uint256 private constant DEPOSIT_CONTRACT_TREE_DEPTH = 32;
    // NOTE: this also ensures `deposit_count` will fit into 64-bits
    uint256 private constant MAX_DEPOSIT_COUNT = 2 ** DEPOSIT_CONTRACT_TREE_DEPTH - 1;

    bytes32[DEPOSIT_CONTRACT_TREE_DEPTH] private zero_hashes;

    bytes32[DEPOSIT_CONTRACT_TREE_DEPTH] private branch;
    uint256 private deposit_count;

    mapping(bytes => bytes32) public validator_withdrawal_credentials;

    IERC20 public immutable stake_token;

    address private constant SYSTEM_WITHDRAWAL_EXECUTOR = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;
    mapping(address => uint256) public withdrawableAmount;

    constructor(address _token) {
        stake_token = IERC20(_token);
    }

    function get_deposit_root() external view override returns (bytes32) {
        bytes32 node;
        uint256 size = deposit_count;
        for (uint256 height = 0; height < DEPOSIT_CONTRACT_TREE_DEPTH; height++) {
            if ((size & 1) == 1) {
                node = sha256(abi.encodePacked(branch[height], node));
            } else {
                node = sha256(abi.encodePacked(node, zero_hashes[height]));
            }
            size /= 2;
        }
        return sha256(abi.encodePacked(node, to_little_endian_64(uint64(deposit_count)), bytes24(0)));
    }

    function get_deposit_count() external view override returns (bytes memory) {
        return to_little_endian_64(uint64(deposit_count));
    }

    function deposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root,
        uint256 stake_amount
    ) external override whenNotPaused {
        stake_token.transferFrom(msg.sender, address(this), stake_amount);
        _deposit(pubkey, withdrawal_credentials, signature, deposit_data_root, stake_amount);
    }

    function batchDeposit(
        bytes calldata pubkeys,
        bytes calldata withdrawal_credentials,
        bytes calldata signatures,
        bytes32[] calldata deposit_data_roots
    ) external whenNotPaused {
        uint256 count = deposit_data_roots.length;
        require(count > 0, "BatchDeposit: You should deposit at least one validator");
        require(count <= 128, "BatchDeposit: You can deposit max 128 validators at a time");

        require(pubkeys.length == count * 48, "BatchDeposit: Pubkey count don't match");
        require(signatures.length == count * 96, "BatchDeposit: Signatures count don't match");
        require(withdrawal_credentials.length == 32, "BatchDeposit: Withdrawal Credentials count don't match");

        uint256 stake_amount = 1 ether;
        stake_token.transferFrom(msg.sender, address(this), stake_amount * count);

        for (uint256 i = 0; i < count; ++i) {
            bytes memory pubkey = bytes(pubkeys[i * 48:(i + 1) * 48]);
            bytes memory signature = bytes(signatures[i * 96:(i + 1) * 96]);

            _deposit(pubkey, withdrawal_credentials, signature, deposit_data_roots[i], stake_amount);
        }
    }

    function onTokenTransfer(
        address,
        uint256 stake_amount,
        bytes calldata data
    ) external override whenNotPaused returns (bool) {
        require(msg.sender == address(stake_token), "DepositContract: not a deposit token");
        require(data.length % 176 == 32, "DepositContract: incorrect deposit data length");
        uint256 count = data.length / 176;
        require(count > 0, "BatchDeposit: You should deposit at least one validator");
        uint256 stake_amount_per_deposit = stake_amount;
        if (count > 1) {
            require(count <= 128, "BatchDeposit: You can deposit max 128 validators at a time");
            require(stake_amount == 1 ether * count, "BatchDeposit: batch deposits require 1 GNO deposit amount");
            stake_amount_per_deposit = 1 ether;
        }

        bytes memory withdrawal_credentials = data[0:32];
        for (uint256 p = 32; p < data.length; p += 176) {
            bytes memory pubkey = data[p:p + 48];
            bytes memory signature = data[p + 48:p + 144];
            bytes32 deposit_data_root = bytes32(data[p + 144:p + 176]);
            _deposit(pubkey, withdrawal_credentials, signature, deposit_data_root, stake_amount_per_deposit);
        }
        return true;
    }

    function _deposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root,
        uint256 stake_amount
    ) internal {
        // Multiply stake amount by 32 (1 GNO for validating instead of the 32 ETH expected)
        stake_amount = 32 * stake_amount;

        // Extended ABI length checks since dynamic types are used.
        require(pubkey.length == 48, "DepositContract: invalid pubkey length");
        require(withdrawal_credentials.length == 32, "DepositContract: invalid withdrawal_credentials length");
        require(signature.length == 96, "DepositContract: invalid signature length");

        // Check deposit amount
        require(stake_amount >= 1 ether, "DepositContract: deposit value too low");
        require(stake_amount % 1 gwei == 0, "DepositContract: deposit value not multiple of gwei");
        uint256 deposit_amount = stake_amount / 1 gwei;
        require(deposit_amount <= type(uint64).max, "DepositContract: deposit value too high");

        // Emit `DepositEvent` log
        bytes memory amount = to_little_endian_64(uint64(deposit_amount));
        emit DepositEvent(
            pubkey,
            withdrawal_credentials,
            amount,
            signature,
            to_little_endian_64(uint64(deposit_count))
        );

        // Compute deposit data root (`DepositData` hash tree root)
        bytes32 pubkey_root = sha256(abi.encodePacked(pubkey, bytes16(0)));
        bytes32[3] memory sig_parts = abi.decode(signature, (bytes32[3]));
        bytes32 signature_root = sha256(
            abi.encodePacked(
                sha256(abi.encodePacked(sig_parts[0], sig_parts[1])),
                sha256(abi.encodePacked(sig_parts[2], bytes32(0)))
            )
        );
        bytes32 node = sha256(
            abi.encodePacked(
                sha256(abi.encodePacked(pubkey_root, withdrawal_credentials)),
                sha256(abi.encodePacked(amount, bytes24(0), signature_root))
            )
        );

        // Verify computed and expected deposit data roots match
        require(
            node == deposit_data_root,
            "DepositContract: reconstructed DepositData does not match supplied deposit_data_root"
        );

        // Avoid overflowing the Merkle tree (and prevent edge case in computing `branch`)
        require(deposit_count < MAX_DEPOSIT_COUNT, "DepositContract: merkle tree full");

        // Add deposit data root to Merkle tree (update a single `branch` node)
        deposit_count += 1;
        uint256 size = deposit_count;
        for (uint256 height = 0; height < DEPOSIT_CONTRACT_TREE_DEPTH; height++) {
            if ((size & 1) == 1) {
                branch[height] = node;
                return;
            }
            node = sha256(abi.encodePacked(branch[height], node));
            size /= 2;
        }
        // As the loop should always end prematurely with the `return` statement,
        // this code should be unreachable. We assert `false` just to be safe.
        assert(false);
    }

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IDepositContract).interfaceId ||
            interfaceId == type(IERC677Receiver).interfaceId;
    }

    /**
     * @dev Allows to transfer any locked token from this contract.
     * Only admin can call this method.
     * Deposit-related tokens cannot be claimed.
     * @param _token address of the token, if it is not provided (0x00..00), native coins will be transferred.
     * @param _to address that will receive the locked tokens from this contract.
     */
    function claimTokens(address _token, address _to) external onlyAdmin {
        require(address(stake_token) != _token, "DepositContract: not allowed to claim deposit token");
        _claimValues(_token, _to);
    }

    function to_little_endian_64(uint64 value) internal pure returns (bytes memory ret) {
        ret = new bytes(8);
        bytes8 bytesValue = bytes8(value);
        // Byteswapping during copying to bytes.
        ret[0] = bytesValue[7];
        ret[1] = bytesValue[6];
        ret[2] = bytesValue[5];
        ret[3] = bytesValue[4];
        ret[4] = bytesValue[3];
        ret[5] = bytesValue[2];
        ret[6] = bytesValue[1];
        ret[7] = bytesValue[0];
    }

    /*** Withdrawal part ***/

    /**
     * @dev Claim withdrawal amount for an address
     * @param _address Address to transfer withdrawable tokens
     */
    function claimWithdrawal(address _address) public {
        uint256 amount = withdrawableAmount[_address];
        if (amount > 0) {
            withdrawableAmount[_address] = 0;
            stake_token.safeTransfer(_address, amount);
        }
    }

    /**
     * @dev Claim withdrawal amounts for an array of addresses
     * @param _addresses Addresses to transfer withdrawable tokens
     */
    function claimWithdrawals(address[] calldata _addresses) external {
        for (uint256 i = 0; i < _addresses.length; ++i) {
            claimWithdrawal(_addresses[i]);
        }
    }

    /**
     * @dev Function to be used only in the system transaction.
     * Call to this function will revert only in case:
     *     - the caller is not `SYSTEM_WITHDRAWAL_EXECUTOR` or `_admin()`;
     *     - the length of `_amounts` array is not equal to the length of `_addresses` array;
     * Call to this function doesn't transmit flow control to any untrusted contract, nor does any operation of unbounded gas usage.
     * NOTE: This function signature is hardcoded in the Gnosis execution layer clients. Changing this signature without updating the
     * clients will cause block verification of any post-shangai block to fail. The function signature cannonical spec is here
     * https://github.com/gnosischain/specs/blob/master/execution/withdrawals.md
     * Note: chiado network requires this signature to sync post-shapella blocks. This function signature can only be deprecated after
     * deprecating chiado network of full sync up to a pre-specified block.
     * @custom:deprecatedparam _deprecatedUnused Previously `maxFailedWithdrawalsToProcess` currently deprecated and ignored
     * @param _amounts Array of amounts to be withdrawn.
     * @param _addresses Array of addresses that should receive the corresponding amount of tokens.
     */
    function executeSystemWithdrawals(
        uint256 /* _deprecatedUnused */,
        uint64[] calldata _amounts,
        address[] calldata _addresses
    ) public {
        require(
            _msgSender() == SYSTEM_WITHDRAWAL_EXECUTOR || _msgSender() == _admin(),
            "This function should be called only by SYSTEM_WITHDRAWAL_EXECUTOR or _admin()"
        );
        assert(_amounts.length == _addresses.length);

        for (uint256 i = 0; i < _amounts.length; ++i) {
            // Divide stake amount by 32 (1 GNO for validating instead of the 32 ETH expected)
            uint256 amount = (uint256(_amounts[i]) * 1 gwei) / 32;
            withdrawableAmount[_addresses[i]] += amount;
        }
    }

    /**
     * @dev Forwards compatible signature for `executeSystemWithdrawals` to support its future deprecation
     * Clients must support and use the signature specified in the spec at:
     * https://github.com/gnosischain/specs/blob/master/execution/withdrawals.md
     */
    function executeSystemWithdrawals(uint64[] calldata _amounts, address[] calldata _addresses) external {
        executeSystemWithdrawals(0, _amounts, _addresses);
    }

    /**
     * @dev Allows to unwrap the mGNO in this contract to GNO
     * Only admin can call this method.
     * @param _unwrapper address of the mGNO token unwrapper
     */
    function unwrapTokens(IUnwrapper _unwrapper, IERC20 _token) external onlyAdmin {
        _unwrapper.unwrap(address(stake_token), _token.balanceOf(address(this)));
    }
}
