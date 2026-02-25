import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-wider text-text-secondary hover:text-text-primary transition-colors"
          >
            CRACKOÏ
          </Link>

          {/* Links */}
          <div className="flex gap-6 text-sm text-text-muted">
            <Link
              href="/about"
              className="hover:text-text-secondary transition-colors"
            >
              {t("legal")}
            </Link>
            <Link
              href="/about"
              className="hover:text-text-secondary transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/about"
              className="hover:text-text-secondary transition-colors"
            >
              {t("cgv")}
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            {t("rights", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
