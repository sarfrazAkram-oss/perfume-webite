"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, signInAdmin } from "@/lib/firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPassword = password.trim();

    if (!normalizedPassword) {
      setAuthError("Password is required.");
      return;
    }

    try {
      setIsSigningIn(true);
      setAuthError("");
      await signInAdmin(email.trim(), normalizedPassword, ADMIN_EMAIL);
      router.replace("/admin-dashboard");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Invalid email or password");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="grid min-h-[100dvh] w-full place-items-center bg-[#F6F0E8] px-4 py-10 text-black sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_14px_35px_rgba(0,0,0,0.07)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          Admin Access
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="mt-2 text-sm text-black/60">
          Sign in with your Firebase Authentication admin account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-black/80">Email</span>
            <input
              type="email"
              value={email}
              readOnly
              className="h-11 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-[14px] outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-black/80">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-2xl border border-black/10 px-4 text-[14px] outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
              placeholder="Enter your password"
            />
          </label>

          {authError && <p className="text-xs text-red-600">{authError}</p>}

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}