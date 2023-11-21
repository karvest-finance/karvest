import React, { useState, useEffect } from 'react';
import SdkInstance, { SafeInfo } from '@safe-global/safe-apps-sdk';
import { TokenBalance } from '@safe-global/safe-apps-sdk';
import { ethers } from 'ethers';
import {  AppData } from '../types';

type OwnProps = {
	sdk: SdkInstance;
	safeInfo: SafeInfo;
	offChainSigningEnabled: boolean;
};

const Cowllect = ({ sdk, safeInfo, offChainSigningEnabled }: OwnProps): React.ReactElement => {
	// Core logic
	const RPC_URL = "https://rpc.gnosischain.com/" // 'https://eth-goerli.public.blastapi.io'
	const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
	const CLAIM_CONTRACT_ADDRESS = "0x0B98057eA310F4d31F2a452B414647007d1645d9";


	function buildClaimHook(provider: ethers.providers.JsonRpcProvider, withdrawalAddress: string, claimContract: string): object {
		const CLAIM_CONTRACT = new ethers.Contract(
			claimContract,
			[`function withdrawableAmount(address user) view returns (u256)`, `function claimWithdrawal(address _address) public`],
			provider,
		);

		const claimHook = {
			target: CLAIM_CONTRACT.address,
			callData: CLAIM_CONTRACT.interface.encodeFunctionData("claimWithdrawal", [withdrawalAddress]),
			gasLimit: "82264",
		};
		return claimHook;
	}

	function generateAppData(preHooks: object[], postHooks: object[]): AppData {
		const appData = JSON.stringify({
			appCode: "CoW Swap",
			version: "0.9.0",
			metadata: {
				hooks: {
					pre: preHooks,
					post: postHooks,
				},
			},
		});

		console.log(`App Data ${appData}`);
		const appHash = ethers.utils.id(appData);
		console.log(`App Hash ${appHash}`);
		return { hash: appHash, data: appData };
	}

	async function postAppData(appData: AppData): Promise<void> {
		let { hash, data } = appData;
		const url = `${COW_API}/app_data/${hash}`;
		const requestBody = {
			fullAppData: data,
		};

		try {
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (response.ok) {
				console.log('App data updated successfully');
			} else {
				throw new Error('Error updating');
			}
		} catch (error: any) {
			console.error('Error updating app data:', error.message);
		}
	}

	async function multisigAppData(safeAddress: string, claimContractAddress: string) {
		let appData = generateAppData([buildClaimHook(provider, safeAddress, claimContractAddress)], []);
		await postAppData(appData);
	}

	// Frontend noise
	let item = {
		name: "Gnosis Validation",
		amount: 340,
		symbol: "GNO",
		harvest: -1,
		logo: "./gnosis-logo.svg"
	}

	const [dataPosted, setDataPosted] = useState(false);
	const [orderCreated, setOrderCreated] = useState(false);
	const [txStatus, setTxStatus] = useState('');
	const handlePostData = () => {
		multisigAppData(safeInfo.safeAddress, CLAIM_CONTRACT_ADDRESS)
			.then(() => {
				console.log("App data update initiated");
			})
			.catch((error) => {
				console.error("Error initiating app data update:", error.message);
			});
		setDataPosted(true);
	}
	
	const handleCreateOrder =	async () => {
		const MockComposableCow = "0x630AFAD80d95dc6a4467BEa99D9F3865A4719ac8"
		const providerGoerli = new ethers.providers.JsonRpcProvider("https://eth-goerli.public.blastapi.io")
		const composableCow = new ethers.Contract(
			MockComposableCow,
			[`function create(string data) returns (bool)`],
			providerGoerli,
		);


		const txs = [
			{
				to: safeInfo?.safeAddress,
				value: '0',
				data: '0x',
			},
		];

		const params = {
			safeTxGas: 700,
		};

		setTxStatus('');
		try {
			const response = await sdk.txs.send({ txs, params });
			// const response = await composableCow.create("Hiyeaa")
			setTxStatus(`Transaction was created with safeTxHash: ${response.safeTxHash}`);
			setOrderCreated(true);
		} catch (err) {
			setTxStatus('Failed to send a transaction');
		}
	}

	return (
		<section>
			<h2>Time to Cowllect</h2>
			<div className="row">
				<div className="col-sm-8">
					<ul>
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<div className="fw-bold">✅ - Claim and Swap Smart contract deployed</div>
							</li>
							<li className="list-group-item">
								<div className="fw-bold">✅ - Fallback Handler and Domain Verifier Set</div>
							</li>
							<li className="list-group-item">
								<div className="fw-bold">✅ - Set Approval Safe</div>
								{/* for GNO.approve(owner=EOA, spender=SAFE, amount=INFINITE) */}
							</li>
							<li className="list-group-item">
								<div className="fw-bold">✅ - Set Approval for settlement contract</div>
								{/* GNO.approve(owner=SAFE, spender=SETTLEMENT_CONTRACT, amount=INFINITE) */}
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-start">
								{dataPosted?
									<div className="fw-bold">✅ - Data Posted on IPFS</div>
								:
									<>
									<div className="fw-bold">❌ - Post App data</div>
									<button className="btn btn-primary" onClick={handlePostData}>📧 Post Data</button>
									</>
								}
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-start">
								{orderCreated ?
									<div className="fw-bold">✅ - Order Created on CowSwap</div>
								:
								<>
									<div className="fw-bold">❌ - Create Order</div>
									<select className="form-select" style={{ maxWidth: '10rem' , marginLeft: "8.5rem", marginRight:"6rem"}}>
										<option value="USDC">USDC</option>
										<option value="DAI">DAI</option>
									</select>
									<button className="btn btn-primary" onClick={handleCreateOrder}>☝ Create Order</button>
								</>
								}
								<div>{txStatus}</div>
							</li>
						</ul>
					</ul>
				</div>
				<div className="col-sm-4">
					<div className="card-container">
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">
									<img src={item.logo} alt="Logo" style={{ maxHeight: '32px', marginRight: '1rem' }} />
									{item.name}
								</h5>
								<p className="card-text">Amount: {item.amount} {item.symbol}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
export default Cowllect;

