import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a token balance string with fixed decimal places.
 * e.g. "0.012345678901234567" → "0.01234567"
 */
export function formatBalance(value: string, decimals = 8): string {
  return Number.parseFloat(value).toFixed(decimals);
}
