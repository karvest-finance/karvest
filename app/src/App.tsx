import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Spinner, Heading, SegmentedControl } from 'evergreen-ui';
import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk';
import Tests from './components/Tests';
import Main from './components/Main';
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

const tabs = [
  { value: '0', label: 'Main' },
  { value: '1', label: 'Tests' },

];

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

  const [currentTab, setCurrentTab] = useState<string>('0');
  const [offChainSigningEnabled, setOffChainSigningEnabled] = useState(false);

  if (!safeInfo) {
    return <Spinner size={24} />;
  }

  return (
    <Container>
      {/* <Heading size={700} marginTop="default">
        Karvest
      </Heading> */}

      <div className="container">

        <h1 className="display-4 fw-bold text-body-emphasis text-center" ><span style={{ color: 'red' }}>K</span>arvest</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4 text-center">Time to cowllect</p>
          {/* <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">Primary button</button>
            <button type="button" className="btn btn-outline-secondary btn-lg px-4">Secondary</button>
          </div> */}
        </div>

        {/* <SegmentedControl value={currentTab as string} onChange={(val) => setCurrentTab(val as string)} options={tabs} /> */}
        {currentTab === '0' && <Main sdk={SDK} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} />}
        {currentTab === '1' && <Tests sdk={SDK} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} />}

      </div>
    </Container>
  );
};

export default App;
