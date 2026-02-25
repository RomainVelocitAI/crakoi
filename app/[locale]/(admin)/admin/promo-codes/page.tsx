import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Tag } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("promoCodes") };
}

export default async function AdminPromoCodesPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: promoCodes } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      {/* Header */}
      <h1 className="font-serif text-2xl font-semibold text-white mb-8">
        {t("promoCodes")}
      </h1>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {!promoCodes || promoCodes.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
            <Tag className="h-10 w-10 mx-auto mb-3 text-text-muted" />
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-normal">
                    {t("promoCode")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("discountType")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("discountValue")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("usageCount")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((promo: any) => {
                  const isExpired = promo.expires_at
                    ? new Date(promo.expires_at) < new Date()
                    : false;
                  const isMaxedOut = promo.max_uses
                    ? promo.current_uses >= promo.max_uses
                    : false;
                  const isActive =
                    promo.is_active && !isExpired && !isMaxedOut;

                  const typeLabel =
                    promo.discount_type === "percentage"
                      ? t("percentage")
                      : t("fixedAmount");

                  const valueDisplay =
                    promo.discount_type === "percentage"
                      ? `${Number(promo.discount_value)}%`
                      : `${Number(promo.discount_value).toFixed(2)} \u20AC`;

                  const usageDisplay = promo.max_uses
                    ? `${promo.current_uses} / ${promo.max_uses}`
                    : `${promo.current_uses}`;

                  return (
                    <tr
                      key={promo.id}
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-white font-mono text-sm font-medium">
                          {promo.code}
                        </span>
                        {promo.description && (
                          <p className="text-xs text-text-muted mt-0.5">
                            {promo.description}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {typeLabel}
                      </td>
                      <td className="px-5 py-3 text-white font-medium">
                        {valueDisplay}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {usageDisplay}
                      </td>
                      <td className="px-5 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                            {t("active")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            {t("inactive")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
