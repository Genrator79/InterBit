const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const prisma = require("../lib/prisma");

const router = express.Router();

const VALID_STATUSES = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];

// -------------------------
// GET /interviews
// Fetch all interviews (protected)
// -------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
        mentor: true,
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json({
      success: true,
      message: "Interviews fetched successfully!",
      interviews,
    });
  } catch (err) {
    console.error("Error fetching interviews:", err);
    res.status(500).json({ success: false, message: "Failed to fetch interviews" });
  }
});

// -------------------------
// GET /interviews/me/stats
// User interview stats
// -------------------------
router.get("/me/stats", authMiddleware, async (req, res) => {
  try {
    // Read from authenticated token first, or query param if admin
    const queryUserId = Number(req.query.userId);
    const userId = (req.userInfo?.role === "ADMIN" && queryUserId) ? queryUserId : req.userInfo?.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const total = await prisma.interview.count({ where: { userId } });
    const completed = await prisma.interview.count({ where: { userId, status: "COMPLETED" } });

    res.status(200).json({ success: true, message: "Stats fetched!", stats: { total, completed } });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// -------------------------
// GET /interviews/me
// Fetch interviews for authenticated user or mentor
// -------------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const queryUserId = Number(req.query.userId);
    const userId = (req.userInfo?.role === "ADMIN" && queryUserId) ? queryUserId : req.userInfo?.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let whereClause = { userId };

    if (user.role === "MENTOR") {
      const mentor = await prisma.mentor.findUnique({ where: { email: user.email } });
      if (mentor) {
        whereClause = {
          OR: [{ mentorId: mentor.id }, { userId }],
        };
      }
    }

    const interviews = await prisma.interview.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
        mentor: true,
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json({
      success: true,
      message: "Interviews fetched successfully!",
      interviews,
    });
  } catch (err) {
    console.error("Error fetching my interviews:", err);
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
    if (!mentorId || !date) {
      return res.status(400).json({ success: false, message: "mentorId and date required" });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const interviews = await prisma.interview.findMany({
      where: {
        mentorId,
        date: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ["CANCELLED", "REJECTED"] },
      },
      select: { time: true },
    });

    const slots = interviews.map((i) => i.time);
    res.status(200).json({
      success: true,
      message: "Booked slots fetched successfully!",
      slots,
    });
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    res.status(500).json({ success: false, message: "Failed to fetch booked slots" });
  }
});

// -------------------------
// POST /interviews/book
// Book a new interview
// -------------------------
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { mentorId, date, time, type = "HUMAN", duration = 60, userId: bodyUserId } = req.body;

    const bookingUserId = req.userInfo?.role === "ADMIN" && bodyUserId ? Number(bodyUserId) : req.userInfo?.userId;

    if (!bookingUserId || !date || !time) {
      return res.status(400).json({ success: false, message: "Missing required fields: date and time" });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Verify mentor exists if mentorId is provided
    if (mentorId) {
      const mentor = await prisma.mentor.findUnique({ where: { id: mentorId } });
      if (!mentor) {
        return res.status(404).json({ success: false, message: "Mentor not found" });
      }

      // Check for double booking
      const startOfDay = new Date(targetDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const existingBooking = await prisma.interview.findFirst({
        where: {
          mentorId,
          time,
          date: { gte: startOfDay, lte: endOfDay },
          status: { notIn: ["CANCELLED", "REJECTED"] },
        },
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: "This mentor is already booked for this date and time slot",
        });
      }
    }

    const interview = await prisma.interview.create({
      data: {
        userId: bookingUserId,
        mentorId: mentorId || null,
        date: targetDate,
        time,
        type,
        duration: parseInt(duration, 10) || 60,
      },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
        mentor: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Interview booked successfully!",
      interview,
    });
  } catch (err) {
    console.error("Error booking interview:", err);
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

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    // 1. Fetch current interview details
    const existingInterview = await prisma.interview.findUnique({
      where: { id },
      include: { mentor: true },
    });

    if (!existingInterview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    // 2. Authorization check: Admin, or candidate owner, or assigned mentor
    const currentUserId = req.userInfo?.userId;
    const userRole = req.userInfo?.role;

    // Resolve user's email (from token or fallback DB lookup for existing tokens)
    let userEmail = req.userInfo?.email;
    if (!userEmail && currentUserId) {
      const userRecord = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { email: true },
      });
      userEmail = userRecord?.email;
    }

    const isCandidate = existingInterview.userId === currentUserId;
    const isAdmin = userRole === "ADMIN";

    let isAssignedMentor = false;
    if (existingInterview.mentor && userEmail) {
      if (existingInterview.mentor.email.toLowerCase() === userEmail.toLowerCase()) {
        isAssignedMentor = true;
      }
    } else if (existingInterview.mentorId && userEmail) {
      const mentorRecord = await prisma.mentor.findUnique({ where: { email: userEmail } });
      if (mentorRecord && mentorRecord.id === existingInterview.mentorId) {
        isAssignedMentor = true;
      }
    }

    if (!isCandidate && !isAssignedMentor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this interview status",
      });
    }

    const interview = await prisma.interview.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
        mentor: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Interview status updated successfully!",
      interview,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

module.exports = router;
