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

export const getAvailableTimeSlots = () => {
  return [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
};

export const getNext5Days = () => {
  const dates = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (let i = 0; i < 5; i++) {
    const date = new Date(tomorrow);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};


export const INTERVIEW_TYPES = [
  { id: "technical", name: "Technical Interview", duration: "60 min", price: "$100" },
  { id: "hr", name: "HR Interview", duration: "45 min", price: "$80" },
  { id: "mock", name: "Mock Interview", duration: "30 min", price: "$50" },
  { id: "system_design", name: "System Design Interview", duration: "75 min", price: "$120" },
];
