"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState("global")

  const rankings = [
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
    { rank: 1, name: "C18~C16", ants: 123, members: 160 },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ranking</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8">
        <button
          onClick={() => setActiveTab("global")}
          className={`pb-2 text-lg font-semibold transition-colors relative ${
            activeTab === "global"
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          Global Anthill Rank
          {activeTab === "global" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`pb-2 text-lg font-semibold transition-colors relative ${
            activeTab === "personal"
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          Personal Rank in Anthill
          {activeTab === "personal" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
          )}
        </button>
      </div>

      {/* Ranking Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Global Anthill Rank */}
        <div>
          <div className="bg-[#FFF5E6] rounded-lg p-4 mb-4">
            <h3 className="text-center font-bold text-gray-900 mb-4">Global Anthill Rank</h3>
            
            <div className="space-y-3">
              {rankings.map((item, index) => (
                <RankingCard key={`global-${index}`} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Personal Rank in Anthill */}
        <div>
          <div className="bg-[#FFF5E6] rounded-lg p-4 mb-4">
            <h3 className="text-center font-bold text-gray-900 mb-4">Personal Rank in Anthill</h3>
            
            <div className="space-y-3">
              {rankings.map((item, index) => (
                <RankingCard key={`personal-${index}`} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RankingCard({ rank, name, ants, members }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-xl font-bold">#{rank}</span>
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <div className="w-8 h-8 rounded-full bg-gray-300 -ml-3" />
            <div className="w-8 h-8 rounded-full bg-gray-300 -ml-3" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-sm">{name}</div>
          <div className="text-xs text-gray-500 flex gap-4 mt-1">
            <span>ants {ants}</span>
            <span>members {members}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div className="text-xs text-gray-500">points and exp</div>
          <div className="font-bold text-gray-900">0000</div>
        </div>

        {/* Favorite Button */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
