import React, { useState, useEffect } from 'react';
import SdkInstance, { SafeInfo } from '@safe-global/safe-apps-sdk';
import { TokenBalance } from '@safe-global/safe-apps-sdk';
import ClaimTable from './ClaimTable';
import { ClaimableProtocol } from '../types';
type OwnProps = {
	sdk: SdkInstance;
	safeInfo: SafeInfo;
	offChainSigningEnabled: boolean;
	setCurrentTab: (page: string) => void;
};

const protocolsList: ClaimableProtocol[] = [
	{
		name: "Balancer",
		amount: 214,
		symbol: "BAL",
		harvest: 12,
		logo: "./balancer-logo.svg"
	},
	{
		name: "Gearbox",
		amount: 50,
		symbol: "GBX",
		harvest: 22,
		logo: "./gearbox-logo.png"
	},
	{
		name: "Gnosis Validation",
		amount: 340,
		symbol: "GNO",
		harvest: -1,
		logo: "./gnosis-logo.svg"
	},
	{
		name: "AAVE",
		amount: 0,
		symbol: "AAVE",
		harvest: 2,
		logo: "./aave-logo.png"
	}
];
const Harvest = ({ sdk, safeInfo, offChainSigningEnabled, setCurrentTab }: OwnProps): React.ReactElement => {


	return (
		<section>
			<h2>Harvest</h2>
			<ClaimTable protocols={protocolsList} sdk={sdk} safeInfo={safeInfo} offChainSigningEnabled={offChainSigningEnabled} setCurrentTab={setCurrentTab} />
		</section>
	);
};

export default Harvest