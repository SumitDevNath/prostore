"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      try {
        // Execute the addItemToCart action
        const res = await addItemToCart(item);

        // Display appropriate toast message based on the result
        if (!res.success) {
          toast.error("Couldn't add to cart", {
            description: res?.message || "Please try again.",
            closeButton: true,
            className: "rounded-xl ring-1 ring-red-700/40",
          });
          return;
        }
        // handle success add to cart
        toast.success("Added to cart", {
          // description: `${item.name ?? "Item"} has been added to the cart.`,
          description: res.message,
          action: { label: "Go to cart", onClick: () => router.push("/cart") },
        });
      } catch (err) {
        toast.error("Unexpected error", {
          description: "Something went wrong. Please try again.",
        });
      }
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast(res.message, {
        description: res.success,
        className: res.success
          ? undefined
          : "bg-red-600 text-white border-red-700",
        closeButton: true,
      });
    });
  };

  // check if item is in the cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;
