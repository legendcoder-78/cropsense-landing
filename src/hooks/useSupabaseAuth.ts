import { useContext, useState } from "react";
import { SupabaseAuthContext } from "@/contexts/SupabaseAuthContext";
import {
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  updateProfile,
} from "@/lib/supabaseAuth";
import type { SupabaseProfile } from "@/lib/supabaseAuth";
import { toast } from "sonner";

export function useSupabaseAuth() {
  const { user, isAuthenticated, loading } = useContext(SupabaseAuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [authLoading, setAuthLoading] = useState(false);

  const openModal = (mode: "signin" | "signup" = "signin") => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    setAuthLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      toast.success("Account created! Please sign in.");
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      toast.error(message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success("Signed in successfully!");
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      toast.error(message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.info("Signed out");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      toast.error(message);
    }
  };

  const handleUpdateProfile = async (profile: Partial<SupabaseProfile>) => {
    try {
      await updateProfile(profile);
      toast.success("Profile updated");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    isModalOpen,
    modalMode,
    authLoading,
    openModal,
    closeModal,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };
}
