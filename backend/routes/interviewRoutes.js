const express = require("express");
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
// GET /interviews
// Fetch all interviews or user-specific if userId query param provided
// -------------------------
router.get("/me", async (req, res) => {
  try {
    const { userId } = req.query;
    const whereClause = userId ? { userId: Number(userId) } : {};

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
// GET /interviews/me/stats
// User interview stats
// -------------------------
router.get("/me/stats", async (req, res) => {
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
// GET /interviews/booked-slots
// Fetch booked slots for a mentor on a date
// -------------------------
router.get("/booked-slots", async (req, res) => {
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
router.post("/book", async (req, res) => {
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
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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
