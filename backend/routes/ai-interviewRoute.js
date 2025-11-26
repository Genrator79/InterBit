const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { generateText } = require("ai");
const { google } = require("@ai-sdk/google");
// const { getRandomInterviewCover } = require("../lib/utils");

const router = express.Router();
const prisma = new PrismaClient();

// ===========================
//  CREATE INTERVIEW
// ===========================
router.post("/", async (req, res) => {
    try {
        const { type, role, level, techstack, amount, userid } = req.body;

        if (!role || !userid) {
            return res
                .status(400)
                .json({ success: false, message: "Missing role or userid" });
        }

        // 1️⃣ Generate interview questions
        const { text: questionsText } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions should be returned in JSON array format like ["Q1", "Q2"].`,
        });

        // 2️⃣ Parse model response safely
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questionsText);
            if (!Array.isArray(parsedQuestions)) throw new Error("Invalid format");
        } catch (err) {
            console.error("Invalid model response:", questionsText);
            throw new Error("AI response parsing failed");
        }

        // 3️⃣ Save to DB using Prisma
        const interview = await prisma.interview.create({
            data: {
                role,
                type,
                level,
                techstack: techstack.split(",").map((s) => s.trim()),
                questions: parsedQuestions,
                userId: parseInt(userid),
                finalized: true,
                // coverImage: getRandomInterviewCover(),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Interview created successfully!",
            interview,
        });
    } catch (error) {
        console.error("Error creating interview:", error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Server error" });
    }
});

// ===========================
//  GET ALL INTERVIEWS
// ===========================


router.get("/", async (req, res) => {
    try {
        const interviews = await prisma.interview.findMany({
            include: { user: true, mentor: true },
            orderBy: { date: "asc" },
        });

        res.status(200).json({
            success: true,
            message: "Interviews fetched successfully!",
            interviews,
        });
    } catch (err) {
        console.error("Error fetching interviews:", err);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch interviews" });
    }
});


// ===========================
//  GET AI INTERVIEW BY ID
// ===========================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await prisma.interview.findUnique({
      where: { id }, // cuid → STRING ID
      include: { user: true }
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "AI Interview not found"
      });
    }

    return res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    console.error("Error fetching AI interview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI interview"
    });
  }
});


module.exports = router;
