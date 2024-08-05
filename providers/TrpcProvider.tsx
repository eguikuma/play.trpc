"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, type TRPCClient } from "@trpc/client";
import superjson from "superjson";

import type { ProviderProps } from "@/definitions/provider";
import { trpc } from "@/utils/trpc/client";
import type { AppRouter } from "@/utils/trpc/server";

export const TrpcProvider = ({ children }: ProviderProps) => {
  const [client] = useState<[QueryClient, TRPCClient<AppRouter>]>(() => [
    new QueryClient(),
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          async headers() {
            return {};
          },
          transformer: superjson,
        }),
      ],
    }),
  ]);

  return (
    <trpc.Provider queryClient={client[0]} client={client[1]}>
      <QueryClientProvider client={client[0]}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
