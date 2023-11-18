export type AppTabs = "tests" | "karvest"

export type ClaimableProtocol = {
	name: string;
	amount: number;
	logo: string;
	symbol: string;
	harvest: number;
}