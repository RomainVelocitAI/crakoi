"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  id: string;
  photo_title: string;
  size_label: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface OrderItemsExpanderProps {
  items: OrderItem[];
}

export default function OrderItemsExpander({ items }: OrderItemsExpanderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("account");

  if (items.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-gold transition-colors"
      >
        {t("orderItems")} ({items.length})
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 border-t border-border pt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left pb-2 font-normal">
                  {t("orderItems")}
                </th>
                <th className="text-left pb-2 font-normal">{t("size")}</th>
                <th className="text-right pb-2 font-normal">
                  {t("unitPrice")}
                </th>
                <th className="text-right pb-2 font-normal">
                  {t("quantity")}
                </th>
                <th className="text-right pb-2 font-normal">
                  {t("orderTotal")}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border/50">
                  <td className="py-2 text-white">{item.photo_title}</td>
                  <td className="py-2 text-text-secondary">
                    {item.size_label}
                  </td>
                  <td className="py-2 text-right text-text-secondary">
                    {item.unit_price.toFixed(2)} &euro;
                  </td>
                  <td className="py-2 text-right text-text-secondary">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-right text-white">
                    {item.line_total.toFixed(2)} &euro;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
