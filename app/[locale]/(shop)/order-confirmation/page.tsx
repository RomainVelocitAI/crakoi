import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "orderConfirmation" });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { order_number?: string };
}) {
  const t = await getTranslations("orderConfirmation");
  const orderNumber = searchParams.order_number || "---";

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success checkmark */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text-primary mb-4">
          {t("title")}
        </h1>

        {/* Thank you text */}
        <p className="text-text-secondary text-base sm:text-lg mb-8 font-sans">
          {t("text")}
        </p>

        {/* Order number */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-10">
          <p className="text-sm text-text-muted mb-2 font-sans">
            {t("orderNumber")}
          </p>
          <p className="text-2xl font-mono font-semibold text-gold tracking-wider">
            {orderNumber}
          </p>
        </div>

        {/* Back to home button */}
        <Link
          href="/"
          className="inline-block bg-gold hover:bg-gold-light text-background font-semibold py-3.5 px-8 rounded-lg transition-colors font-sans text-base"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
