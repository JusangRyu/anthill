"use client"

import { useState } from "react"
import { Search, Send, Paperclip, Smile, MoreVertical } from "lucide-react"

export default function DMPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Devon Lane",
      avatar: "/diverse-group-avatars.png",
      lastMessage: "Hey, how's the colony doing?",
      time: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Darlene Robertson",
      avatar: "/pandoran-bioluminescent-forest.png",
      lastMessage: "Thanks for the help earlier!",
      time: "1h ago",
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: "Esther Howard",
      avatar: "/astronaut-neon.jpg",
      lastMessage: "Can we schedule a meeting?",
      time: "3h ago",
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: "Cameron Williamson",
      avatar: "/dining-room.jpg",
      lastMessage: "Great work on the project!",
      time: "1d ago",
      unread: 0,
      online: false
    }
  ]

  const messages = [
    { id: 1, sender: "them", text: "Hey, how's the colony doing?", time: "10:30 AM" },
    { id: 2, sender: "me", text: "Great! We just expanded to a new area.", time: "10:32 AM" },
    { id: 3, sender: "them", text: "That's awesome! How many members now?", time: "10:33 AM" },
    { id: 4, sender: "me", text: "We're up to 250 members!", time: "10:35 AM" },
    { id: 5, sender: "them", text: "Wow, that's impressive growth!", time: "10:36 AM" }
  ]

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                selectedChat === conv.id ? "bg-purple-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 truncate">{conv.name}</span>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-400 text-white text-xs rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/diverse-group-avatars.png"
              alt="Devon Lane"
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
            />
            <div>
              <h2 className="font-bold text-gray-900">Devon Lane</h2>
              <span className="text-xs text-green-500">Online</span>
            </div>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === "me"
                    ? "bg-purple-400 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className={`text-xs mt-1 block ${
                  msg.sender === "me" ? "text-purple-100" : "text-gray-500"
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="p-2 bg-purple-400 hover:bg-purple-500 rounded-full transition-colors">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
