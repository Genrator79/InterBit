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
      <div className="w-full max-w-3xl bg-gradient-to-b from-[#1C1E2D] to-[#13141F] rounded-2xl shadow-xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={55}
              height={55}
              className="rounded-full shadow-md object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold text-white capitalize">
                {interview.role} Interview
              </h1>
              <div className="mt-1">
                <DisplayTechIcons techStack={interview.techstack} />
              </div>
            </div>
          </div>

          <span className="px-4 py-1 bg-white/10 rounded-full text-sm text-white border border-white/20 capitalize">
            {interview.type}
          </span>
        </div>

        <div className="bg-gradient-to-b from-[#2A2D43] to-[#161826] rounded-2xl p-10 flex flex-col items-center border border-white/10 shadow-lg">
          <Image
            src="/ai-avatar.png"
            alt="AI interviewer"
            width={85}
            height={85}
            className="mb-3 opacity-90"
          />
          <h2 className="text-2xl text-white font-semibold">AI Interviewer</h2>
        </div>
      </div>

      {/* USER CARD */}
      <div className="mt-8 w-full max-w-3xl bg-[#11131C] rounded-2xl border border-white/10 p-10 shadow-lg flex flex-col items-center">
        <Image
          src="/user-avatar.png"
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full border border-white/20 object-cover"
        />
        <h3 className="mt-4 text-lg font-semibold text-white tracking-wide">
          {user.username.toUpperCase()}
        </h3>

        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-full text-lg font-medium shadow-md transition">
          Call
        </button>
      </div>

      {/* AGENT */}
      {/* <div className="w-full max-w-3xl mt-10">
        <Agent
          username={user.username}
          userId={user.id}
          interviewId={interviewId}
          type="interview"
          questions={interview.questions}
        />
      </div> */}
    </div>
  );
}
