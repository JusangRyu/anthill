"use client"

import { Globe, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { handleItemClick } from "../utils/ReadProperties"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="h-16 bg-[#E0C8FF] flex items-center px-4 shrink-0 z-10">
      <Link href="/" className="flex items-center gap-2 w-64">
        <div className="text-white p-1.5 rounded-full">
          <img 
                src="/logo.png" // public 폴더에 저장된 파일 경로 (경로를 실제 파일 이름으로 변경하세요!)
                alt="Anthill" 
                className="w-6 h-6" // SVG에 적용했던 클래스를 여기에 적용하여 크기를 맞춥니다.
            />
        </div>
        <span className="text-xl font-bold text-black tracking-tight">Anthill</span>
      </Link>

      <nav className="flex items-center gap-8 ml-4">
        <SidebarItem icon={Globe} label="Colonies" href="/game/colonies" active={isActive("/colonies")} />
        <SidebarItem icon={Users} label="Consultation" href="/game/consultation" active={isActive("/consultation")} />
      </nav>
    </header>
  )
}

function SidebarItem({ icon: Icon, label, active = false, href }) {
  const router = useRouter();
    
  const handleClick = async () => {
    await handleItemClick(); 
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