import { TokenBalance } from '@safe-global/safe-apps-sdk';
import BigNumber from 'bignumber.js';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';
import { ClaimableProtocol } from '../types';
const formatTokenValue = (value: number | string, decimals: number): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed();
};

function ClaimTable({ protocols }: { protocols : ClaimableProtocol[]} ): JSX.Element {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Current Reward</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(protocols) ? (
          protocols.map((item:ClaimableProtocol, index) => (
            <tr key={index}>
              <td>
                {/* <img className="responsive-image" src={item.tokenInfo.logoUri || undefined} alt={`${item.tokenInfo.symbol} Logo`} /> */}
                {item.name}
              </td>
              <td>{item.amount} {item.symbol}</td>
              {/* <td>{formatTokenValue(item.amount, item.tokenInfo.decimals)}</td> */}
              <td>{item.harvest===-1?
                <button className="btn btn-primary"> 👨‍🌾 Harvest</button>
              :
                <span>Next harvest ⏱ {item.harvest}</span> 

            } </td>
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

export default ClaimTable;
