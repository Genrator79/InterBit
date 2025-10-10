// backend/src/controllers/mentor-controller.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

        const mentor = await prisma.mentor.create({
            data: {
                name,
                email,
                phone,
                speciality,
                bio,
                imageUrl,
                isActive,
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
async  function updateMentor(req, res) {
  const { id } = req.params;
  const { name, email, phone, speciality, bio, isActive } = req.body;

  if (!name || !email || !speciality) {
    return res.status(400).json({ error: "Name, email, and speciality are required." });
  }

  try {
    const updatedMentor = await prisma.mentor.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        speciality,
        bio,
        isActive,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Mentor updated successfully!",
      mentor: updatedMentor,
    });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Mentor not found." });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already exists." });
    }
    return res.status(500).json({ error: "Failed to update mentor." });
  }
};

// ----------------------
// Export the functions
// ----------------------
module.exports = {
    getAllMentors,
    createMentor,
    updateMentor
};
