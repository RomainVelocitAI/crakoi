import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import PromoCodePageClient from "@/components/admin/PromoCodePageClient";
import {
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  togglePromoCodeActive,
} from "./actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("promoCodes") };
}

export default async function AdminPromoCodesPage() {
  const supabase = await createServerClient();

  const { data: promoCodes } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PromoCodePageClient
      promoCodes={promoCodes || []}
      createAction={createPromoCode}
      updateAction={updatePromoCode}
      deleteAction={deletePromoCode}
      toggleActiveAction={togglePromoCodeActive}
    />
  );
}
