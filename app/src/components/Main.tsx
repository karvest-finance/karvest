import React, {useState, useEffect} from 'react';
import SdkInstance, { SafeInfo } from '@safe-global/safe-apps-sdk';
import BalancesTable from './BalancesTable';
import { TokenBalance } from '@safe-global/safe-apps-sdk';

type OwnProps = {
	sdk: SdkInstance;
	safeInfo: SafeInfo;
	offChainSigningEnabled: boolean;
};

const Main = ({ sdk, safeInfo, offChainSigningEnabled }: OwnProps): React.ReactElement => {
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

	return <BalancesTable balances={balances} />;
};

export default Main;
