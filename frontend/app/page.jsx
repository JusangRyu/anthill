// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import Cookies from 'js-cookie';
import { Receipt } from "lucide-react";
import {CONTRACT_ABI, TARGET_CHAIN_ID, CONTRACT_ADDRESS} from "../lib/contractInfo";
import { useRouter } from 'next/navigation';
import { useLoading } from "../context/LoadingContext";

const FUNCTION_NAME = "register";

export default function Home() {
  const [account, setAccount] = useState("");
  const router = useRouter();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const alertMsg = params.get('alert');
    if (alertMsg) {
      alert(alertMsg);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const connectWalletAndCallContract = async () => {
    if (!window.ethereum) {
      alert("You need to install Metamask or other Web3 Wallet.");
      return;
    }
    setIsLoading(true);
    
    try {
      // 1단계: 원하는 체인으로 전환 요청
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: TARGET_CHAIN_ID }],
        });
      } catch (switchError) {
        // 체인이 등록되어 있지 않으면 자동 추가
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: TARGET_CHAIN_ID,
                  chainName: "Insectarium (Memecore Testnet)",
                  nativeCurrency: {
                    name: "M",
                    symbol: "M",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.insectarium.memecore.net"],
                  blockExplorerUrls: ["https://insectarium.blockscout.memecore.com"],
                },
              ],
            });
          } catch (addError) {
            throw addError;
          }
        } else {
          throw switchError;
        }
      }

      // 2단계: 지갑 연결
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{
            eth_accounts: {},
          }],
        });

        const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];
        setAccount(userAddress);

        // 3단계: Web3 인스턴스 생성 + 컨트랙트 연결
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        // 4단계: 함수 호출 (파라미터가 있으면 배열로 넣으세요)
        const tx = await contract.methods[FUNCTION_NAME](/* 파라미터 있으면 여기 */).send({
          from: userAddress,
        });

        // 4. 서명 요청 (web3.js로 완벽하게 됨!)
        const nonce = Date.now().toString();
        const message = `로그인\n지갑: ${userAddress}\n시간: ${new Date().toISOString()}\nNonce: ${nonce}`;

        let signature;
        try {
          signature = await web3.eth.personal.sign(message, userAddress, ""); // 세 번째는 비밀번호 (빈 문자열)
        } catch (err) {
          alert("Please sign a signature from wallet.");
          return;
        }

        const loginEvent = tx.events.Login;

        if(loginEvent) {
          const receiveUserAddr = loginEvent.returnValues.user.toLowerCase();

          if(receiveUserAddr != userAddress)
          {
            alert("Invalid Access!");
            return;
          }

          // 5. 안전한 인증 데이터 쿠키 저장
          const authData = {
            address: userAddress.toLowerCase(),
            signature,
            message,
            nonce,
          };

          Cookies.set('auth', JSON.stringify(authData), {
            path: '/',
            sameSite: 'Lax',
            secure: false // 배포 시 true
          });

          router.push("/game/home");
        }
        else {
          console.log("Login Event is null");
          console.log(decodedEvents);
        }

      } catch (err) {
        alert("Transaction is failed.");
        setAccount("");
        console.error(err);
      }
    
    } catch (err) {
      console.error(err);
      alert(err.message || "작업이 취소되었거나 실패했습니다.");
      setAccount("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-center px-4">
      <img src="logo.png" alt="Logo" className="mb-16 w-64 md:w-80" />

      <button
        onClick={connectWalletAndCallContract}
        disabled={isLoading}
        className="w-110 text-center px-12 py-6 text-2xl font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl hover:bg-white/30 transition shadow-2xl"
      >
        {isLoading ? "Processing..." : "Connect Wallet & Register"}
      </button>

      {account && (
        <p className="mt-10 text-white/90">
          Connecting: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}
    </div>
  );
}