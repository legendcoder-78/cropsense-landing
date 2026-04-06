import React, { createContext, useEffect, useState } from "react";
import type { SupabaseProfile } from "@/lib/supabaseAuth";
import { getCurrentUserProfile, onAuthStateChange } from "@/lib/supabaseAuth";

interface SupabaseAuthContextType {
  user: SupabaseProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
});

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const profile = await getCurrentUserProfile();
      setUser(profile);
      setLoading(false);
    };

    init();

    const subscription = onAuthStateChange((profile) => {
      setUser(profile);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};
