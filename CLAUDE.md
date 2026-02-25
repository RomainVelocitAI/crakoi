# Crackoï — E-commerce Tirages Photo

## Présentation du projet

Site e-commerce pour **Eric Lamblin**, photographe professionnel basé à La Réunion, spécialisé en photographie sous-marine (baleines, dauphins) et terrestre. Le site remplace le portfolio existant sur crackoi.com et ajoute la vente de tirages photo (impressions physiques).

Le site combine **galerie portfolio** (vitrine artistique) et **boutique en ligne** (vente de tirages dans différentes tailles). Il inclut aussi une page dédiée au livre "Dans l'intimité des baleines".

- **Client** : Eric Lamblin — lamblineric@gmail.com
- **Domaine** : crackoi.com
- **Agence** : VelocitAI (Romain)

---

## Stack technique

- **Framework** : Next.js 14 (App Router, Server Components, Server Actions)
- **Base de données** : Supabase (Auth, Database, Edge Functions, Storage)
- **Paiement** : Stripe (Checkout Session — compte à créer)
- **Styling** : Tailwind CSS + shadcn/ui
- **Langage** : TypeScript (mode strict)
- **Déploiement** : Netlify
- **i18n** : Bilingue FR/EN (next-intl)

---

## Architecture du projet

```
/app
├── /[locale]              # FR/EN via next-intl
│   ├── /(shop)            # Routes boutique
│   │   ├── /page.tsx      # Homepage (featured photos + hero)
│   │   ├── /gallery       # Galerie portfolio par catégorie
│   │   ├── /photos/[slug] # Fiche produit (photo + choix taille + panier)
│   │   ├── /cart           # Panier
│   │   ├── /checkout       # Checkout (guest ou connecté)
│   │   ├── /order-confirmation  # Confirmation post-paiement
│   │   ├── /collections/[slug]  # Page catégorie/collection
│   │   ├── /book           # Page livre "Dans l'intimité des baleines"
│   │   ├── /about          # Page Eric Lamblin (bio + parcours)
│   │   └── /contact        # Contact
│   ├── /(account)          # Espace client (auth requise)
│   │   ├── /account        # Profil + adresse
│   │   └── /orders         # Historique commandes
│   ├── /(auth)
│   │   ├── /login
│   │   ├── /register
│   │   └── /forgot-password
│   └── /(admin)            # Dashboard admin (rôle admin requis)
│       ├── /admin
│       ├── /admin/photos
│       ├── /admin/categories
│       ├── /admin/orders
│       ├── /admin/promo-codes
│       └── /admin/shipping
├── /api
│   └── /webhooks/stripe    # Webhook Stripe (Route Handler)
/components
├── /ui                     # shadcn/ui components
├── /shop                   # Composants boutique (ProductCard, CartDrawer, etc.)
├── /gallery                # Composants galerie (Lightbox, PhotoGrid, etc.)
├── /admin                  # Composants admin (DataTable, Forms, etc.)
└── /layout                 # Header, Footer, Navigation
/lib
├── supabase/
│   ├── client.ts           # createBrowserClient
│   ├── server.ts           # createServerClient
│   └── admin.ts            # createServiceRoleClient (Edge Functions uniquement)
├── stripe/
│   ├── client.ts           # Stripe client-side
│   └── server.ts           # Stripe server-side
├── i18n/
│   ├── config.ts
│   └── request.ts
└── utils/
    ├── formatPrice.ts
    ├── slugify.ts
    └── cart.ts             # Logique panier (localStorage côté client)
/messages
├── fr.json                 # Traductions françaises
└── en.json                 # Traductions anglaises
/types
└── supabase.ts             # Types auto-générés (npx supabase gen types typescript)
```

---

## Base de données Supabase

Documentation complète : voir `SUPABASE_DATABASE.md` dans ce même dossier.

### Tables principales

| Table | Rôle |
|-------|------|
| `profiles` | Utilisateurs (admin/customer), extension de auth.users |
| `categories` | Collections thématiques (Sous l'eau, Sur terre, etc.) |
| `photos` | Catalogue photos avec métadonnées (lieu, date, appareil, SEO) |
| `photo_categories` | Liaison N:N photos ↔ catégories |
| `sizes` | Tailles de tirage (S, M, L, XL) |
| `photo_variants` | Prix par combinaison photo + taille |
| `promo_codes` | Codes promo (% ou montant fixe) |
| `orders` | Commandes (numéro auto CRK-YYYYMM-XXXXX) |
| `order_items` | Lignes de commande (snapshots prix/titre au moment achat) |
| `shipping_zones` | Zones livraison (La Réunion, France Métro, International) |

### Enums

- `user_role` : admin, customer
- `order_status` : pending, paid, processing, shipped, delivered, cancelled, refunded

### Storage Buckets

- `photos-web` (public) : Images watermarkées pour affichage web
- `photos-hd` (privé, admin only) : Originales HD pour impression
- `assets` (public) : Covers catégories, assets divers

### Helpers et triggers

- `is_admin()` : Fonction RLS helper
- Auto-création profil à l'inscription
- Auto-update `updated_at` sur toutes les tables
- Auto-génération `order_number` format CRK-YYYYMM-XXXXX

---

## Conventions de code

### Structure et nommage

- Composants dans `/components/{feature}/` — PascalCase (`ProductCard.tsx`)
- Server Actions dans `/app/[locale]/{route}/actions.ts`
- Types Supabase auto-générés dans `/types/supabase.ts`
- Utilitaires dans `/lib/{domaine}/`
- **Nommage français** pour le contenu visible, **anglais** pour le code

### Supabase côté serveur

Toujours utiliser `createServerClient()` dans les Server Components et Server Actions. Ne jamais utiliser le service_role côté client. Pour les opérations admin sensibles, passer par des Server Actions avec vérification du rôle.

### Patterns de données

```typescript
// SERVER COMPONENT — Fetch avec cache Next.js
const supabase = await createServerClient();
const { data: photos } = await supabase
  .from('photos')
  .select('*, photo_variants(*, sizes(*))')
  .eq('is_published', true)
  .order('created_at', { ascending: false });

// SERVER ACTION — Mutation
'use server'
export async function addToCart(variantId: string, quantity: number) {
  // Validation + logique
}
```

### Panier

Le panier est géré côté client via `localStorage` (pas de table panier en BDD). Structure :

```typescript
type CartItem = {
  variantId: string;
  photoId: string;
  photoTitle: string;
  photoSlug: string;
  thumbnailUrl: string;
  sizeLabel: string;
  price: number;
  quantity: number;
};
```

### Checkout

Guest checkout activé — le client peut acheter sans créer de compte. S'il est connecté, ses infos de livraison sont pré-remplies. La commande est toujours liée à un `customer_id` (création de compte silencieuse ou compte existant).

---

## i18n — Internationalisation

Bilingue FR/EN avec `next-intl`. Le français est la locale par défaut.

- Routes préfixées par locale : `/fr/gallery`, `/en/gallery`
- Fichiers de traduction dans `/messages/fr.json` et `/messages/en.json`
- Utiliser `useTranslations('namespace')` dans les Client Components
- Utiliser `getTranslations('namespace')` dans les Server Components
- Le contenu des photos (titre, description) est stocké en français dans Supabase — la traduction du contenu dynamique est hors scope initial

---

## Design et UI

### Direction artistique

**Sombre et élégant, style galerie d'art.** Le design doit mettre les photos en valeur — c'est le produit principal.

- **Fond** : Noir / gris très foncé (#0a0a0a, #141414)
- **Texte** : Blanc / gris clair pour le contraste
- **Accents** : Couleur subtile pour les CTA (à définir — bleu océan ou doré)
- **Typographie** : Serif élégant pour les titres, sans-serif clean pour le corps
- **Espacement** : Généreux, laisser respirer les photos
- **Images** : Toujours le point focal — grandes, sans distraction

### Composants clés

- **Lightbox** : Zoom haute qualité sur les photos, navigation clavier, swipe mobile. Librairie recommandée : `yet-another-react-lightbox` ou équivalent
- **Galerie** : Grille masonry ou grille responsive avec effet hover subtil
- **Fiche produit** : Photo grande à gauche, sélecteur taille + prix à droite, ajout panier
- **Navigation** : Header transparent sur la homepage (hero full-screen), solid sur les autres pages

---

## Stripe — Paiement

Compte Stripe à créer. En attendant, utiliser les clés de test.

### Flow de paiement

1. Client remplit le panier (localStorage)
2. Client va au checkout, remplit adresse de livraison
3. Server Action crée la commande en BDD (status: pending)
4. Server Action crée une Stripe Checkout Session avec les line items
5. Redirect vers Stripe Checkout
6. Webhook `checkout.session.completed` → update commande status: paid + `paid_at`
7. Redirect vers page confirmation avec `order_number`

### Webhook

Route Handler dans `/app/api/webhooks/stripe/route.ts`. Vérifier la signature Stripe. Événements à gérer :
- `checkout.session.completed` → passer la commande en `paid`
- `payment_intent.payment_failed` → logger l'erreur

---

## SEO

- `meta_title` et `meta_description` sur chaque photo pour les pages produit
- Générer un `sitemap.xml` dynamique (toutes les photos publiées + catégories)
- OpenGraph images pour le partage social
- Schema.org Product sur les fiches produit
- Schema.org ImageGallery sur les pages galerie
- Balises `hreflang` pour le bilingue FR/EN

---

## Commandes utiles

```bash
# Développement
npm run dev

# Build
npm run build

# Types Supabase
npx supabase gen types typescript --project-id xgjcndfpvmukulwmafml > types/supabase.ts

# Migrations Supabase
npx supabase db push

# Déploiement
# Auto via Netlify (push sur main)
```

---

## Priorités de développement

1. **Scaffold** : Setup Next.js 14, Tailwind, shadcn/ui, next-intl, Supabase client
2. **Galerie** : Homepage hero, grille photos, pages catégories, lightbox
3. **Fiche produit** : Page photo avec sélecteur taille/prix, ajout panier
4. **Panier + Checkout** : Cart drawer, page checkout, intégration Stripe
5. **Admin** : Dashboard commandes, CRUD photos/catégories/tailles/promos
6. **Page livre** : Page dédiée "Dans l'intimité des baleines"
7. **Espace client** : Profil, historique commandes
8. **SEO + Perf** : Sitemap, metadata, optimisation images, Lighthouse
