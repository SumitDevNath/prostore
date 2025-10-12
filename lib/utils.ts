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

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  // Guard null/undefined
  if (error == null) return "An unknown error occurred";

  // Handle Zod error (supports both .flatten() and .issues)
  if (
    error.name === "ZodError" ||
    typeof error?.flatten === "function" ||
    Array.isArray(error?.issues)
  ) {
    try {
      // Preferred: use Zod's flatten()
      if (typeof error.flatten === "function") {
        const { formErrors = [], fieldErrors = {} } = error.flatten();
        const messages: string[] = [];

        if (Array.isArray(formErrors)) messages.push(...formErrors);

        if (fieldErrors && typeof fieldErrors === "object") {
          for (const errs of Object.values(fieldErrors)) {
            if (Array.isArray(errs) && errs.length)
              messages.push(String(errs[0]));
          }
        }

        if (messages.length) return messages.join(". ");
      }

      // Fallback: use first issue if available
      if (Array.isArray(error.issues) && error.issues.length) {
        const first = error.issues[0];
        const path = Array.isArray(first.path) ? first.path.join(".") : "";
        return path
          ? `${path}: ${first.message}`
          : String(first.message ?? "Validation failed");
      }

      // Legacy shape (if someone passed a custom { errors: { field: { message }}})
      if (error.errors && typeof error.errors === "object") {
        const fieldErrors = Object.keys(error.errors).map((field) => {
          const msg = error.errors[field]?.message;
          return typeof msg === "string" ? msg : JSON.stringify(msg);
        });
        if (fieldErrors.length) return fieldErrors.join(". ");
      }

      return "Validation failed";
    } catch {
      return "Validation failed";
    }
  }

  // Handle Prisma error
  if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target[0]
      : error.meta?.target ?? "Field";
    const field = String(target);
    return `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
  }

  // Handle other errors (prefer standard .message)
  if (typeof error.message === "string" && error.message) return error.message;

  // Fallback for unknown errors
  try {
    const s = JSON.stringify(error.message ?? error);
    return s && s !== "{}" ? s : "An unknown error occurred";
  } catch {
    return "An unknown error occurred";
  }
}

// Round to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100; // avoid rounding errors
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is not a number nor a string");
  }
};
