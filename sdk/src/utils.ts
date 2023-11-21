import { ethers } from "ethers";

export function generateOrderSalt(): string {
  return ethers.utils.id(
    ethers.utils.keccak256("karvest" + Date.now().toString())
  );
}
