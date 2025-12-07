"use client"

import { Users, Globe, CirclePlus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useUser } from "../../../context/UserContext"
import { useLoading } from "../../../context/LoadingContext"
import { calculateTargetXP } from "../../../utils/LevelCalculator"
import { NULL_DATA } from "../../../lib/contractInfo"
import { useQuery } from "@tanstack/react-query"
import { getUsersInfo, getUserInfo } from "../../../utils/ReadProperties"

export default function MyPage() {
  const {userData, colonyData, isDataLoading, refreshData} = useUser();
  const {setIsLoading} = useLoading();
  const [myInfo, setMyInfo] = useState({
    displayName : "Unknown",
    profileImageUrl : "/placeholder-user.jpg",
    userNameTag : "",
  });

  const {data: userList, isLoading, error, isFetching} = useQuery({
        queryKey: ['userList'],
        queryFn : getUsersInfo
      }
  )
  
  const fetchedMyInfo = useMemo(() => {
        if (!userList || !userData) {
            return;
        }

        const foundUser = userList.find(user => 
            user.walletAddress.toLowerCase() === userData.walletAddr.toLowerCase()
        );

        if (foundUser) {
            return {
              userName : foundUser.userName,
              userNameTag : foundUser.userNameTag,
              walletAddress : foundUser.walletAddress
            };
        }
        return;

    }, [userList, userData]);

  useEffect(()=>{ 
    if(!userData || !colonyData || isDataLoading) {
      return;
    }

    async function fetchData() {
      if(fetchedMyInfo) {
        const result = await getUserInfo(fetchedMyInfo.userName, fetchedMyInfo.userNameTag);
        setMyInfo(result);
      }
    }

    fetchData();
  }, [userData, colonyData, fetchedMyInfo])

  // 구매 아이템 리스트
  const purchasedItems = [
    { id: 1, name: "XP Booster", date: "2024.12.10", price: 500, icon: "🚀", used: true },
    { id: 2, name: "Defense Shield", date: "2024.12.08", price: 1500, icon: "🛡️", used: false },
    { id: 3, name: "Attack Power Up", date: "2024.12.05", price: 800, icon: "⚔️", used: true },
    { id: 4, name: "Colony Skin Pack", date: "2024.12.01", price: 1200, icon: "🎨", used: false },
    { id: 5, name: "Speed Boost", date: "2024.11.28", price: 600, icon: "⚡", used: true },
    { id: 6, name: "Resource Multiplier", date: "2024.11.25", price: 900, icon: "💎", used: false },
  ]

  if(!userData || !colonyData || isDataLoading || !myInfo) {
      console.log(userData, colonyData, isDataLoading, myInfo)
      return (
        <div className="text-center">Loading...</div>
      )
  }
  else {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Info</h1>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-2 gap-6">

          {/* Top Left - Profile */}
          <div>
            {/* Profile Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile</h2>
              
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <img
                    src={myInfo.profileImageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover bg-gray-200 mb-2 border-4 border-purple-200"
                  />
                  <span className="text-xs text-gray-600">Level {userData.level}</span>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Users className="w-4 h-4" />
                        User name
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-black-700 mb-1">
                        {myInfo.displayName}
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Globe className="w-4 h-4" />
                        Handle
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-black-700 mb-1">
                        {myInfo.userNameTag}
                      </label>
                    </div>                  
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - Stats */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Stats</h2>
              
              <div className="space-y-4">
                {/* XP with Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">XP</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Level {userData.level}</span>
                    </div>
                  </div>
                  <ProgressBarComponent userData={userData} />
                </div>
                {/* 구분선 */}
                <div className="border-t border-gray-300"></div>

                {/* Stats - 숫자만 표시 */}
                <div className="space-y-3">
                  <StatNumber label="Attack" value={userData.attack} unallocatedPoints={userData.unallocatedPoints} />
                  <StatNumber label="Defense" value={userData.defense} unallocatedPoints={userData.unallocatedPoints}/>
                  <StatNumber label="Virality" value={userData.virality} unallocatedPoints={userData.unallocatedPoints}/>
                  <StatNumber label="ChainPower" value={userData.chainPower} unallocatedPoints={userData.unallocatedPoints}/>
                </div>
                
                {/* 구분선 */}
                <div className="border-t border-gray-300"></div>

                {/* Points - 숫자만 표시 */}
                <StatNumber label="Unallocated Stat Points" value={userData.unallocatedPoints} isStat={false} />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Colony</h2>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-3xl">
                    🏛️
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{colonyData.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (colonyData.enemy !== NULL_DATA && Date.now() <= Number(userData.warEndTime) * 1000)
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {(colonyData.enemy !== NULL_DATA && Date.now() <= Number(userData.warEndTime) * 1000)? "⚔️ At War" : "🕊️ Truce"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{colonyData.level}</div>
                    <div className="text-xs text-gray-600">Colony Level</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{colonyData.memberCount}</div>
                    <div className="text-xs text-gray-600">Members count</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right - Purchased Items */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Items</h2>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-600">Bought date : {item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600 text-sm">{item.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Ant Coins</div>
                    </div>
                    <div>
                      {item.used ? (
                        <span className="px-3 py-1 bg-gray-300 text-gray-600 text-xs font-medium rounded-full">
                          Used
                        </span>
                      ) : (
                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full hover:bg-green-600 transition-colors">
                          Use
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  }
  
function ProgressBarComponent({userData}) {
  const targetXP = calculateTargetXP(userData.level);
  const rawProgress = Number(userData.experience) / Number(targetXP);
  const safeProgressPercent = Math.min(100, Math.max(0, rawProgress * 100));

  return (
    <div className="relative w-full h-6 bg-gray-200 rounded-full"> {/* 부모 컨테이너 (Progress Bar 배경) */}

      <div
        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
        style={{ width: `${safeProgressPercent}%` }}
      />

      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {userData.experience.toLocaleString()}
      </div>

    </div>
  )
}

// 숫자만 표시하는 스탯 컴포넌트
function StatNumber({ label, value, isStat=true, unallocatedPoints }) {
  const handleStatClick = () => {

  }

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
      
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2"> 
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {(isStat && unallocatedPoints > 0) && (
          <CirclePlus onClick={handleStatClick}/>
          )}
      </div>
      
    </div>
  )
}
