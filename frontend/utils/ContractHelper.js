// utils/ContractHelper.js
import { getWeb3Instance } from './Web3Singleton';
import { CONTRACT_ADDRESS, CONTRACT_ABI, RPC_URL, TARGET_CHAIN_ID } from '../lib/contractInfo';

let contractInstance = null;

/**
 * 특정 스마트 컨트랙트의 객체를 생성하거나 기존 객체를 반환합니다.
 * Web3 싱글톤 인스턴스를 재활용합니다.
 * @returns {web3.eth.Contract} 컨트랙트 객체
 */

export function getMyContract() {
  if (contractInstance) {
    return contractInstance;
  }

  try {
    const web3 = getWeb3Instance(); // Web3 싱글톤 인스턴스 사용
    contractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    console.log("Contract Instance Created.");
    return contractInstance;
  } catch (error) {
    console.error("Failed to create contract instance:", error);
    throw new Error("Contract initialization failed.");
  }
}