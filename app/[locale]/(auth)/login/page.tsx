"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Check if user is admin to redirect appropriately
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-2xl font-semibold text-text-primary text-center mb-8">
        {t("login")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-sans text-text-secondary mb-2"
          >
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            autoComplete="email"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors font-sans"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-sans text-text-secondary mb-2"
          >
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors font-sans"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 font-sans bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-background font-sans font-medium py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : t("loginCta")}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <Link
          href="/forgot-password"
          className="block text-sm text-text-muted hover:text-gold transition-colors font-sans"
        >
          {t("forgotPassword")}
        </Link>

        <p className="text-sm text-text-muted font-sans">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-gold hover:text-gold-light transition-colors"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
