import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logger = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "%c[DEV]:",
      "background-color: yellow; color: black",
      JSON.stringify(args, null, 2)
    );
  }
};
