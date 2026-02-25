# Crakoi — Documentation Base de Données Supabase

## Projet

- **Type** : E-commerce de vente de tirages photo (impressions physiques)
- **Stack** : Next.js 14 + Supabase + Stripe
- **URL Supabase** : `https://xgjcndfpvmukulwmafml.supabase.co`
- **Anon Key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnamNuZGZwdm11a3Vsd21hZm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTMxMjksImV4cCI6MjA4NTY2OTEyOX0.QDNnTVCRPj_eheD45Hc8guIEb3YogtzilgCQ2XR1BVQ`

---

## Architecture des Tables

### Vue d'ensemble

```
profiles (auth)
├── orders
│   └── order_items → photo_variants
│       ├── photos
│       │   └── photo_categories → categories
│       └── sizes
├── promo_codes (via orders.promo_code_id)
└── shipping_zones (standalone)
```

### 1. `profiles` — Utilisateurs

Extension de `auth.users`. Auto-créé via trigger à l'inscription.

| Colonne         | Type          | Défaut       | Notes                    |
|-----------------|---------------|--------------|--------------------------|
| id              | uuid (PK)     |              | FK → auth.users.id       |
| role            | user_role     | `'customer'` | enum: `admin`, `customer` |
| first_name      | text          | null         |                          |
| last_name       | text          | null         |                          |
| email           | text          | null         |                          |
| phone           | text          | null         |                          |
| address_line1   | text          | null         |                          |
| address_line2   | text          | null         |                          |
| city            | text          | null         |                          |
| postal_code     | text          | null         |                          |
| country         | text          | `'FR'`       |                          |
| created_at      | timestamptz   | `now()`      |                          |
| updated_at      | timestamptz   | `now()`      | Auto-update via trigger  |

### 2. `categories` — Collections thématiques

| Colonne         | Type          | Défaut       | Notes        |
|-----------------|---------------|--------------|--------------|
| id              | uuid (PK)     | `gen_random_uuid()` |       |
| name            | text          | —            | Requis       |
| slug            | text (UNIQUE) | —            | Requis       |
| description     | text          | null         |              |
| cover_image_url | text          | null         |              |
| display_order   | integer       | `0`          | Tri admin    |
| is_visible      | boolean       | `true`       | Visibilité publique |
| created_at      | timestamptz   | `now()`      |              |
| updated_at      | timestamptz   | `now()`      | Auto-update  |

### 3. `photos` — Catalogue principal

| Colonne          | Type          | Défaut       | Notes                      |
|------------------|---------------|--------------|----------------------------|
| id               | uuid (PK)     | `gen_random_uuid()` |                     |
| title            | text          | —            | Requis                     |
| slug             | text (UNIQUE) | —            | Requis                     |
| description      | text          | null         |                            |
| image_url        | text          | —            | Image web (watermarkée)    |
| image_hd_url     | text          | null         | Image HD (bucket privé)    |
| thumbnail_url    | text          | null         | Miniature                  |
| location         | text          | null         | Lieu de prise de vue       |
| taken_at         | date          | null         | Date de prise de vue       |
| camera_info      | text          | null         | Appareil / objectif        |
| tags             | text[]        | `'{}'`       | Tags libres                |
| is_published     | boolean       | `false`      | Visible côté public        |
| is_featured      | boolean       | `false`      | Mise en avant homepage     |
| featured_order   | integer       | `0`          | Ordre d'affichage featured |
| meta_title       | text          | null         | SEO                        |
| meta_description | text          | null         | SEO                        |
| view_count       | integer       | `0`          | Compteur de vues           |
| created_at       | timestamptz   | `now()`      |                            |
| updated_at       | timestamptz   | `now()`      | Auto-update                |

### 4. `photo_categories` — Liaison N:N photos ↔ catégories

| Colonne     | Type | Notes                    |
|-------------|------|--------------------------|
| photo_id    | uuid | PK composée, FK → photos |
| category_id | uuid | PK composée, FK → categories |

### 5. `sizes` — Tailles de tirage

| Colonne       | Type    | Défaut              | Notes          |
|---------------|---------|----------------------|----------------|
| id            | uuid (PK) | `gen_random_uuid()` |              |
| name          | text    | —                    | ex: `S`, `M`, `L`, `XL` |
| label         | text    | —                    | ex: `20x30 cm` |
| width_cm      | numeric | null                 |                |
| height_cm     | numeric | null                 |                |
| display_order | integer | `0`                  |                |
| is_active     | boolean | `true`               |                |
| created_at    | timestamptz | `now()`          |                |

### 6. `photo_variants` — Prix par combinaison photo + taille

| Colonne          | Type    | Défaut              | Notes                        |
|------------------|---------|----------------------|------------------------------|
| id               | uuid (PK) | `gen_random_uuid()` |                            |
| photo_id         | uuid    | —                    | FK → photos                  |
| size_id          | uuid    | —                    | FK → sizes                   |
| price            | numeric | —                    | Prix de vente en EUR         |
| compare_at_price | numeric | null                 | Prix barré (promotions)      |
| sku              | text    | null                 | Référence produit            |
| stock            | integer | null                 | null = stock illimité        |
| is_active        | boolean | `true`               |                              |
| created_at       | timestamptz | `now()`          |                              |
| updated_at       | timestamptz | `now()`          | Auto-update                  |

### 7. `promo_codes` — Codes promotionnels

| Colonne              | Type        | Défaut   | Notes                             |
|----------------------|-------------|----------|-----------------------------------|
| id                   | uuid (PK)   | `gen_random_uuid()` |                        |
| code                 | text (UNIQUE)| —       | Code saisi par le client          |
| description          | text        | null     |                                   |
| discount_type        | text        | —        | `'percentage'` ou `'fixed_amount'` |
| discount_value       | numeric     | —        | CHECK > 0                         |
| min_order_amount     | numeric     | `0`      | Montant minimum de commande       |
| max_uses             | integer     | null     | null = illimité                   |
| current_uses         | integer     | `0`      |                                   |
| max_uses_per_customer| integer     | `1`      |                                   |
| starts_at            | timestamptz | `now()`  |                                   |
| expires_at           | timestamptz | null     | null = pas d'expiration           |
| is_active            | boolean     | `true`   |                                   |
| created_at           | timestamptz | `now()`  |                                   |
| updated_at           | timestamptz | `now()`  | Auto-update                       |

### 8. `orders` — Commandes

| Colonne                    | Type          | Défaut       | Notes                          |
|----------------------------|---------------|--------------|--------------------------------|
| id                         | uuid (PK)     | `gen_random_uuid()` |                         |
| order_number               | text (UNIQUE) | Auto-généré  | Format: `CRK-YYYYMM-00001`    |
| customer_id                | uuid          | —            | FK → profiles                  |
| status                     | order_status  | `'pending'`  | Voir enum ci-dessous           |
| subtotal                   | numeric       | `0`          |                                |
| discount_amount            | numeric       | `0`          |                                |
| shipping_amount            | numeric       | `0`          |                                |
| total                      | numeric       | `0`          |                                |
| promo_code_id              | uuid          | null         | FK → promo_codes               |
| stripe_payment_intent_id   | text          | null         |                                |
| stripe_checkout_session_id | text          | null         |                                |
| shipping_first_name        | text          | null         | Snapshot adresse au moment     |
| shipping_last_name         | text          | null         | de la commande                 |
| shipping_address_line1     | text          | null         |                                |
| shipping_address_line2     | text          | null         |                                |
| shipping_city              | text          | null         |                                |
| shipping_postal_code       | text          | null         |                                |
| shipping_country           | text          | `'FR'`       |                                |
| shipping_phone             | text          | null         |                                |
| tracking_number            | text          | null         | Numéro de suivi                |
| tracking_url               | text          | null         | Lien de suivi                  |
| notes                      | text          | null         | Notes admin                    |
| paid_at                    | timestamptz   | null         |                                |
| shipped_at                 | timestamptz   | null         |                                |
| delivered_at               | timestamptz   | null         |                                |
| created_at                 | timestamptz   | `now()`      |                                |
| updated_at                 | timestamptz   | `now()`      | Auto-update                    |

**Index** : `customer_id`, `status`, `stripe_payment_intent_id`

### 9. `order_items` — Lignes de commande

| Colonne          | Type    | Défaut              | Notes                              |
|------------------|---------|----------------------|------------------------------------|
| id               | uuid (PK) | `gen_random_uuid()` |                                  |
| order_id         | uuid    | —                    | FK → orders (CASCADE DELETE)       |
| photo_variant_id | uuid    | —                    | FK → photo_variants                |
| photo_title      | text    | —                    | Snapshot du titre au moment achat  |
| size_label       | text    | —                    | Snapshot de la taille              |
| unit_price       | numeric | —                    | Snapshot du prix                   |
| quantity         | integer | `1`                  | CHECK > 0                          |
| line_total       | numeric | —                    | unit_price × quantity              |
| created_at       | timestamptz | `now()`          |                                    |

### 10. `shipping_zones` — Zones de livraison

| Colonne                 | Type     | Défaut   | Notes                     |
|-------------------------|----------|----------|---------------------------|
| id                      | uuid (PK)| `gen_random_uuid()` |                |
| name                    | text     | —        | ex: `La Réunion`, `France Métro` |
| countries               | text[]   | `'{}'`   | Codes pays ISO            |
| base_price              | numeric  | `0`      | Frais de port en EUR      |
| free_shipping_threshold | numeric  | null     | Montant pour livraison gratuite |
| estimated_days_min      | integer  | null     |                           |
| estimated_days_max      | integer  | null     |                           |
| is_active               | boolean  | `true`   |                           |
| display_order           | integer  | `0`      |                           |
| created_at              | timestamptz | `now()` |                          |
| updated_at              | timestamptz | `now()` | Auto-update              |

---

## Enums

```sql
CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
```

---

## Fonctions & Triggers

### `is_admin()` — Helper RLS

```sql
-- Retourne true si l'utilisateur connecté est admin
SELECT public.is_admin(); -- boolean
```

### Trigger `on_auth_user_created`

Auto-crée un `profiles` à chaque inscription dans `auth.users`. Le rôle est `customer` par défaut, sauf si `raw_user_meta_data.role` est spécifié.

### Trigger `set_updated_at`

Auto-met à jour `updated_at` sur : `profiles`, `categories`, `photos`, `photo_variants`, `promo_codes`, `orders`, `shipping_zones`.

### Trigger `set_order_number`

Auto-génère `order_number` au format `CRK-YYYYMM-XXXXX` via séquence `order_number_seq`.

---

## RLS Policies (Row Level Security)

Toutes les tables ont RLS activé.

### Logique générale

| Rôle       | Lecture                            | Écriture         |
|------------|------------------------------------|------------------|
| Anonyme    | Photos publiées, catégories visibles, tailles actives, promos valides, zones actives | Aucune |
| Customer   | + ses propres commandes et profil  | Créer commandes, modifier son profil |
| Admin      | Tout                               | Tout             |

### Détail par table

| Table            | Public (SELECT)                     | Customer                  | Admin |
|------------------|-------------------------------------|---------------------------|-------|
| profiles         | ❌                                  | Son propre profil (R/W)   | ALL   |
| categories       | `is_visible = true`                 | idem                      | ALL   |
| photos           | `is_published = true`               | idem                      | ALL   |
| photo_categories | ✅ tous                             | idem                      | ALL   |
| sizes            | `is_active = true`                  | idem                      | ALL   |
| photo_variants   | `is_active = true`                  | idem                      | ALL   |
| promo_codes      | `is_active = true` + non expiré     | idem                      | ALL   |
| orders           | ❌                                  | Ses propres commandes (R/W) | ALL |
| order_items      | ❌                                  | Via ownership de l'order  | ALL   |
| shipping_zones   | `is_active = true`                  | idem                      | ALL   |

---

## Storage Buckets

| Bucket       | Accès  | Taille max | Types MIME                        | Usage                            |
|--------------|--------|------------|-----------------------------------|----------------------------------|
| `photos-web` | Public | 10 MB      | jpeg, png, webp                   | Images watermarkées pour le site |
| `photos-hd`  | Privé  | 50 MB      | jpeg, png, tiff                   | Originales HD pour impression    |
| `assets`     | Public | 5 MB       | jpeg, png, webp, svg              | Covers catégories, assets divers |

### Policies Storage

- **Lecture publique** : `photos-web`, `assets`
- **Lecture privée (admin only)** : `photos-hd`
- **Écriture** : Admin uniquement sur les 3 buckets

### URLs des images

```
# Image web publique
https://xgjcndfpvmukulwmafml.supabase.co/storage/v1/object/public/photos-web/{path}

# Image HD (nécessite auth admin)
https://xgjcndfpvmukulwmafml.supabase.co/storage/v1/object/photos-hd/{path}

# Assets publics
https://xgjcndfpvmukulwmafml.supabase.co/storage/v1/object/public/assets/{path}
```

---

## Requêtes Supabase courantes

### Récupérer les photos publiées avec leurs catégories et variantes

```typescript
const { data } = await supabase
  .from('photos')
  .select(`
    *,
    photo_categories(
      categories(id, name, slug)
    ),
    photo_variants(
      *,
      sizes(*)
    )
  `)
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

### Récupérer les photos mises en avant

```typescript
const { data } = await supabase
  .from('photos')
  .select('*, photo_variants(*, sizes(*))')
  .eq('is_published', true)
  .eq('is_featured', true)
  .order('featured_order', { ascending: true });
```

### Récupérer les photos d'une catégorie par slug

```typescript
const { data } = await supabase
  .from('categories')
  .select(`
    *,
    photo_categories(
      photos(*, photo_variants(*, sizes(*)))
    )
  `)
  .eq('slug', categorySlug)
  .eq('is_visible', true)
  .single();
```

### Créer une commande

```typescript
// 1. Créer la commande
const { data: order } = await supabase
  .from('orders')
  .insert({
    customer_id: userId,
    subtotal,
    discount_amount,
    shipping_amount,
    total,
    promo_code_id,
    shipping_first_name,
    shipping_last_name,
    shipping_address_line1,
    shipping_city,
    shipping_postal_code,
    shipping_country,
  })
  .select()
  .single();

// 2. Insérer les items
const { data: items } = await supabase
  .from('order_items')
  .insert(
    cartItems.map(item => ({
      order_id: order.id,
      photo_variant_id: item.variantId,
      photo_title: item.photoTitle,
      size_label: item.sizeLabel,
      unit_price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
    }))
  );
```

### Valider un code promo

```typescript
const { data: promo } = await supabase
  .from('promo_codes')
  .select('*')
  .eq('code', userCode.toUpperCase())
  .eq('is_active', true)
  .single();

if (promo) {
  const isValid =
    (!promo.expires_at || new Date(promo.expires_at) > new Date()) &&
    (!promo.max_uses || promo.current_uses < promo.max_uses);
}
```

### Admin : récupérer toutes les commandes

```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    profiles(first_name, last_name, email),
    order_items(*, photo_variants(photos(title, thumbnail_url), sizes(label))),
    promo_codes(code)
  `)
  .order('created_at', { ascending: false });
```

---

## Conventions de nommage

- **Tables** : snake_case, pluriel (`photos`, `order_items`)
- **Colonnes** : snake_case (`is_published`, `created_at`)
- **FK** : `{table_singulier}_id` (`photo_id`, `customer_id`)
- **Booleans** : préfixe `is_` (`is_active`, `is_published`, `is_featured`)
- **Timestamps** : suffixe `_at` (`created_at`, `paid_at`, `shipped_at`)
- **Slugs** : UNIQUE, utilisés pour les URLs (`/photos/{slug}`, `/collections/{slug}`)

---

## Notes techniques

- **Paiement** : Stripe (Checkout Session → Payment Intent)
- **Auth** : Email/password pour l'admin, Supabase Auth
- **Numéros de commande** : Auto-générés `CRK-YYYYMM-XXXXX`
- **Snapshots** : Les `order_items` stockent titre, taille et prix au moment de l'achat (le prix peut changer après)
- **Stock** : `null` dans `photo_variants.stock` = stock illimité
- **Featured** : Utiliser `is_featured` + `featured_order` sur la table `photos` pour gérer la mise en avant
- **SEO** : `meta_title` et `meta_description` sur `photos` pour les pages produit
