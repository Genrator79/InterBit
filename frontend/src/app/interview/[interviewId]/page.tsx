import { redirect } from "next/navigation";
import InterviewDetails from "./InterviewDetails";
import { fetchInterviewById } from "@/hooks/ai-interviews";

export default async function InterviewPage({ params }: RouteParams) {
  const { id } = await params;

  const interview = await fetchInterviewById(id);
  if (!interview) {
    return redirect("/ai-interview");
  }

  return <InterviewDetails interview={interview} id={id} />;
}
