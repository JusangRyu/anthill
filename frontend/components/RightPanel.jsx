"use client"

import { useEffect, useState, useMemo } from "react"
import { Swords, Shield, Hammer } from "lucide-react"
import Web3 from "web3"
import { CONTRACT_ABI, CONTRACT_ADDRESS, NULL_DATA } from "../lib/contractInfo"
import { useLoading } from "../context/LoadingContext"
import { useUser } from "../context/UserContext"
import { useQuery } from "@tanstack/react-query"
import { getUsersInfo } from "../utils/ReadProperties"
import { calculateUserLevel } from "../utils/LevelCalculator"

const formatTime = (ms) => {
    if (ms < 0) {
      return "00:00:00"; // 시간이 음수가 되면 0으로 표시
    } 
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 두 자릿수 형식으로 포맷
    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}



export default function RightPanel() {

  const [isWarTime, setIsWarTime] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const {setIsLoading} = useLoading();
  const {userData, colonyData, isDataLoading, refreshData} = useUser();
  const {data: userList, isLoading, error, isFetching} = useQuery({
      queryKey: ['userList'],
      queryFn : getUsersInfo
    }
  )

  const fetchedMyName = useMemo(() => {
        if (!userList || !userData) {
            return ""; // 데이터 로드 중이거나 없을 때 기본값
        }

        const foundUser = userList.find(user => 
            user.walletAddress.toLowerCase() === userData.walletAddr.toLowerCase()
        );

        if (foundUser) {
            return `${foundUser.displayName} (@${foundUser.userNameTag})`;
        }
        return "Unknown";

    }, [userList, userData]);

  useEffect(() => {
    // userData나 colonyData가 없으면 즉시 종료
    if (!userData || !colonyData || !userData.warStartTime || isLoading || error  || colonyData.enemy === undefined) {
        return; 
    }

    const now = Date.now();
    const warStartTimeMs = Number(userData.warStartTime) * 1000;
    const warEndTimeMs = Number(userData.warEndTime) * 1000;

    // 1. isWarTime 상태 결정 (첫 번째 useEffect 역할 통합)
    const isCurrentlyWar = colonyData.enemy != NULL_DATA && 
                            (now >= warStartTimeMs && now <= warEndTimeMs);
    
    setIsWarTime(isCurrentlyWar);
    
    // 2. 목표 시간 설정
    let targetTime;
    if (isCurrentlyWar) {
        // 전쟁 중이면, 남은 시간은 전쟁 종료 시간까지
        targetTime = warEndTimeMs;
    } else if (colonyData.enemy != NULL_DATA && now < warStartTimeMs) {
        // 평상시이고, 곧 전쟁 시작이면, 시작 시간까지
        targetTime = warStartTimeMs;
    } else {
        // 다음 이벤트가 없거나 이미 이벤트가 끝났으면 타이머를 멈춤
        setRemainingTime(0);
        return;
    }

    // 3. 타이머 설정 및 업데이트
    const updateCountdown = () => {
        const now = Date.now();
        const timeDifference = targetTime - now;

        if (timeDifference <= 0) {
            // 시간이 끝나면 타이머를 멈추고 데이터를 갱신합니다.
            clearInterval(intervalId);
            // 🚨 시간이 0이 되었으므로, 새로운 전쟁/평화 상태를 반영하기 위해 데이터 갱신
            // refreshData(); 
            return;
        }

        setRemainingTime(timeDifference);
    };

    updateCountdown(); 
    const intervalId = setInterval(updateCountdown, 1000);

    // 4. 클린업 함수: userData가 변경되거나 컴포넌트가 언마운트될 때 기존 타이머 중지
    return () => {
        clearInterval(intervalId);
    };

  }, [userData, colonyData]);

  const levelUpCheck = async () => {
    let updatedLevel = calculateUserLevel(userData.experience);

    try {
      if(userData.level < updatedLevel) {
        alert("You have reached the required experience points for the next level. Proceed with the level up!");
        setIsLoading(true);

        await contract.methods.updateUserLevel(updatedLevel, userData.experience).call({ from: userAddress });
        
        const tx  = await contract.methods.updateUserLevel(updatedLevel, userData.experience).send({
          from: userAddress,
        });

        alert(`Level Up! Lv : ${updatedLevel}`);
        await refreshData();
        setIsLoading(false);
      }
    } catch (error) {
      const msg = error.data?.message;
      if(!msg) {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      } else if (msg.includes("Invalid User Experience")) {
        alert("Invalid User Experience");
      } else {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      }
    }      
  }

  const handleAttack = async () => {
    if (!window.ethereum) {
      alert("You need to install Metamask or other Web3 Wallet.");
      return;
    }
    
    const targetColony = colonyData.enemy;

    if (!targetColony || targetColony === NULL_DATA) {
      alert("Your Colony is not at war");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      await contract.methods.attack(targetColony).call({ from: userAddress });

      // 2. 공격 트랜잭션 전송
      const tx = await contract.methods.attack(targetColony).send({
        from: userAddress,
      });

      alert("Colony attack successful! ⚔️ The opponent's HP has decreased!");

    } catch (error) {
      
      const msg = error.data?.message;
      if(!msg) {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      } else if (msg.includes("Cooldown")) {
        alert("You are Cooldown.");
      } else if(msg.includes("Colony is not at war.")){
        alert("Your Colony is not at war");
      } else if(msg.includes("Invalid enemy")) {
        alert("Invalid enemy.");
      } else {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      }

    } finally {
      await refreshData();
      setIsLoading(false);
      await levelUpCheck();
    }

  };

  const handleDefend = async () => {
    if (!window.ethereum) {
      alert("You need to install Metamask or other Web3 Wallet.");
      return;
    }
    
    const targetColony = colonyData.enemy;

    if (!targetColony || targetColony === NULL_DATA) {
      alert("Your Colony is not at war");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      await contract.methods.defend().call({ from: userAddress });

      // 3. 공격 트랜잭션 전송
      const tx = await contract.methods.defend().send({
        from: userAddress,
      });

      alert("Colony defense successful! 🛡️ Our colony's HP has increased!");

    } catch (error) {
      const msg = error.data?.message;
      if(!msg) {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      } else if (msg.includes("Cooldown")) {
        alert("You are Cooldown.");
      } else if(msg.includes("Colony is not at war.")){
        alert("Your Colony is not at war");
      } else {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      }

    } finally {
      await refreshData();
      setIsLoading(false);
      await levelUpCheck();
    }
  };

  const handleDevelop = async () => {
    if (!window.ethereum) {
      alert("You need to install Metamask or other Web3 Wallet.");
      return;
    }
    
    const targetColony = colonyData.enemy;
    const now = Date.now();
    if (targetColony !== NULL_DATA && now >= Number(userData.warStartTime) * 1000 && now <= Number(userData.warEndTime)*1000) {
      alert("Your Colony is not truce.");
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];
      
      const web3 = new Web3(window.ethereum);
      web3.eth.handleRevert = true;
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      await contract.methods.developColony().call({ from: userAddress });

      // 2. 도시개발 트랜잭션 전송
      const tx = await contract.methods.developColony().send({
        from: userAddress,
      });

      alert("Colony development successful. Crik-crik🦗\n" + tx.transactionHash);

    } catch (error) {
      const msg = error.data?.message;
      if(!msg) {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      } else if (msg.includes("Cooldown")) {
        alert("You are Cooldown.");
      } else if(msg.includes("Not in colony")) {
        alert("You are not in a colony. join colony first.");
      } else {
        alert("failed to develop : " + (error.message || "Unknown Error"));
      }
    } finally {
      await refreshData();
      setIsLoading(false);
      await levelUpCheck();
    }
  };

  if(isDataLoading || userData == undefined) {
    <aside className="w-96 p-4 border-l ...">
      <div className="text-center py-10 text-gray-500">Data Loading...</div>
    </aside>
  }
  else {
    return (
      <aside className="w-[400px] bg-[#E5E7EB] hidden xl:block shrink-0 p-4 overflow-y-auto">
        <div className="space-y-4">

          {isWarTime ? 
          (
            // 전쟁 중: 전쟁 끝까지 남은 시간
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
              ⚔️ Remains to finish the War : {formatTime(remainingTime)}
            </div>
          ) : remainingTime > 0 ? (
            // 평상시: 전쟁 시작까지 남은 시간
            <div className="bg-orange-400 text-white px-4 py-2 rounded-lg text-center font-semibold">
              ⏰ Remains to start the War : {formatTime(remainingTime)}
            </div>
          ):(null)}

          {/* 캐릭터 이미지 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="aspect-video bg-gradient-to-b from-sky-300 via-green-200 to-yellow-100 rounded-lg overflow-hidden relative">
              {/* ANT COLONY 로고 타입 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-yellow-400 drop-shadow-lg" style={{ textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000' }}>
                    ANT
                  </div>
                  <div className="text-5xl font-black text-green-400 drop-shadow-lg mt-1" style={{ textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000' }}>
                    COLONY
                  </div>
                </div>
              </div>
              {/* 개미 아이콘 */}
              <div className="absolute bottom-4 right-4 text-6xl">🐜</div>
              <div className="absolute top-4 left-4 text-4xl">🌿</div>
            </div>
            
            {/* 액션 버튼 영역 */}
            <div className="mt-4">

              {isWarTime ? (
                // 전쟁 중: 공격/방어 버튼
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                          onClick={handleAttack}>
                    <Swords className="w-5 h-5" />
                    Attack
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                          onClick={handleDefend}>
                    <Shield className="w-5 h-5" />
                    Defend
                  </button>
                </div>
              ) : (
                // 평상시: 콜로니 개발 버튼
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                        onClick={handleDevelop}>
                  <Hammer className="w-5 h-5" />
                  Develop my colony
                </button>

              )}
            </div>
          </div>

          {/* 캐릭터 정보 */}
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {/* 소속 Colony */}
            <div className="px-4 py-3">
              <div className="text-sm text-gray-600">My Colony :</div>
              {((userData.colony == NULL_DATA) || !userData.colony) ?
                <div className="text-lg font-bold text-gray-900">Not in a colony</div>
              :
                <div className="text-lg font-bold text-gray-900">{userData.colony}</div>
              }
              
            </div>

            {/* 유저 이름 */}
            <div className="px-4 py-3">
              <div className="text-sm text-gray-600">Name :</div>
              <div className="text-lg font-bold text-gray-900">{fetchedMyName}</div>
            </div>

            {/* 유저 레벨 */}
            <div className="px-4 py-3">
              <div className="text-sm text-gray-600">Level (XP) :</div>
              <div className="text-lg font-bold text-gray-900">
                {userData.level} ({userData.experience.toLocaleString()} XP)
              </div>
            </div>
          </div>

          {/* 스탯 정보 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-200">
              <StatRow label="Attack :" value={userData.attack} />
              <StatRow label="Defense :" value={userData.defense} />
              <StatRow label="Virality :" value={userData.virality} />
              <StatRow label="ChainPower :" value={userData.chainPower} />
              <StatRow label="Influence :" value={userData.virality} />
              <StatRow label="Unallocated Points :" value={userData.unallocatedPoints} />
            </div>
          </div>
        </div>
      </aside>
    )
  }

  }
  
  

function StatRow({ label, value }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-gray-900 font-bold text-lg">{value}</span>
    </div>
  )
}