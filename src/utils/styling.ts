import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Styling utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
