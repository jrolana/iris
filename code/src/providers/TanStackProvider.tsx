"use client"; // Mark this as a Client Component
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function TanStackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long the data stays "fresh" before refetching (in milliseconds)
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Used for debugging during development. Adds a logo to interact and see React Query state */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
