"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Camera,
  FolderOpen,
  ShoppingBag,
  Tag,
  Truck,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/admin/photos", icon: Camera, labelKey: "photos" as const },
  { href: "/admin/categories", icon: FolderOpen, labelKey: "categories" as const },
  { href: "/admin/orders", icon: ShoppingBag, labelKey: "orders" as const },
  { href: "/admin/promo-codes", icon: Tag, labelKey: "promoCodes" as const },
];

export default function AdminSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen flex flex-col">
      {/* Logo / Title */}
      <div className="p-6 border-b border-border">
        <h2 className="font-serif text-lg font-semibold text-white tracking-wider">
          CRACKO<span className="text-gold">I</span>
        </h2>
        <p className="text-xs text-text-muted mt-1">{t("title")}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin" || pathname === "/fr/admin" || pathname === "/en/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans transition-colors",
                isActive
                  ? "text-gold bg-gold/10"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToSite")}
        </Link>
      </div>
    </aside>
  );
}
