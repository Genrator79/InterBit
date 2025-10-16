const express = require("express");
const { getAllMentors, createMentor, updateMentor } = require("../controllers/mentor-controller");
const authMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/admin-middleware");

const router = express.Router();

// get all mentors
router.get("/", authMiddleware, getAllMentors);

router.post("/", authMiddleware, isAdminUser, createMentor);

router.put("/:id", authMiddleware, isAdminUser, updateMentor);

module.exports = router;
