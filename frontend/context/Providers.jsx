"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from "./UserContext";
import { LoadingProvider } from "./LoadingContext";

// 클라이언트는 매 요청마다 새 클라이언트를 만드는 대신,
// 한 번 생성된 인스턴스를 유지해야 합니다.
const queryClient = new QueryClient(); 

export function Providers({ children }) {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}