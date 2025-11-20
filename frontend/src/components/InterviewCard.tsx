"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { useMemo } from "react";

// Local covers
const covers = [
  "/covers/adobe.png",
  "/covers/amazon.png",
  "/covers/facebook.png",
  "/covers/hostinger.png",
  "/covers/pinterest.png",
  "/covers/quora.png",
  "/covers/reddit.png",
  "/covers/skype.png",
  "/covers/spotify.png",
  "/covers/telegram.png",
  "/covers/tiktok.png",
  "/covers/yahoo.png",
];

interface InterviewCardProps {
  interviewId: string;
  role: string | null;
  type: string;
  techstack: string[];
  createdAt: string;
}

export default function InterviewCard({
  interviewId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) {
  const formattedType =
    type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase();

  const formattedDate = createdAt
    ? dayjs(createdAt).format("MMM D, YYYY")
    : "Unknown";

  const randomCover = useMemo(
    () => covers[Math.floor(Math.random() * covers.length)],
    []
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-md p-6 flex flex-col gap-6 h-full text-white">
      
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src={randomCover}
          alt="company-logo"
          width={80}
          height={80}
          className="rounded-full shadow-lg object-cover"
        />
      </div>

      {/* Role */}
      <h3 className="text-xl font-bold text-center">
        {role || "General Interview"}
      </h3>

      {/* Date */}
      <div className="flex justify-center items-center gap-2 text-sm text-gray-300">
        <Image src="/calendar.svg" alt="calendar" width={18} height={18} />
        <span>{formattedDate}</span>
      </div>

      {/* Description */}
      <p className="text-center text-gray-400 text-sm px-2 leading-relaxed">
        Prepare for this {formattedType.toLowerCase()} interview and improve your
        skills with real interview questions.
      </p>

      {/* Tech Stack */}
      <div className="flex justify-center">
        {techstack?.length > 0 ? (
          <DisplayTechIcons techStack={techstack} />
        ) : (
          <p className="text-gray-500 text-xs">No tech</p>
        )}
      </div>

      {/* CTA Button */}
      <Button className="btn-primary w-full mt-auto">
        <Link href={`/interview/${interviewId}`}>View Interview</Link>
      </Button>
    </div>
  );
}
