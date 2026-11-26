const express = require("express");
const prisma = require("../lib/prisma");
const { generateObject } = require("ai");
const { google } = require("@ai-sdk/google");
const { z } = require("zod");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

// ===========================
//  CREATE INTERVIEW
// ===========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type = "Technical", role, level = "Mid-level", techstack = "", amount = 5, userid, userId } = req.body;

    const targetUserId = req.userInfo?.userId || parseInt(userId || userid, 10);

    if (!role || !targetUserId || isNaN(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields: role and valid userId" });
    }

    // Safely parse techstack
    let techstackArray = [];
    if (Array.isArray(techstack)) {
      techstackArray = techstack.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof techstack === "string") {
      techstackArray = techstack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const questionCount = Math.min(Math.max(parseInt(amount, 10) || 5, 1), 15);

    // 1️⃣ Generate interview questions using structured object output
    const { object: parsedQuestions } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.array(z.string()).min(1),
      prompt: `Prepare interview questions for a job interview.
Role: ${role}
Experience Level: ${level}
Tech Stack: ${techstackArray.join(", ") || "General"}
Focus: ${type}
Number of Questions: ${questionCount}
Generate exactly ${questionCount} relevant, challenging, and clear interview questions.`,
    });

    // 2️⃣ Save to DB using Prisma
    const interview = await prisma.interview.create({
      data: {
        role,
        type: "AI",
        level,
        techstack: techstackArray,
        questions: parsedQuestions,
        userId: targetUserId,
        finalized: true,
      },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview created successfully!",
      interviewId: interview.id,
      questions: interview.questions,
      interview,
    });
  } catch (error) {
    console.error("Error creating AI interview:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to create AI interview" });
  }
});

// ===========================
//  GET ALL AI INTERVIEWS
// ===========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: { type: "AI" },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "AI Interviews fetched successfully!",
      interviews,
    });
  } catch (err) {
    console.error("Error fetching AI interviews:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch AI interviews" });
  }
});

// ===========================
//  GET AI INTERVIEW BY ID
// ===========================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
      },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "AI Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Error fetching AI interview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI interview",
    });
  }
});

module.exports = router;
