import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hasSwearWords(text: string) {
  // const apiKey = process.env.NEXT_PUBLIC_NINJA_API_KEY;

  // if (!apiKey) {
  //   throw new Error("NINJA_API_KEY is not defined in the environment variables.");
  // }

  // const response = await fetch(`https://api.api-ninjas.com/v1/profanityfilter?text=${text}`, {
  //   headers: {
  //     "X-Api-Key": apiKey,
  //   },
  // });
  // const data = await response.json(); 

  // return data;
  return { has_profanity: false, text: text };
}


export function generateGameId(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}


export function generateJoinCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}
