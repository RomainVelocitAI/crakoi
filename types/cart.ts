export interface CartItem {
  variantId: string;
  photoId: string;
  photoTitle: string;
  photoSlug: string;
  thumbnailUrl: string;
  sizeLabel: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: number;
}
