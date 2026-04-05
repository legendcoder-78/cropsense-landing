import type { UserProfile } from "./types";

const USERS_KEY = "cropsense_users";
const CURRENT_USER_KEY = "cropsense_current_user";
const PASSWORDS_KEY = "cropsense_passwords";

function getUsers(): Record<string, { name: string; email: string }> {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function getPasswords(): Record<string, string> {
  const raw = localStorage.getItem(PASSWORDS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, { name: string; email: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function savePasswords(passwords: Record<string, string>) {
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function signUp(name: string, email: string, password: string): { user: UserProfile | null; error: string | null } {
  const users = getUsers();
  const passwords = getPasswords();

  if (users[email]) {
    return { user: null, error: "An account with this email already exists" };
  }

  if (password.length < 6) {
    return { user: null, error: "Password must be at least 6 characters" };
  }

  const id = generateId();
  users[email] = { name, email };
  passwords[email] = password;

  saveUsers(users);
  savePasswords(passwords);

  const user: UserProfile = {
    id,
    name,
    email,
    region: "karnataka",
    crops: [],
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { user, error: null };
}

export function signIn(email: string, password: string): { user: UserProfile | null; error: string | null } {
  const users = getUsers();
  const passwords = getPasswords();

  if (!users[email]) {
    return { user: null, error: "No account found with this email" };
  }

  if (passwords[email] !== password) {
    return { user: null, error: "Incorrect password" };
  }

  const existingProfile = localStorage.getItem(`cropsense_profile_${email}`);
  let profile: UserProfile;

  if (existingProfile) {
    profile = JSON.parse(existingProfile);
  } else {
    profile = {
      id: generateId(),
      name: users[email].name,
      email,
      region: "karnataka",
      crops: [],
    };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  return { user: profile, error: null };
}

export function signOut() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): UserProfile | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  localStorage.setItem(`cropsense_profile_${profile.email}`, JSON.stringify(profile));
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
