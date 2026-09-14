"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";

/**
 * One QueryClient per browser session, created lazily inside useState so it
 * survives re-renders but never leaks across requests on the server (this
 * component only ever mounts client-side).
 */
export function QueryProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Draft/application state must never look fresher than it is —
            // individual hooks in app/_hooks/index.ts set tighter staleTime
            // where it matters (e.g. 0 for the resumed draft).
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
