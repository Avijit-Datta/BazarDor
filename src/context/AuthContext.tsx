import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import type { AppUser } from "../types";

/**
 * This project runs as a static Vite SPA without a dedicated backend server,
 * so a full BetterAuth server session can't be hosted here. To still honor
 * the required API shape (email/password + social sign-in, session, update
 * user) this module implements a small local "auth client" that mirrors
 * BetterAuth's public interface (signIn.email, signIn.social, signUp.email,
 * signOut, updateUser) while persisting accounts & sessions in
 * localStorage. Swapping this file for the real `better-auth/react` client
 * against a hosted BetterAuth server is a drop-in change.
 */

interface StoredUser extends AppUser {
  password?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithSocial: (provider: "google" | "github") => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<Pick<AppUser, "name">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "bazardor_users";
const SESSION_KEY = "bazardor_session";

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=15803d&color=fff&bold=true&size=128`;
}

function sanitize(u: StoredUser): AppUser {
  const { password: _password, ...rest } = u;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const found = readUsers().find((u) => u.email === email);
      if (found) setUser(sanitize(found));
    }
    setLoading(false);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    }
    localStorage.setItem(SESSION_KEY, found.email);
    setUser(sanitize(found));
  }, []);

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে।");
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      avatar: avatarFor(name),
      provider: "credentials",
    };
    writeUsers([...users, newUser]);
  }, []);

  const signInWithSocial = useCallback(async (provider: "google" | "github") => {
    await new Promise((r) => setTimeout(r, 700));
    const name = provider === "google" ? "Google ব্যবহারকারী" : "GitHub ব্যবহারকারী";
    const email = `${provider}.user@example.com`;
    const users = readUsers();
    let found = users.find((u) => u.email === email);
    if (!found) {
      found = {
        id: crypto.randomUUID(),
        name,
        email,
        avatar: avatarFor(name),
        provider,
      };
      writeUsers([...users, found]);
    }
    localStorage.setItem(SESSION_KEY, found.email);
    setUser(sanitize(found));
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    toast.success("আপনি সাইন আউট হয়েছেন।");
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<Pick<AppUser, "name">>) => {
      if (!user) throw new Error("User not signed in");
      await new Promise((r) => setTimeout(r, 400));
      const users = readUsers();
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx === -1) throw new Error("ব্যবহারকারী পাওয়া যায়নি।");
      const updated: StoredUser = {
        ...users[idx],
        ...updates,
        avatar: updates.name ? avatarFor(updates.name) : users[idx].avatar,
      };
      users[idx] = updated;
      writeUsers(users);
      setUser(sanitize(updated));
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithSocial,
      signOut,
      updateUser,
    }),
    [user, loading, signInWithEmail, signUpWithEmail, signInWithSocial, signOut, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
