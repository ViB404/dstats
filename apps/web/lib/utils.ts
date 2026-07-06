import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const encodeKey = (key: string): string => {
  if (!key) return "";
  try {
    return btoa(encodeURIComponent(key));
  } catch (error) {
    console.error("Encoding failed. Returning raw key.", error);
    return key;
  }
};

export const decodeKey = (encoded: string): string => {
  if (!encoded) return "";
  try {
    return decodeURIComponent(atob(encoded));
  } catch (error) {
    console.warn("Decode failed: Data is not valid Base64.");
    return encoded;
  }
};