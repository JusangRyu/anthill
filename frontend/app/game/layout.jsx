import "../globals.css"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import RightPanel from "../../components/RightPanel"
import LayoutContent from "../../components/LayoutContent"
import { Providers } from "../../context/Providers";

export default async function RootLayout({ children }) {
  return (
    <Providers>
      <LayoutContent message={"Loading"}>
        <div className="min-h-screen flex flex-col font-sans">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 bg-white overflow-y-auto border-r border-gray-100">{children}</main>
            <RightPanel/>
          </div>
        </div>
      </LayoutContent>
      </Providers>
  )
}
