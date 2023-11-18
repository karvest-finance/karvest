export type AppTabs = "Harvest" | "Wallet" | "Tests"

export type ClaimableProtocol = {
	name: string;
	amount: number;
	logo: string;
	symbol: string;
	harvest: number;
}

export type cowHook = {
	target: string;
	callData: string;
	gasLimit: string;
};

export type AppData = {
	hash: string;
	data: string;
};