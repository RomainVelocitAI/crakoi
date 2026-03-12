import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import ShippingPageClient from "@/components/admin/ShippingPageClient";
import {
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from "./actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("shipping") };
}

export default async function AdminShippingPage() {
  const supabase = await createServerClient();

  const { data: zones } = await supabase
    .from("shipping_zones")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <ShippingPageClient
      zones={zones || []}
      createAction={createShippingZone}
      updateAction={updateShippingZone}
      deleteAction={deleteShippingZone}
    />
  );
}
