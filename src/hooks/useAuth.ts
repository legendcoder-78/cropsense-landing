import { useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { signUp, signIn, signOut } from "@/lib/auth";

export function useAuth() {
  const { user, isModalOpen, modalMode, openModal, closeModal, setUser, updateProfile } = useAuthContext();

  const handleSignUp = useCallback((name: string, email: string, password: string) => {
    const result = signUp(name, email, password);
    if (result.error) return { error: result.error };
    setUser(result.user);
    closeModal();
    return { error: null };
  }, [setUser, closeModal]);

  const handleSignIn = useCallback((email: string, password: string) => {
    const result = signIn(email, password);
    if (result.error) return { error: result.error };
    setUser(result.user);
    closeModal();
    return { error: null };
  }, [setUser, closeModal]);

  const handleSignOut = useCallback(() => {
    signOut();
    setUser(null);
  }, [setUser]);

  return {
    user,
    isAuthenticated: !!user,
    isModalOpen,
    modalMode,
    openModal,
    closeModal,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile,
  };
}
