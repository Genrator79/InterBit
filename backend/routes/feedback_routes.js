const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { google } = require("@ai-sdk/google");
const { generateObject } = require("ai");
const { feedbackSchema } = require("../constants/feedbackSchema.js");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create-feedback", async (req, res) => {
  try {
    const { interviewId, transcript } = req.body;

    if (!interviewId || !transcript)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const formattedTranscript = transcript
      .map((s) => `- ${s.role}: ${s.content}\n`)
      .join("");

    // ---- AI FEEDBACK GENERATION ----
    const { object } = await generateObject({
      model: google("gemini-2.5-flash", {
        structuredOutputs: false,
      }),
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
    const finalAssessment = object.finalAssessment;

    // --- UPDATE INTERVIEW RECORD IN POSTGRES ----
    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        score: totalScore,
        feedback: object, // Store the full JSON object
        status: "COMPLETED",
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
    console.error("Error details:", JSON.stringify(error, null, 2)); // Log full error details
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
