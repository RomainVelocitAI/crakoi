"use server";

// Placeholder server action for checkout
// TODO: Implement Stripe Checkout Session creation
export async function createCheckoutSession(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  items: {
    variantId: string;
    photoId: string;
    photoTitle: string;
    sizeLabel: string;
    price: number;
    quantity: number;
  }[];
}) {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a fake order number for now
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, "0");
  const orderNumber = `CRK-${year}${month}-${random}`;

  // TODO: In production, this will:
  // 1. Create the order in Supabase (status: pending)
  // 2. Create a Stripe Checkout Session with line items
  // 3. Return the Stripe Checkout URL for redirect
  // For now, return a fake order number

  return { success: true, orderNumber };
}
