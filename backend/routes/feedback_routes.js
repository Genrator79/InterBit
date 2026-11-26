const express = require("express");
const prisma = require("../lib/prisma");
const { google } = require("@ai-sdk/google");
const { generateObject } = require("ai");
const { feedbackSchema } = require("../constants/feedbackSchema.js");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/create-feedback", authMiddleware, async (req, res) => {
  try {
    const { interviewId, transcript } = req.body;

    if (!interviewId || !transcript || !Array.isArray(transcript)) {
      return res.status(400).json({ success: false, message: "Missing interviewId or valid transcript array" });
    }

    // Verify interview exists before invoking AI model
    const existingInterview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!existingInterview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    const formattedTranscript = transcript
      .map((s) => `- ${s.role || "Speaker"}: ${s.content || ""}\n`)
      .join("");

    // ---- AI FEEDBACK GENERATION ----
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const totalScore = object.totalScore;

    // --- UPDATE INTERVIEW RECORD IN POSTGRES ----
    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        score: totalScore,
        feedback: object, // Store the full JSON object
        status: "COMPLETED",
      },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
      },
    });

    return res.json({
      success: true,
      interviewId: updated.id,
      score: updated.score,
      feedback: updated.feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to generate feedback" });
  }
});

module.exports = router;
