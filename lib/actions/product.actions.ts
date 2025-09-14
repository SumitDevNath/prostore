"use server";

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { convertToPlainObject } from "../utils";

// Get Latest Products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObject(data);
}

// Get Single Product by its Slug
export async function getProductsbySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
