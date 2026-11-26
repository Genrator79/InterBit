// backend/src/controllers/mentor-controller.js

const prisma = require("../lib/prisma");

// ----------------------
// Get all mentors
// ----------------------
async function getAllMentors(req, res) {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        _count: { select: { interviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "All mentors fetched successfully!",
      mentors: mentors.map((mentor) => ({
        ...mentor,
        interviewCount: mentor._count.interviews,
      })),
    });
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
    });
  }
}

// ----------------------
// Create a mentor
// ----------------------
async function createMentor(req, res) {
  try {
    const { name, email, phone, speciality, bio, imageUrl, isActive } = req.body;

    if (!name || !email || !speciality) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and speciality are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const mentor = await prisma.mentor.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        phone,
        speciality,
        bio,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({
      success: true,
      message: "New mentor added successfully!",
      mentor,
    });
  } catch (err) {
    console.error("Error creating mentor:", err);

    if (err.code === "P2002") {
      // Prisma unique constraint violation (email)
      return res.status(400).json({
        success: false,
        message: "A mentor with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create mentor",
    });
  }
}

// ----------------------
//  * Update a mentor by ID
// ----------------------
async function updateMentor(req, res) {
  const { id } = req.params;
  const { name, email, phone, speciality, bio, imageUrl, isActive } = req.body;

  if (!name || !email || !speciality) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and speciality are required.",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const updatedMentor = await prisma.mentor.update({
      where: { id },
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        phone,
        speciality,
        bio,
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Mentor updated successfully!",
      mentor: updatedMentor,
    });
  } catch (err) {
    console.error("Error updating mentor:", err);
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A mentor with this email already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update mentor.",
    });
  }
}


// ----------------------
// Delete a mentor
// ----------------------
async function deleteMentor(req, res) {
  const { id } = req.params;

  try {
    const mentor = await prisma.mentor.findUnique({ where: { id } });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    await prisma.mentor.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Mentor deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting mentor:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete mentor",
    });
  }
}

// ----------------------
// Export the functions
// ----------------------
module.exports = {
  getAllMentors,
  createMentor,
  updateMentor,
  deleteMentor
};
