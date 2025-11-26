import axios from "@/utils/axios";

export async function fetchInterviewByIdServer(id: string) {
  try {
    const res = await axios.get(`/ai-interviews/${id}`);
    return res.data.interview; // return raw object, do NOT transform here
  } catch (error) {
    console.error("Server fetchInterviewById error:", error);
    return null;
  }
}
