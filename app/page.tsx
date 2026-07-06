"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg text-text-secondary">Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-surface to-bg">
      <div className="bg-surface/80 backdrop-blur-sm p-10 rounded-2xl border border-border shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-accent/10">
            <Sparkles className="w-12 h-12 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">PersonaFlow</h1>
        <p className="text-text-secondary mb-8">Shopper Intelligence · Rules Engine</p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-accent text-white py-3 rounded-xl hover:bg-accent-dim transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full border border-border text-text-secondary py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
