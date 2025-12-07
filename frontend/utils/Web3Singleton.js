import Web3 from "web3";
import { RPC_URL } from '../lib/contractInfo';

let web3Instance = null;

/**
 * Web3 인스턴스를 생성하거나 기존 인스턴스를 반환합니다.
 * 싱글톤 패턴을 적용하여 인스턴스는 한 번만 생성됩니다.
 * @returns {Web3} Web3 인스턴스
 */
export function getWeb3Instance() {
  if (web3Instance) {
    return web3Instance;
  }

  // 인스턴스가 없으면 새로 생성
  const provider = new Web3.providers.HttpProvider(RPC_URL);
  web3Instance = new Web3(provider);

  console.log("Web3 Instance Created.");
  return web3Instance;
}