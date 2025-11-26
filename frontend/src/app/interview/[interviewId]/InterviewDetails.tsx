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
  id: string;
}

export default function InterviewDetails({ interview, id }: InterviewDetailsProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();
    if (!user) return null;
  useEffect(() => {
    if (user === null) router.push("/login");
    
  }, [user, router]);

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />

            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        username={user.username}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </>
  );
}
