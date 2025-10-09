"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = { item: CartItem };

const AddToCart = ({ item }: Props) => {
  const router = useRouter();

  const handleAddToCart = async () => {
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
        description: `${item.name ?? "Item"} has been added to the cart.`,
        action: { label: "Go to cart", onClick: () => router.push("/cart") },
      });
    } catch (err) {
      toast.error("Unexpected error", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};

export default AddToCart;
