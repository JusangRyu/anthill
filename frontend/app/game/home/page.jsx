"use client"
import {
  Search,
  ImageIcon,
  FileVideo,
  AlignLeft,
  Smile,
  Calendar,
  MessageCircle,
  Repeat,
  Heart,
  Eye,
} from "lucide-react"
import { useEffect, useState } from "react";
import { getFeeds } from "../../../utils/ReadProperties";
import { useLoading } from "../../../context/LoadingContext";

export default function Home() {
  const [feeds, setFeeds] = useState([]);
  const {setIsLoading} = useLoading();

  useEffect(()=>{
    async function fetchFeed() {
      setIsLoading(true);
      const fetchedFeeds = await getFeeds();  
      setFeeds(fetchedFeeds);
      setIsLoading(false);
    };
    
    fetchFeed();
  }, []);
  

  return (
    <div className="max-w-3xl mx-auto">
      {/* Feed Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Feed</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for colony name"
            className="pl-4 pr-10 py-2 rounded-full border border-gray-300 bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Create Post */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-4">
          <img
            src="/diverse-group-avatars.png"
            alt="User"
            className="w-12 h-12 rounded-full object-cover bg-gray-200"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="What's happening?"
              className="w-full py-3 text-lg placeholder-gray-500 focus:outline-none"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-4 text-purple-400">
                <button className="hover:bg-purple-50 p-2 rounded-full transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="hover:bg-purple-50 p-2 rounded-full transition-colors">
                  <FileVideo className="w-5 h-5" />
                </button>
                <button className="hover:bg-purple-50 p-2 rounded-full transition-colors">
                  <AlignLeft className="w-5 h-5" />
                </button>
                <button className="hover:bg-purple-50 p-2 rounded-full transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="hover:bg-purple-50 p-2 rounded-full transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
              <button className="bg-[#E0C8FF] text-purple-900 font-semibold px-6 py-2 rounded-full hover:bg-purple-300 transition-colors">
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-100">
        {feeds?.contents?.map((post) => (
            <Post
              key = {post.id}
              avatar={post.postMeta?.creator?.profileImageUrl}
              name={post.postMeta?.creator?.displayName}
              handle={'@'+post.postMeta?.creator?.userName}
              time={post.postMeta?.createdAt}
              content={post.value}
              images={post.imageSrc}
              stats={{ comments: post.socialMeta?.replyCount, retweets: post.socialMeta?.repostCount, likes: post.socialMeta?.likeCount, shares: post.socialMeta?.viewCount }}
            />
          ))
        }
      </div>
    </div>
  )
}

function Post({ avatar, name, handle, time, content, images, stats }) {
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
          {images.map((image =>
            image && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-gray-100">
              <img src={image || "/placeholder.svg"} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )))}
          
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
                <Eye className="w-4 h-4" />
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
