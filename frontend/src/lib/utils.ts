import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// phone formatting function for Indian numbers 🇮🇳
export const formatIndianPhoneNumber = (value: string) => {
  if (!value) return value;

  // remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  // start building formatted string
  if (phoneNumberLength === 0) return "";
  if (phoneNumberLength <= 5) return `+91 ${phoneNumber}`;
  if (phoneNumberLength <= 10)
    return `+91 ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
  
  // in case the user types with country code
  if (phoneNumberLength > 10 && phoneNumber.startsWith("91")) {
    const trimmed = phoneNumber.slice(2, 12); // only keep 10 digits after +91
    return `+91 ${trimmed.slice(0, 5)}-${trimmed.slice(5)}`;
  }

  return `+91 ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5, 10)}`;
};
