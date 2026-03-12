import { z } from "zod";

export const photoSchema = z.object({
  title: z.string().min(1, "Le titre est requis").min(3, "Minimum 3 caractères"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
  image_hd_url: z.string().optional().default(""),
  thumbnail_url: z.string().optional().default(""),
  location: z.string().optional().default(""),
  taken_at: z.string().optional().default(""),
  camera_info: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_header: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
  featured_order: z.coerce.number().int().optional().nullable(),
  header_order: z.coerce.number().int().optional().nullable(),
  meta_title: z.string().max(60, "Maximum 60 caractères").optional().default(""),
  meta_description: z.string().max(160, "Maximum 160 caractères").optional().default(""),
  width: z.coerce.number().int().optional().nullable(),
  height: z.coerce.number().int().optional().nullable(),
  category_ids: z.array(z.string()).optional().default([]),
});

export type PhotoFormData = z.infer<typeof photoSchema>;

export const photoVariantSchema = z.object({
  size_id: z.string().uuid(),
  price: z.coerce.number().positive("Le prix doit être positif"),
  compare_at_price: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional().default(""),
  stock: z.coerce.number().int().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type PhotoVariantFormData = z.infer<typeof photoVariantSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional().default(""),
  cover_image_url: z.string().optional().default(""),
  display_order: z.coerce.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const promoCodeSchema = z.object({
  code: z.string().min(1, "Le code est requis").transform((v) => v.toUpperCase()),
  description: z.string().optional().default(""),
  discount_type: z.enum(["percentage", "fixed_amount"]),
  discount_value: z.coerce.number().positive("La valeur doit être positive"),
  min_order_amount: z.coerce.number().optional().nullable(),
  max_uses: z.coerce.number().int().optional().nullable(),
  max_uses_per_customer: z.coerce.number().int().optional().nullable(),
  starts_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type PromoCodeFormData = z.infer<typeof promoCodeSchema>;

export const orderUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  tracking_number: z.string().optional().default(""),
  tracking_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional().default(""),
});

export type OrderUpdateFormData = z.infer<typeof orderUpdateSchema>;

export const shippingZoneSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  countries: z.array(z.string()).min(1, "Au moins un pays requis"),
  base_price: z.coerce.number().min(0, "Le prix doit être positif ou nul"),
  free_shipping_threshold: z.coerce.number().optional().nullable(),
  estimated_days_min: z.coerce.number().int().positive(),
  estimated_days_max: z.coerce.number().int().positive(),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export type ShippingZoneFormData = z.infer<typeof shippingZoneSchema>;
