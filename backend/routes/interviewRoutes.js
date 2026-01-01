const express = require("express");
const authMiddleware = require("../middleware/auth-middleware")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

// -------------------------
// GET /interviews
// Fetch all interviews or user-specific if userId query param provided
// -------------------------
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
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch interviews" });
  }
});

// -------------------------
// GET /interviews/me/stats
// User interview stats
// -------------------------
router.get("/me/stats", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

    const total = await prisma.interview.count({ where: { userId } });
    const completed = await prisma.interview.count({ where: { userId, status: "COMPLETED" } });

    res.status(200).json({ success: true, message: "Stats fetched!", stats: { total, completed } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// -------------------------
// GET /interviews
// Fetch all interviews or user-specific if userId query param provided
// -------------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;

    // Check if the user is a mentor and wants their mentor interviews
    // We can interpret this from the user role in the token (avail via authMiddleware usually, but here we query user)
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    let whereClause = {};

    if (user && user.role === "MENTOR") {
      // Find the mentor record associated with this user's email
      const mentor = await prisma.mentor.findUnique({ where: { email: user.email } });
      if (mentor) {
        // If user is mentor, get interviews where they are the mentor OR the user (if they book for themselves)
        whereClause = {
          OR: [
            { mentorId: mentor.id },
            { userId: Number(userId) }
          ]
        };
      } else {
        // Fallback: if role is MENTOR but no Mentor profile found (shouldn't happen with our fix), treat as User
        whereClause = { userId: Number(userId) };
      }
    } else {
      whereClause = userId ? { userId: Number(userId) } : {};
    }

    const interviews = await prisma.interview.findMany({
      where: whereClause,
      include: { user: true, mentor: true },
      orderBy: { date: "asc" },
    });

    res.status(200).json({
      success: true,
      message: "Interviews fetched successfully!",
      interviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch interviews" });
  }
});


// -------------------------
// GET /interviews/booked-slots
// Fetch booked slots for a mentor on a date
// -------------------------
router.get("/booked-slots", authMiddleware, async (req, res) => {
  try {
    const { mentorId, date } = req.query;
    if (!mentorId || !date)
      return res
        .status(400)
        .json({ success: false, message: "mentorId and date required" });

    const interviews = await prisma.interview.findMany({
      where: { mentorId, date: new Date(date) },
      select: { time: true },
    });

    const slots = interviews.map((i) => i.time);
    res.status(200).json({
      success: true,
      message: "Booked slots fetched successfully!",
      slots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch booked slots" });
  }
});

// -------------------------
// POST /interviews/book
// Book a new interview
// -------------------------
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { userId, mentorId, date, time, type = "AI", duration = 60 } = req.body;
    if (!userId || !date || !time)
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });

    const interview = await prisma.interview.create({
      data: {
        userId,
        mentorId: mentorId || null,
        date: new Date(date),
        time,
        type,
        duration,
      },
      include: { user: true, mentor: true },
    });

    res.status(200).json({
      success: true,
      message: "Interview booked successfully!",
      interview,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to book interview" });
  }
});

// -------------------------
// PATCH /interviews/:id/status
// Update interview status
// -------------------------
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Fetch current interview details
    const existingInterview = await prisma.interview.findUnique({
      where: { id },
    });

    if (!existingInterview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    // 2. If trying to mark as COMPLETED, validate date/time
    if (status === "COMPLETED") {
      const interviewDate = new Date(existingInterview.date);
      const timeString = existingInterview.time; // e.g., "10:00 AM" or "14:00"

      // Parse time string to adjust interviewDate
      // Assuming format "HH:mm" or "h:mm A"
      let hours = 0;
      let minutes = 0;

      if (timeString) {
        const [timePart, modifier] = timeString.split(" ");
        let [h, m] = timePart.split(":").map(Number);

        if (modifier) {
          if (modifier === "PM" && h < 12) h += 12;
          if (modifier === "AM" && h === 12) h = 0;
        }
        hours = h;
        minutes = m;
      }

      interviewDate.setHours(hours, minutes, 0, 0);

      const now = new Date();

      if (now < interviewDate) {
        return res.status(400).json({
          success: false,
          message: "Cannot mark interview as completed before its scheduled time."
        });
      }
    }

    const interview = await prisma.interview.update({
      where: { id },
      data: { status },
      include: { user: true, mentor: true },
    });

    res.status(200).json({
      success: true,
      message: "Interview status updated successfully!",
      interview,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});




module.exports = router;

