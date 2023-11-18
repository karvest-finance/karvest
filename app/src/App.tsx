import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Spinner, Heading, SegmentedControl } from 'evergreen-ui';
import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk';
import Tests from './components/Tests';
import Harvest from './components/Harvest';
import Wallet from './components/Wallet';
import Cowllect from './components/Cowllect';
import { AppTabs } from './types';

import 'bootstrap/dist/css/bootstrap.min.css';

const Container = styled.div`
  // padding: 24px;
  // margin-bottom: 2rem;
  // width: 100%;
  // max-width: 480px;

  // display: grid;
  // grid-template-columns: 1fr;
  // grid-column-gap: 1rem;
  // grid-row-gap: 1rem;
`;


const SDK = new SafeAppsSDK();

const App = (): React.ReactElement => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        console.log('fine');
      })
      .catch(function (err) {
        console.error(err);
      });

    async function loadSafeInfo() {
      const safeInfo = await SDK.safe.getInfo();
      const chainInfo = await SDK.safe.getChainInfo();
      console.log({ safeInfo, chainInfo });
      setSafeInfo(safeInfo);
    }
    loadSafeInfo();
  }, []);

  const [currentTab, setCurrentTab] = useState<string>('Harvest');
  const [offChainSigningEnabled, setOffChainSigningEnabled] = useState(false);

  if (!safeInfo) {
    return <Spinner size={24} />;
  }

  return (
    <div className="container">
      <br />
      <div className="text-center">
        <img className="align-center img-responsive" src="./logo192.png" />
      </div>

      <h1 className="display-4 fw-bold text-body-emphasis text-center" ><span style={{ color: 'red' }}>K</span>arvest</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4 text-center">Programmatic harvest</p>
      </div>

      {/* <SegmentedControl value={currentTab as string} onChange={(val) => setCurrentTab(val as string)} options={tabs} /> */}
      {currentTab === 'Harvest' && <Harvest sdk={SDK} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} setCurrentTab={setCurrentTab} />}
      {currentTab === 'Wallet' && <Wallet sdk={SDK} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} />}
      {currentTab === 'Tests' && <Tests sdk={SDK} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} />}
      {currentTab === 'Cowllect' && <Cowllect sdk={SDK} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} />}
      <br />
      <div className="footer fixed-bottom">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="./favicon.ico" alt="" width="30" height="24" className="d-inline-block align-text-top rounded" style={{  marginRight: '1rem' }} />
              Karvest
            </a>
            {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button> */}
            <div className="" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className={currentTab === "Harvest" ? "nav-link active" : "nav-link"} href="#" onClick={() => setCurrentTab('Harvest')}>Harvest</a>
                </li>
                <li className="nav-item">
                  <a className={currentTab === "Wallet" ? "nav-link active" : "nav-link"} href="#" onClick={() => setCurrentTab('Wallet')}>Wallet</a>
                </li>
                <li className="nav-item">
                  <a className={currentTab === "Tests" ? "nav-link active" : "nav-link"} href="#" onClick={() => setCurrentTab('Tests')}>Tests</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

    </div>
  );
};

export default App;
