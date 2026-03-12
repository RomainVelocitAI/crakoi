import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/navigation";
import { User, Mail, Phone, MapPin, ArrowRight, ShoppingBag } from "lucide-react";
import LogoutButton from "@/components/account/LogoutButton";

export async function generateMetadata() {
  const t = await getTranslations("account");
  return { title: t("title") };
}

export default async function AccountPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("account");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const memberSince = new Date(user.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");

  const addressParts = [
    profile?.address_line1,
    profile?.address_line2,
    [profile?.postal_code, profile?.city].filter(Boolean).join(" "),
    profile?.country,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-primary">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {t("memberSince")} {memberSince}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Profile card */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="font-serif text-xl font-medium text-text-primary mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-gold" />
          {t("profile")}
        </h2>

        <div className="space-y-4">
          {/* Name */}
          {fullName && (
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">
                  {t("name")}
                </p>
                <p className="text-text-primary">{fullName}</p>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">
                {t("email")}
              </p>
              <p className="text-text-primary">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          {profile?.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">
                  {t("phone")}
                </p>
                <p className="text-text-primary">{profile.phone}</p>
              </div>
            </div>
          )}

          {/* Address */}
          {addressParts.length > 0 && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">
                  {t("address")}
                </p>
                {addressParts.map((line, i) => (
                  <p key={i} className="text-text-primary">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders link */}
      <Link
        href="/orders"
        className="flex items-center justify-between bg-surface border border-border rounded-lg p-6 hover:border-gold/30 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-gold" />
          <span className="font-serif text-lg text-text-primary">
            {t("orders")}
          </span>
        </div>
        <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-gold transition-colors" />
      </Link>
    </div>
  );
}
