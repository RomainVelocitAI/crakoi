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
  ClipboardList,
  ArrowLeft,
  Image as ImageIcon,
  Star,
} from "lucide-react";

interface NavChild {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
}

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "dashboard" },
  {
    href: "/admin/photos",
    icon: Camera,
    labelKey: "photos",
    children: [
      { href: "/admin/photos/header", icon: ImageIcon, labelKey: "headerPhotos" },
      { href: "/admin/photos/highlights", icon: Star, labelKey: "highlightPhotos" },
    ],
  },
  { href: "/admin/categories", icon: FolderOpen, labelKey: "categories" },
  { href: "/admin/orders", icon: ShoppingBag, labelKey: "orders" },
  { href: "/admin/promo-codes", icon: Tag, labelKey: "promoCodes" },
  { href: "/admin/shipping", icon: Truck, labelKey: "shipping" },
  { href: "/admin/activity", icon: ClipboardList, labelKey: "activityLog" },
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
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans transition-colors",
                  isActive
                    ? "text-gold bg-gold/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t(item.labelKey)}
              </Link>

              {/* Sub-items */}
              {item.children && isActive && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = pathname === child.href || pathname.endsWith(child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-sans transition-colors",
                          isChildActive
                            ? "text-gold bg-gold/10"
                            : "text-text-muted hover:text-text-primary hover:bg-surface"
                        )}
                      >
                        <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                        {t(child.labelKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToSite")}
        </Link>
      </div>
    </aside>
  );
}
