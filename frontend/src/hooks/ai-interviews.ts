import axios from "@/utils/axios";
import { Interview } from "@/hooks/use-interviews";
import { transformInterview } from "@/hooks/use-interviews";

export async function fetchInterviewById(id: string): Promise<Interview | null> {
  try {
    const res = await axios.get(`/ai-interviews/${id}`);
    return transformInterview(res.data.interview);
  } catch (error) {
    console.error("Server fetchInterviewById error:", error);
    return null;
  }
}
