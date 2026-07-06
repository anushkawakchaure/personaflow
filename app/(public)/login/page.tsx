"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-surface to-bg">
      <div className="bg-surface/80 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-semibold text-text-primary">PersonaFlow</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent-dim transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-text-secondary text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
