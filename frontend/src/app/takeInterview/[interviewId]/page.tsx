import { redirect } from "next/navigation";
import InterviewDetails from "./InterviewDetails";
import { fetchInterviewByIdServer } from "@/lib/actions/fetchInterviewById";

interface RouteParams {
  params: {
    interviewId: string;
  };
}

export default async function InterviewPage({ params }: RouteParams) {
  const { interviewId } = await params;

  const interview = await fetchInterviewByIdServer(interviewId);

  if (!interview) {
    return redirect("/ai-interview");
  }

  return (
    <InterviewDetails
      interview={interview}
      interviewId={interviewId}
    />
  );
}
