"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-text-primary mb-4">
          Vérifiez votre email
        </h2>
        <p className="text-text-secondary font-sans text-sm leading-relaxed mb-6">
          Un email de confirmation a été envoyé à{" "}
          <span className="text-text-primary font-medium">{email}</span>.
          <br />
          Cliquez sur le lien pour activer votre compte.
        </p>
        <Link
          href="/login"
          className="text-sm text-gold hover:text-gold-light transition-colors font-sans"
        >
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-2xl font-semibold text-text-primary text-center mb-8">
        {t("register")}
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
            autoComplete="new-password"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors font-sans"
          />
          <p className="mt-1.5 text-xs text-text-muted font-sans">
            Minimum 6 caractères
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-sans text-text-secondary mb-2"
          >
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
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
          {loading ? "..." : t("registerCta")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-muted font-sans">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="text-gold hover:text-gold-light transition-colors"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
