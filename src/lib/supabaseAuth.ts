import { supabase } from "./supabase";
import type { UserProfile } from "./types";

export interface SupabaseProfile extends UserProfile {
  avatar_url?: string;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) throw error;

  await supabase.auth.signOut();

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function updateProfile(profile: Partial<SupabaseProfile>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.auth.updateUser({
    data: {
      name: profile.name,
      region: profile.region,
      crops: profile.crops,
    },
  });

  if (error) throw error;
}

export async function getCurrentUserProfile(): Promise<SupabaseProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "User",
    email: user.email ?? "",
    region: user.user_metadata?.region ?? "punjab",
    crops: user.user_metadata?.crops ?? [],
    avatar_url: user.user_metadata?.avatar_url,
  };
}

export function onAuthStateChange(
  callback: (user: SupabaseProfile | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await getCurrentUserProfile();
      callback(profile);
    } else {
      callback(null);
    }
  });

  return subscription;
}
