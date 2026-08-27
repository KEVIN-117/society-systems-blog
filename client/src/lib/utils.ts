import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReadingTime(text: string = ''): string {
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return `${time} min de lectura`;
}
