"use client";

import {
  browserLocalPersistence,
  type AuthError,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseApp } from "./firebase";

const auth = getAuth(firebaseApp);
export const ADMIN_EMAIL = "miansarfaraz206905@gmail.com";
const ADMIN_PASSWORD = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "Sarfaraz576949").trim();
const LOCAL_ADMIN_SESSION_KEY = "og-admin-session-email";

export interface AdminAuthUser {
  email: string;
  source: "firebase" | "local";
}

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readLocalAdminSession() {
  if (!hasBrowserStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
  return value ? value.trim().toLowerCase() : null;
}

function writeLocalAdminSession(email: string) {
  if (!hasBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, email.trim().toLowerCase());
}

function clearLocalAdminSession() {
  if (!hasBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
}

function isFirebaseAuthError(error: unknown): error is AuthError {
  return Boolean(error && typeof error === "object" && "code" in error);
}

function mapAuthError(error: unknown) {
  const authError = error as AuthError;

  switch (authError.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password";
    case "auth/user-not-found":
      return "Invalid email or password";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/invalid-email":
      return "Invalid email or password";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    default:
      return "Invalid email or password";
  }
}

export async function signInAdmin(
  email: string,
  password: string,
  allowedEmail = ADMIN_EMAIL,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedAllowedEmail = allowedEmail.trim().toLowerCase();

  if (!normalizedAllowedEmail) {
    throw new Error("Admin access is not configured. Set NEXT_PUBLIC_ADMIN_EMAIL.");
  }

  if (normalizedEmail !== normalizedAllowedEmail) {
    throw new Error("Access denied. Admin only.");
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);

    if (credential.user.email?.toLowerCase() !== normalizedAllowedEmail) {
      await signOut(auth);
      throw new Error("Access denied. Admin only.");
    }

    writeLocalAdminSession(normalizedAllowedEmail);
    return {
      email: normalizedAllowedEmail,
      source: "firebase" as const,
    };
  } catch (error) {
    if (!isFirebaseAuthError(error)) {
      throw error;
    }

    // Fallback admin login so the panel is still reachable if Firebase Auth rejects credentials.
    if (normalizedEmail === normalizedAllowedEmail && password === ADMIN_PASSWORD) {
      writeLocalAdminSession(normalizedAllowedEmail);
      return {
        email: normalizedAllowedEmail,
        source: "local" as const,
      };
    }

    throw new Error(mapAuthError(error));
  }
}

export function observeAdminAuth(callback: (user: AdminAuthUser | null) => void) {
  const currentFirebaseEmail = auth.currentUser?.email?.toLowerCase();

  if (currentFirebaseEmail) {
    writeLocalAdminSession(currentFirebaseEmail);
    callback({
      email: currentFirebaseEmail,
      source: "firebase",
    });
  } else {
    const localEmail = readLocalAdminSession();
    callback(
      localEmail
        ? {
            email: localEmail,
            source: "local",
          }
        : null,
    );
  }

  return onAuthStateChanged(auth, (user) => {
    if (user?.email) {
      const normalizedEmail = user.email.toLowerCase();
      writeLocalAdminSession(normalizedEmail);
      callback({
        email: normalizedEmail,
        source: "firebase",
      });
      return;
    }

    const localEmail = readLocalAdminSession();
    callback(
      localEmail
        ? {
            email: localEmail,
            source: "local",
          }
        : null,
    );
  });
}

export async function signOutAdmin() {
  clearLocalAdminSession();

  try {
    await signOut(auth);
  } catch {
    // Ignore sign-out errors when there is no active Firebase session.
  }
}
