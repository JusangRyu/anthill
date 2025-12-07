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
  Share,
  Plus,
  Settings,
  UserPlus
} from "lucide-react"

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      author: "Devon Lane",
      handle: "@johndue",
      time: "23s",
      content: "Tom is in a big hurry.",
      image: "/astronaut-neon.jpg",
      stats: { comments: 61, retweets: 12, likes: "6.2K", shares: 61 }
    },
    {
      id: 2,
      author: "Darlene Robertson",
      handle: "@johndue",
      time: "23s",
      content: "Tom is in a big hurry.",
      image: "/dining-room.jpg",
      stats: { comments: 61, retweets: 12, likes: "6.2K", shares: 61 }
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Community Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Community Name</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for colony name"
              className="pl-4 pr-10 py-2 rounded-full border border-gray-300 bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        {/* Community Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            <img src="/diverse-group-avatars.png" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/pandoran-bioluminescent-forest.png" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/astronaut-neon.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/dining-room.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/placeholder-user.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
          </div>
          <span className="text-gray-700 font-semibold">2.5M Members</span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Describe your community's purpose and vision.<br/>
            Highlight unique features and what members can look...
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <UserPlus className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  )
}

function Post({ author, handle, time, content, image, stats }) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-4">
        <img
          src="/diverse-group-avatars.png"
          alt={author}
          className="w-12 h-12 rounded-full object-cover bg-gray-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{author}</span>
            <span className="text-gray-500 text-sm">{handle}</span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">{time}</span>
          </div>
          <p className="text-gray-900 mb-3">{content}</p>

          {image && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-gray-100">
              <img src={image} alt="Post content" className="w-full h-auto object-cover" />
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
