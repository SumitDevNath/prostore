import { inserProductSchema } from "@/lib/validators";
import z from "zod";

export type Product = z.infer<typeof inserProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
