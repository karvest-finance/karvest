import { TokenBalance } from '@safe-global/safe-apps-sdk';
import BigNumber from 'bignumber.js';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState } from 'react';
import { ClaimableProtocol } from '../types';
import SdkInstance, { SafeInfo } from '@safe-global/safe-apps-sdk';
type OwnProps = {
  protocols: ClaimableProtocol[];
  sdk: SdkInstance;
  safeInfo: SafeInfo;
  offChainSigningEnabled: boolean;
  setCurrentTab: (page: string) => void;

};

const formatTokenValue = (value: number | string, decimals: number): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed();
};

function ClaimTable({ protocols, sdk, safeInfo, offChainSigningEnabled, setCurrentTab }: OwnProps): JSX.Element {
  const [isModalAutomateOpen, setIsModalAutomateOpen] = useState(false);
  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);

  const openModalAutomate = () => {
    setIsModalAutomateOpen(true);
    console.log("openModalAutomate")
  };

  const closeModalAutomate = () => {
    setIsModalAutomateOpen(false);
  };
  const openModalHistory = () => {
    setIsModalHistoryOpen(true);
  };

  const closeModalHistory = () => {
    setIsModalHistoryOpen(false);
  };

  return (
    <>
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
            protocols.map((item: ClaimableProtocol, index) => (
              <tr key={index}>
                <td>
                  {/* {style = "height: 2rem;"} */}
                  <img className="img-fluid" src={item.logo || undefined} alt={`${item.symbol} Logo`} style={{ maxHeight: '32px',marginRight: '1rem' }} />
                  {item.name}
                </td>
                <td>{item.amount} {item.symbol}</td>
                {/* <td>{formatTokenValue(item.amount, item.tokenInfo.decimals)}</td> */}
                <td>{item.harvest === -1 ?
                  <button className="btn btn-primary" onClick={openModalAutomate} > Automate 👨‍🌾 Harvest</button>
                  // data-bs-toggle="modal" data-bs-target="#automate"
                  :
                  //  data-bs-toggle="modal" data-bs-target="#history"
                  <button className="btn btn-secondary" onClick={openModalHistory} > Next harvest ⏱ {item.harvest} days</button>
                }</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No balances available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="modal fade show" id="automate" style={{ display: isModalAutomateOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <br />
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Choose a path</h5>
              <button type="button" className="btn-close" onClick={closeModalAutomate}></button>
            </div>
            <div className="modal-body">
              <div className="card-container">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="card h-100 shakeable">
                      <div className="card-body">
                        <h5 className="card-title text-center">Cowllect</h5>
                        <p className="card-text">Karvest collects rewards and sells them for stablecoins.</p>
                        <div>
                          <img className="img-fluid" src="./cowllect2.png" alt="Cowllect" />
                        </div>
                          <br/>
                        <a href="#" className="btn btn-danger float-end" onClick={() => setCurrentTab("Cowllect")}>Cowllect</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="card h-100 shakeable">
                      <div className="card-body">
                        <h5 className="card-title text-center">Double down</h5>
                        <p className="card-text">Karvest fearlessly collects rewards and invests them.</p>
                        <div>
                          <img className="img-fluid" src="./double-down.png" alt="Double down" />
                        </div>
                        <br />
                        <a href="#" className="btn btn-danger float-end">Double down</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  end modal */}

      <div className="modal fade show" id="history" style={{ display: isModalHistoryOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Harvest history</h5>
              <button type="button" className="btn-close" onClick={closeModalAutomate}></button>
            </div>
            <div className="modal-body">
              <button className="close-button" onClick={closeModalHistory}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}

export default ClaimTable;
