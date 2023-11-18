import React, {useState, useEffect} from 'react';
import SdkInstance, { SafeInfo } from '@safe-global/safe-apps-sdk';
import BalancesTable from './BalancesTable';
import { TokenBalance } from '@safe-global/safe-apps-sdk';
import { ClaimableProtocol } from '../types';
type OwnProps = {
	sdk: SdkInstance;
	safeInfo: SafeInfo;
	offChainSigningEnabled: boolean;
}; 

const protocolsList: ClaimableProtocol[] = [
	{
		name: "Balancer",
		amount: 214,
		symbol: "BAL",
		harvest: -1,
		logo: "https://example.com/balancer-logo.png"
	},
	{
		name: "Gearbox",
		amount: 50,
		symbol: "GBX",
		harvest: -1,
		logo: "https://example.com/gearbox-logo.png"
	},
	{
		name: "Gnosis Validation",
		amount: 200,
		symbol: "GNO",
		harvest: 200,
		logo: "https://example.com/gnosis-validation-logo.png"
	},
	{
		name: "AAVE",
		amount: 0,
		symbol: "AAVE",
		harvest: -1,
		logo: "https://example.com/aave-logo.png"
	}
];
const Wallet = ({ sdk, safeInfo, offChainSigningEnabled }: OwnProps): React.ReactElement => {
	const [balances, setBalances] = useState<TokenBalance[]>([]);

	useEffect(() => {
		async function getBalances() {
			try {
				const balances = await sdk.safe.experimental_getBalances({
					currency: 'USD'
				});
				console.log("Got balances",{ balances }	)
				setBalances(balances.items as TokenBalance[]); // Convert balances to unknown first, then cast to TokenBalance[]
			} catch (error) {
				console.error('Failed to get balances:', error);
			}
		}
		getBalances();
	}, []);

	return (
		<section>
			<h2>Wallet</h2>
			<BalancesTable balances={balances} />

		</section>
	);
};

export default Wallet