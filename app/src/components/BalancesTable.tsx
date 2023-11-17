
import { TokenBalance } from '@safe-global/safe-apps-sdk';
import BigNumber from 'bignumber.js';

function BalancesTable({ balances }: { balances: TokenBalance[] }): JSX.Element {

return (
  <table>
    <thead>
      <tr>
        <th>Asset</th>
        <th>Amount</th>
        <th>USD</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(balances) ? (
        balances.map((item, index) => (
          <tr key={index}>
            <td>
              {/* <img src={item.tokenInfo.logoUri || undefined} alt={`${item.tokenInfo.symbol} Logo`} /> */}
              {item.tokenInfo.name}
            </td>
            <td>{item.balance}</td>
            <td>{item.fiatBalance}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No balances available</td>
        </tr>
      )}
    </tbody>
  </table>
);
}

export default BalancesTable;
