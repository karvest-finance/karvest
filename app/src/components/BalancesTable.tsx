import { TokenBalance } from '@safe-global/safe-apps-sdk';
import BigNumber from 'bignumber.js';

const formatTokenValue = (value: number | string, decimals: number): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed();
};

function BalancesTable({ balances }: { balances: TokenBalance[] }): JSX.Element {

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Asset</th>
          <th>Amount</th>
          {/* <th>USD</th> */}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(balances) ? (
          balances.map((item, index) => (
            <tr key={index}>
              <td>
                {/* <img className="responsive-image" src={item.tokenInfo.logoUri || undefined} alt={`${item.tokenInfo.symbol} Logo`} /> */}
                {item.tokenInfo.name} ({item.tokenInfo.symbol})
              </td>
              <td>{formatTokenValue(item.balance, item.tokenInfo.decimals)}</td>
              {/* <td>{item.fiatBalance}</td> */}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2}>No balances available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default BalancesTable;
