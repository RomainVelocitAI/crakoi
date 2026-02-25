"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/account`,
      }
    );

    if (resetError) {
      setError(resetError.message);
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
          Email envoyé
        </h2>
        <p className="text-text-secondary font-sans text-sm leading-relaxed mb-6">
          Si un compte existe pour{" "}
          <span className="text-text-primary font-medium">{email}</span>, vous
          recevrez un lien de réinitialisation.
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
      <h2 className="font-serif text-2xl font-semibold text-text-primary text-center mb-4">
        {t("forgotPassword")}
      </h2>

      <p className="text-sm text-text-secondary font-sans text-center mb-8">
        {t("resetText")}
      </p>

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
          {loading ? "..." : t("resetCta")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-text-muted hover:text-gold transition-colors font-sans"
        >
          {t("login")}
        </Link>
      </div>
    </div>
  );
}
