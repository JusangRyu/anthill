"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MessageCircle,
  Repeat,
  Heart,
  Share,
  Users,
  Handshake,
  Check,
  XIcon,
  Clock,
} from "lucide-react"

import { getMyContract } from "../../../utils/ContractHelper"
import { NULL_DATA } from "../../../lib/contractInfo"
import { useLoading } from "../../../context/LoadingContext"
import { calculateTargetXP } from "../../../utils/LevelCalculator"
import { useUser } from "../../../context/UserContext"
import { getColonyHistory } from "../../../utils/ReadProperties"

export default function Colony() {

  const {isLoading, setIsLoading} = useLoading();
  const [hasColony, setHasColony] = useState(false);
  const [myColony, setMyColony] = useState();
  const [maxHealth, setMaxHealth] = useState(0);
  const [targetExp, setTargetExp] = useState(100000000);
  const [history, setHistory] = useState([]);

  const {userData, colonyData, isDataLoading, refreshData} = useUser();

  useEffect(() => {

    async function fetchData() {
      if (!userData || !colonyData || isDataLoading) {
        return; 
      }

      setIsLoading(true);

      if(colonyData?.memeCoin == NULL_DATA || colonyData?.memeCoin == undefined)
      {
        setHasColony(false);
      }
      else
      {
        let BASE_DURABILITY = await getMyContract().methods.BASE_DURABILITY()?.call();
        
        setHasColony(true);
        setMyColony(colonyData);
        setMaxHealth(BASE_DURABILITY * colonyData.level);
        setTargetExp(calculateTargetXP(colonyData.level));
        setHistory(await getColonyHistory(colonyData.memeCoin));
      }
      setIsLoading(false);
    }

    fetchData();
  }, [userData, colonyData]);

  const posts = [
    {
      id: 1,
      author: "Devon Lane",
      handle: "@johndue",
      time: "23s",
      content: "Let's attack!",
      stats: { comments: 61, retweets: 12, likes: "6.2K", shares: 61 }
    },
    {
      id: 2,
      author: "Devon Lane",
      handle: "@johndue",
      time: "23s",
      content: "Tom is in a big hurry.",
      image: "/astronaut-neon.jpg",
      stats: { comments: 61, retweets: 12, likes: "6.2K", shares: 61 }
    }
  ]

  // 콜로니 미가입 상태
  if (!hasColony) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            {/* 아이콘 */}
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            {/* 메시지 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">You have no colonies joined.</h2>
            <p className="text-gray-600 mb-8">
              Join a colony and work with other ants!
            </p>

            {/* Colonies 가입하러가기 버튼 */}
            <Link
              href="/game/colonies"
              className="inline-flex items-center gap-2 bg-[#E0C8FF] text-purple-900 font-semibold px-8 py-3 rounded-lg hover:bg-purple-300 transition-colors"
            >
              <Users className="w-5 h-5" />
              Join Colony
            </Link>
          </div>
        </div>
      </div>
    )
  } else {
    // 콜로니 가입 상태
    return (
      <div className="max-w-8xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Colony</h1>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Colony Info */}
          <div className="col-span-1 space-y-6">
            {/* Colony Icon & Name */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <div className="text-4xl">🏛️</div>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Colony Name
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{colonyData?.name}</h2>

              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Leader
              </div>
              <div className="text-gray-900 font-bold mb-4">{colonyData?.leader}</div>

              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Memeber Count
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{colonyData?.memberCount}</h2>

            </div>

            {/* Colony Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Colony Level
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">{colonyData?.level}</div>

              <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Colony XP</span>
                <span className="font-semibold text-gray-900">
                  {colonyData.colonyExp} / {targetExp.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 flex items-center justify-center"
                  style={{ width: `${(Number(colonyData.colonyExp) / Number(targetExp)) * 100}%` }}
                >
                  <span className="text-white text-xs font-bold">
                    {Math.round((Number(colonyData.colonyExp) / Number(targetExp)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                State of War
              </div>

              {(colonyData?.enemy !== NULL_DATA && Date.now() <= Number(userData?.warEndTime) * 1000)?
                <div className="text-xl font-bold text-red-600 mb-4"> At War </div>
                :
                <div className="text-xl font-bold text-green-600 mb-4"> Truce </div>
                
              }
              
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Colony Health
              </div>
              <div className="text-xl font-bold text-gray-900">
                {colonyData.durability.toLocaleString()} / {maxHealth.toLocaleString()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div 
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(colonyData?.health?.current / colonyData?.health?.max) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Invasions & Leader's Speech */}
          <div className="col-span-2 space-y-6">
            {/* Invasions Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900">History</h3>
              </div>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {history.map((msg) => (
                    <tr key={msg.blockNumber} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {msg.msg} (Block Number : {msg.blockNumber})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leader's Speech */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-4">Leader's Speech</h3>
              <div className="space-y-4">
                {posts.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function Post({ avatar, name, handle, time, content, image, stats }) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-4">
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="w-12 h-12 rounded-full object-cover bg-gray-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{name}</span>
            <span className="text-gray-500 text-sm">{handle}</span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">{time}</span>
          </div>
          <p className="text-gray-900 mb-3">{content}</p>

          {image && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-gray-100">
              <img src={image || "/placeholder.svg"} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pr-12 mt-2">
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{stats.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 group">
              <div className="p-2 rounded-full group-hover:bg-green-50">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-xs">{stats.retweets}</span>
            </button>
            <button className="flex items-center gap-2 text-pink-500 hover:text-pink-600 group">
              <div className="p-2 rounded-full group-hover:bg-pink-50">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs">{stats.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50">
                <Share className="w-4 h-4" />
              </div>
              <span className="text-xs">{stats.shares}</span>
            </button>
          </div>

          <button className="text-purple-400 text-xs mt-2 hover:underline">Show this thread</button>
        </div>
      </div>
    </div>
  )
}
