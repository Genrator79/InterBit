import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ADD THESE IMPORTS
import { interviewCovers, mappings } from "@/constants";

// --------- YOUR EXISTING UTILITY ----------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------- ADDED UTILITIES FOR InterviewCard ---------

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

// convert "React JS" → "react", "node.js" → "nodejs"
const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

// check if icon exists on CDN
const checkIconExists = async (url: string) => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

// MAIN: returns array of tech → logo URL
export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

// RANDOM COVER FOR INTERVIEW CARD
export const getRandomInterviewCover = () => {
  const i = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[i]}`;
};

// ---------------- YOUR EXISTING FUNCTIONS (KEEP) ----------------

export const formatIndianPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength === 0) return "";
  if (phoneNumberLength <= 5) return `+91 ${phoneNumber}`;
  if (phoneNumberLength <= 10)
    return `+91 ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;

  if (phoneNumberLength > 10 && phoneNumber.startsWith("91")) {
    const trimmed = phoneNumber.slice(2, 12);
    return `+91 ${trimmed.slice(0, 5)}-${trimmed.slice(5)}`;
  }

  return `+91 ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5, 10)}`;
};

export const getAvailableTimeSlots = () => [
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

export const getNext5Days = () => {
  const dates = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (let i = 0; i < 5; i++) {
    const d = new Date(tomorrow);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates;
};

export const INTERVIEW_TYPES = [
  { id: "technical", name: "Technical Interview", duration: "60 min", price: "$100" },
  { id: "hr", name: "HR Interview", duration: "45 min", price: "$80" },
  { id: "mock", name: "Mock Interview", duration: "30 min", price: "$50" },
  { id: "system_design", name: "System Design Interview", duration: "75 min", price: "$120" },
];
