"use client"

import { ShoppingCart, Star, Filter } from "lucide-react"
import { useState } from "react"

export default function ShopPage() {
  const [cart, setCart] = useState(0)

  const categories = ["All", "Power-ups", "Cosmetics", "Boosters", "Special Items"]

  const products = [
    {
      id: 1,
      name: "XP Booster",
      description: "Double your XP gain for 24 hours",
      price: 500,
      currency: "Ant Coins",
      rating: 4.5,
      image: "/placeholder.svg",
      category: "Boosters"
    },
    {
      id: 2,
      name: "Colony Skin Pack",
      description: "Customize your colony with unique themes",
      price: 1200,
      currency: "Ant Coins",
      rating: 4.8,
      image: "/placeholder.svg",
      category: "Cosmetics"
    },
    {
      id: 3,
      name: "Resource Multiplier",
      description: "Increase resource gathering by 50%",
      price: 800,
      currency: "Ant Coins",
      rating: 4.3,
      image: "/placeholder.svg",
      category: "Power-ups"
    },
    {
      id: 4,
      name: "Legendary Ant Avatar",
      description: "Exclusive avatar design for your profile",
      price: 2000,
      currency: "Ant Coins",
      rating: 4.9,
      image: "/placeholder.svg",
      category: "Cosmetics"
    },
    {
      id: 5,
      name: "Defense Shield",
      description: "Protect your colony from attacks for 48h",
      price: 1500,
      currency: "Ant Coins",
      rating: 4.6,
      image: "/placeholder.svg",
      category: "Power-ups"
    },
    {
      id: 6,
      name: "Speed Boost",
      description: "Increase ant movement speed by 30%",
      price: 600,
      currency: "Ant Coins",
      rating: 4.4,
      image: "/placeholder.svg",
      category: "Boosters"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Enhance your colony with premium items</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#E0C8FF] px-6 py-3 rounded-full">
            <span className="font-bold text-purple-900">💰 12,450 Ant Coins</span>
          </div>
          
          <button className="relative p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cart > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 text-gray-700" />
        </button>
        
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              index === 0
                ? "bg-purple-400 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => setCart(cart + 1)}
          />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ name, description, price, currency, rating, image, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-6xl">🐜</div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-purple-600">{price.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{currency}</div>
          </div>
          
          <button
            onClick={onAddToCart}
            className="bg-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors font-medium text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
