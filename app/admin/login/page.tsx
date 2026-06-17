"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, setAuthToken, ApiError } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await loginAdmin(email, password);
      setAuthToken(token);
      router.push("/admin/dashboard");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not reach the server";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-charcoal-roof overflow-hidden">
      {/* Signature: a faint grid of lit "windows" across the dark facade */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 38px, var(--color-window-gold) 38px, var(--color-window-gold) 40px), repeating-linear-gradient(90deg, transparent, transparent 58px, var(--color-window-gold) 58px, var(--color-window-gold) 60px)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal-roof to-transparent" />

      <div className="relative z-10 w-full max-w-sm px-8">
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-window-gold mb-3">
            NyumbaTZ
          </p>
          <h1 className="font-display text-4xl text-mist">Admin Dashboard</h1>
          <p className="font-body text-sm text-stone-grey mt-2">
            Sign in to manage your property listings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-mist/[0.04] border border-mist/10 rounded-lg p-8 backdrop-blur-sm"
        >
          <div className="mb-5">
            <label htmlFor="email" className="block font-body text-xs uppercase tracking-wide text-stone-grey mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal-roof border border-mist/15 rounded-md px-4 py-2.5 font-body text-mist placeholder:text-stone-grey/60 focus:outline-none focus:border-window-gold transition-colors"
              placeholder="admin@nyumbatz.co.tz"
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-body text-xs uppercase tracking-wide text-stone-grey mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal-roof border border-mist/15 rounded-md px-4 py-2.5 font-body text-mist placeholder:text-stone-grey/60 focus:outline-none focus:border-window-gold transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-brick-red mb-5" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-mist font-body font-medium py-2.5 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
