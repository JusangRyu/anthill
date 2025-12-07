"use client"

import { Home, User, FileText, Trophy, ShoppingCart, Send, HelpCircle, Palmtree } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { handleItemClick } from "../utils/ReadProperties"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="w-24 bg-[#E0C8FF] flex flex-col items-center py-4 gap-8 shrink-0 overflow-y-auto">
      <nav className="flex flex-col items-center gap-8 w-full">
        <SidebarItem icon={Home} label="Feed" href="/game/home" active={isActive("/")} />
        <SidebarItem icon={User} label="My" href="/game/my" active={isActive("/my")} />
        <SidebarItem icon={Palmtree} label="Colony" href="/game/colony" active={isActive("/colony")} />
        <SidebarItem icon={FileText} label="Meeting" href="/game/meeting" active={isActive("/meeting")} />
        <SidebarItem icon={Trophy} label="Ranking" href="/game/ranking" active={isActive("/ranking")} />
        <SidebarItem icon={ShoppingCart} label="Shop" href="/game/shop" active={isActive("/shop")} />
        <SidebarItem icon={Send} label="Message" href="/game/dm" active={isActive("/dm")} />
      </nav>

      <div className="mt-auto pt-8">
        <SidebarItem icon={HelpCircle} label="Help" href="/help" active={isActive("/help")} />
      </div>
    </aside>
  )
}

function SidebarItem({ icon: Icon, label, active = false, href }) {
  const router = useRouter();
    
  // Server Action을 form action 대신 onClick 핸들러에서 호출
  const handleClick = async () => {
      // 1. Server Action을 호출하여 데이터 변경 및 재검증 요청
      await handleItemClick(); 
      
      // 2. 데이터 변경이 완료되면 클라이언트 측에서 수동으로 페이지 이동 요청
      // revalidatePath가 Layout을 갱신하는 동안 페이지 이동을 수행합니다.
      router.push(href); 
  };

  return (
    <button
            onClick={handleClick}
            className={`flex flex-col items-center gap-1 w-full py-2 hover:bg-black/5 transition-colors ${
                active ? "text-black" : "text-black/70"
            }`}
        >
        <Icon className={`w-6 h-6 ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
        <span className={`text-xs ${active ? "font-bold" : "font-medium"}`}>{label}</span>
        
    </button>
  )
}
