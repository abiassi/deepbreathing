"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useSync } from "@/lib/sync/use-sync";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string; image?: string | null } | null;
  syncSettings: (settings: { mode: string; speed: number; duration: number | null }) => void;
  syncStats: (totalMinutes: number) => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  syncSettings: () => {},
  syncStats: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const { mergeGuestData, hydrateFromServer, syncSettings, syncStats } =
    useSync(isAuthenticated);
  const hasMerged = useRef(false);

  // On first auth, merge guest data then hydrate
  useEffect(() => {
    if (!isAuthenticated || hasMerged.current) return;
    hasMerged.current = true;

    (async () => {
      await mergeGuestData();
      await hydrateFromServer();
    })();
  }, [isAuthenticated, mergeGuestData, hydrateFromServer]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: session?.user ?? null,
        syncSettings,
        syncStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
