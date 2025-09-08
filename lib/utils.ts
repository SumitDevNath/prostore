import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// tailwind class mix
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object to regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
