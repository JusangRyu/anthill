// app/layout.jsx
import LayoutContent from "../components/LayoutContent";
import { LoadingProvider } from "../context/LoadingContext";
import "./globals.css";

export const metadata = {
  title: "The Anthill",
  description: "Web3 Wallet Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <LoadingProvider>
          <LayoutContent message={"Login Processing"}>
            {children}
          </LayoutContent>
        </LoadingProvider>
      </body>
    </html>
  );
}