"use client";

import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Agent from "@/components/agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getRandomInterviewCover } from "@/lib/utils";
import { Interview } from "@/hooks/use-interviews";

interface InterviewDetailsProps {
  interview: Interview;
  interviewId: string;
}

export default function InterviewDetails({ interview, interviewId }: InterviewDetailsProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Redirect logic — must run inside effect
  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user, router]);

  // Loading state BEFORE redirect resolves
  if (user === undefined) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  // When redirect triggered, avoid rendering twice
  if (user === null) return null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0D0F18] py-10">

      {/* TOP SECTION */}
      <div className="w-full max-w-[95vw] bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={60}
                height={60}
                className="rounded-xl shadow-lg object-cover border-2 border-white/20"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0D0F18] animate-pulse" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 capitalize tracking-tight">
                {interview.role} Interview
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-white/40 text-sm font-medium uppercase tracking-wider">Tech Stack:</span>
                <DisplayTechIcons techStack={interview.techstack} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Status</p>
              <p className="text-emerald-400 font-bold">Active</p>
            </div>
            <span className="px-5 py-2 bg-white/5 rounded-full text-sm font-semibold text-white border border-white/10 capitalize shadow-inner">
              {interview.type}
            </span>
          </div>
        </div>
      </div>

      {/* AGENT */}
      <div className="w-full max-w-[95vw] mt-6 flex-1 flex flex-col">
        <Agent
          username={user.username}
          userId={user.id}
          interviewId={interviewId}
          type="interview"
          questions={interview.questions}
        />
      </div>
    </div>
  );
}
