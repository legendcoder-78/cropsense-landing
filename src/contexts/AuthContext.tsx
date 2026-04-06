import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { UserProfile } from "@/lib/types";
import { getCurrentUser, saveUserProfile } from "@/lib/auth";

interface AuthContextType {
  user: UserProfile | null;
  isModalOpen: boolean;
  modalMode: "signin" | "signup";
  openModal: (mode?: "signin" | "signup") => void;
  closeModal: () => void;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const handleStorage = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const openModal = useCallback((mode: "signin" | "signup" = "signin") => {
    setModalMode(mode);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      saveUserProfile(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isModalOpen, modalMode, openModal, closeModal, setUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
