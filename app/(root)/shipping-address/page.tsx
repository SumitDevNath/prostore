// app/(root)/shipping-address/page.tsx
import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import type { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

export default async function ShippingAddressPage() {
  // 1) Require an authenticated user first (redirect if guest)
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/shipping-address")}`);
  }
  const userId = session.user.id;

  // 2) Ensure there is a cart
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // 3) Load user and render
  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}
